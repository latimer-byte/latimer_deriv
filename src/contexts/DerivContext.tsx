import React, { createContext, useContext, useState, useEffect } from 'react';
import { deriv, DerivResponse } from '@/lib/deriv';

interface DerivContextType {
  isConnected: boolean;
  balance: number;
  currency: string;
  loginId: string;
  isDemo: boolean;
  isGuest: boolean;
  activeSymbols: any[];
  isLoading: boolean;
  error: string | null;
  authorize: (token: string) => Promise<void>;
  setGuestMode: () => void;
  logout: () => void;
}

const DerivContext = createContext<DerivContextType | undefined>(undefined);

export const DerivProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState('USD');
  const [loginId, setLoginId] = useState('');
  const [isDemo, setIsDemo] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [activeSymbols, setActiveSymbols] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Get active symbols
        const symbolsResponse = await deriv.send({ active_symbols: 'brief', product_type: 'basic' });
        setActiveSymbols(symbolsResponse.active_symbols);
        setIsConnected(true);
        
        // Check if we have a saved token
        const savedToken = localStorage.getItem('deriv_token');
        const savedGuest = localStorage.getItem('deriv_guest');

        if (savedToken) {
          await authorize(savedToken);
        } else if (savedGuest === 'true') {
          setGuestMode();
        }
      } catch (err: any) {
        setError(err.message || 'Failed to connect to Deriv');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const setGuestMode = () => {
    setLoginId('GUEST_TRADER');
    setBalance(10000);
    setCurrency('USD');
    setIsDemo(true);
    setIsGuest(true);
    localStorage.setItem('deriv_guest', 'true');
    localStorage.removeItem('deriv_token');
  };

  const authorize = async (token: string) => {
    setIsLoading(true);
    try {
      const response = await deriv.send({ authorize: token });
      setLoginId(response.authorize.loginid);
      setCurrency(response.authorize.currency);
      setIsDemo(response.authorize.is_virtual === 1);
      setIsGuest(false);
      localStorage.setItem('deriv_token', token);
      localStorage.removeItem('deriv_guest');
      
      // Get balance
      const balanceResponse = await deriv.send({ balance: 1, subscribe: 1 });
      setBalance(balanceResponse.balance.balance);
      
      // Subscribe to balance updates
      deriv.on('balance', (data) => {
        setBalance(data.balance.balance);
      });
    } catch (err: any) {
      setError(err.message || 'Authorization failed');
      localStorage.removeItem('deriv_token');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setLoginId('');
    setBalance(0);
    setIsDemo(true);
    setIsGuest(false);
    localStorage.removeItem('deriv_token');
    localStorage.removeItem('deriv_guest');
  };

  return (
    <DerivContext.Provider value={{
      isConnected,
      balance,
      currency,
      loginId,
      isDemo,
      isGuest,
      activeSymbols,
      isLoading,
      error,
      authorize,
      setGuestMode,
      logout
    }}>
      {children}
    </DerivContext.Provider>
  );
};

export const useDeriv = () => {
  const context = useContext(DerivContext);
  if (context === undefined) {
    throw new Error('useDeriv must be used within a DerivProvider');
  }
  return context;
};
