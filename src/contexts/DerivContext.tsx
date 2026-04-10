import React, { createContext, useContext, useState, useEffect } from 'react';
import { deriv, DerivResponse } from '@/lib/deriv';

interface DerivContextType {
  isConnected: boolean;
  balance: number;
  currency: string;
  loginId: string;
  isDemo: boolean;
  activeSymbols: any[];
  isLoading: boolean;
  error: string | null;
  authorize: (token: string) => Promise<void>;
  logout: () => void;
}

const DerivContext = createContext<DerivContextType | undefined>(undefined);

export const DerivProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState('USD');
  const [loginId, setLoginId] = useState('');
  const [isDemo, setIsDemo] = useState(true);
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
        if (savedToken) {
          await authorize(savedToken);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to connect to Deriv');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const authorize = async (token: string) => {
    setIsLoading(true);
    try {
      const response = await deriv.send({ authorize: token });
      setLoginId(response.authorize.loginid);
      setCurrency(response.authorize.currency);
      setIsDemo(response.authorize.is_virtual === 1);
      localStorage.setItem('deriv_token', token);
      
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
    localStorage.removeItem('deriv_token');
  };

  return (
    <DerivContext.Provider value={{
      isConnected,
      balance,
      currency,
      loginId,
      isDemo,
      activeSymbols,
      isLoading,
      error,
      authorize,
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
