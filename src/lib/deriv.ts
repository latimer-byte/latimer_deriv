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

  constructor() {
    this.connect();
  }

  private connect() {
    const endpoint = `wss://ws.binaryws.com/websockets/v3?app_id=${this.appId}`;
    this.socket = new WebSocket(endpoint);

    this.socket.onopen = () => {
      console.log('Deriv WebSocket connected');
      // Send ping every 30 seconds to keep connection alive
      setInterval(() => this.send({ ping: 1 }), 30000);
    };

    this.socket.onmessage = (event) => {
      const response: DerivResponse = JSON.parse(event.data);
      const reqId = response.req_id?.toString();

      if (reqId && this.callbacks.has(reqId)) {
        const callback = this.callbacks.get(reqId);
        if (callback) {
          callback(response);
          this.callbacks.delete(reqId);
        }
      }

      // Handle subscription messages (ticks, etc.)
      if (response.msg_type === 'tick') {
        this.broadcast('tick', response);
      }
    };

    this.socket.onclose = () => {
      console.log('Deriv WebSocket disconnected, reconnecting...');
      setTimeout(() => this.connect(), 5000);
    };
  }

  private listeners: Map<string, Set<(data: any) => void>> = new Map();

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
    });
  }

  // Helper for subscriptions
  subscribe(request: DerivRequest, onData: (data: any) => void) {
    const reqId = (++this.messageId).toString();
    const payload = { ...request, subscribe: 1, req_id: reqId };

    this.callbacks.set(reqId, (response) => {
      if (response.error) {
        console.error('Subscription error:', response.error);
      }
    });

    this.socket?.send(JSON.stringify(payload));

    const tickHandler = (data: any) => {
      if (data.tick?.symbol === request.ticks) {
        onData(data);
      }
    };

    this.on('tick', tickHandler);

    return () => {
      this.off('tick', tickHandler);
      this.send({ forget: reqId });
    };
  }
}

export const deriv = new DerivService();
