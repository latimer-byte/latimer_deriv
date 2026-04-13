/**
 * Deriv API Service
 * Handles WebSocket connection and messaging with Deriv.
 */

export type DerivRequest = {
  [key: string]: any;
};

export type DerivResponse = {
  msg_type: string;
  error?: {
    code: string;
    message: string;
  };
  [key: string]: any;
};

class DerivService {
  private socket: WebSocket | null = null;
  private appId: string = '1089'; // Default demo app id
  private callbacks: Map<string, (data: DerivResponse) => void> = new Map();
  private messageId: number = 0;

  private pingInterval: any = null;

  constructor() {
    this.connect();
  }

  private connect() {
    if (this.socket) {
      this.socket.onopen = null;
      this.socket.onmessage = null;
      this.socket.onclose = null;
      this.socket.onerror = null;
      try {
        this.socket.close();
      } catch (e) {}
    }

    const endpoint = `wss://ws.binaryws.com/websockets/v3?app_id=${this.appId}`;
    this.socket = new WebSocket(endpoint);

    this.socket.onopen = () => {
      console.log('Deriv WebSocket connected');
      if (this.pingInterval) clearInterval(this.pingInterval);
      this.pingInterval = setInterval(() => {
        if (this.socket?.readyState === WebSocket.OPEN) {
          this.send({ ping: 1 }).catch(() => {});
        }
      }, 30000);
    };

    this.socket.onmessage = (event) => {
      try {
        const response: DerivResponse = JSON.parse(event.data);
        const reqId = response.req_id?.toString();

        if (reqId && this.callbacks.has(reqId)) {
          const callback = this.callbacks.get(reqId);
          if (callback) {
            callback(response);
            this.callbacks.delete(reqId);
          }
        }

        // Handle subscription messages (ticks, ohlc, etc.)
        if (response.msg_type === 'tick') {
          this.broadcast('tick', response);
        } else if (response.msg_type === 'ohlc') {
          this.broadcast('ohlc', response);
        }
      } catch (e) {
        console.error('Error parsing Deriv message:', e);
      }
    };

    this.socket.onclose = () => {
      console.log('Deriv WebSocket disconnected, reconnecting...');
      if (this.pingInterval) {
        clearInterval(this.pingInterval);
        this.pingInterval = null;
      }
      setTimeout(() => this.connect(), 5000);
    };

    this.socket.onerror = (error) => {
      console.error('Deriv WebSocket error:', error);
    };
  }

  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private activeSubscriptions: Map<string, string> = new Map(); // symbol -> subscription_id
  private pendingSubscriptions: Map<string, Promise<string>> = new Map(); // symbol -> promise of subscription_id

  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  off(event: string, callback: (data: any) => void) {
    this.listeners.get(event)?.delete(callback);
  }

  private broadcast(event: string, data: any) {
    this.listeners.get(event)?.forEach(callback => callback(data));
  }

  send(request: DerivRequest): Promise<DerivResponse> {
    return new Promise((resolve, reject) => {
      const executeSend = () => {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
          return reject(new Error('WebSocket not connected'));
        }

        const reqId = (++this.messageId).toString();
        const payload = { ...request, req_id: reqId };

        this.callbacks.set(reqId, (response) => {
          if (response.error) {
            reject(response.error);
          } else {
            resolve(response);
          }
        });

        this.socket.send(JSON.stringify(payload));
      };

      if (!this.socket || this.socket.readyState === WebSocket.CONNECTING || this.socket.readyState === WebSocket.CLOSED || this.socket.readyState === WebSocket.CLOSING) {
        if (this.socket?.readyState === WebSocket.CLOSED || this.socket?.readyState === WebSocket.CLOSING || !this.socket) {
          this.connect();
        }

        let attempts = 0;
        const checkConnection = setInterval(() => {
          attempts++;
          if (this.socket?.readyState === WebSocket.OPEN) {
            clearInterval(checkConnection);
            executeSend();
          } else if (attempts > 50) { // 5 seconds timeout
            clearInterval(checkConnection);
            reject(new Error('WebSocket connection timeout'));
          }
        }, 100);
      } else {
        executeSend();
      }
    });
  }

  // Helper for subscriptions
  subscribe(request: DerivRequest, onData: (data: any) => void) {
    const symbol = request.ticks || request.ticks_history;
    const subType = request.ticks ? 'tick' : 'ohlc';
    const subKey = `${subType}:${symbol}`;

    const messageHandler = (data: any) => {
      if (subType === 'tick' && data.tick?.symbol === symbol) {
        onData(data);
      }
      if (subType === 'ohlc' && data.ohlc?.symbol === symbol) {
        onData(data);
      }
    };

    this.on(subType, messageHandler);

    const startSubscription = async () => {
      if (this.activeSubscriptions.has(subKey)) {
        return this.activeSubscriptions.get(subKey)!;
      }

      if (this.pendingSubscriptions.has(subKey)) {
        return this.pendingSubscriptions.get(subKey)!;
      }

      const promise = (async () => {
        try {
          const response = await this.send({ ...request, subscribe: 1 });
          const subId = response.subscription?.id;
          if (subId) {
            this.activeSubscriptions.set(subKey, subId);
            return subId;
          }
          throw new Error('No subscription ID returned');
        } catch (err: any) {
          if (err.code === 'AlreadySubscribed') {
            // If already subscribed, we might not have the ID, but we can ignore the error
            return 'already_subscribed';
          }
          throw err;
        } finally {
          this.pendingSubscriptions.delete(subKey);
        }
      })();

      this.pendingSubscriptions.set(subKey, promise);
      return promise;
    };

    const subPromise = startSubscription();

    return () => {
      this.off(subType, messageHandler);
      subPromise.then(subId => {
        if (subId && subId !== 'already_subscribed') {
          this.send({ forget: subId }).catch(() => {});
          this.activeSubscriptions.delete(subKey);
        }
      });
    };
  }
}

export const deriv = new DerivService();
