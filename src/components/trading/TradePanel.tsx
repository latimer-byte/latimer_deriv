import React, { useState } from 'react';
import { Shield, Sword, Zap, Info } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { useDeriv } from '@/contexts/DerivContext';

interface TradePanelProps {
  symbol: string;
  onTrade: (type: 'CALL' | 'PUT', amount: number, hedge: boolean) => void;
  isTrading: boolean;
}

export const TradePanel: React.FC<TradePanelProps> = ({ symbol, onTrade, isTrading }) => {
  const { balance, currency } = useDeriv();
  const [amount, setAmount] = useState(10);
  const [useAegisShield, setUseAegisShield] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h4 className="text-lg font-bold flex items-center gap-2 font-display text-aegis-text">
            <Zap className="w-5 h-5 text-brand-amber" />
            Trade
          </h4>
          <span className="text-[10px] font-mono text-aegis-text-muted">{currentTime}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-aegis-text-muted uppercase tracking-widest">
          <Info className="w-3 h-3" />
          Instant Execution
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold text-aegis-text-muted uppercase tracking-widest mb-2 block">
            Stake Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-aegis-text-muted font-mono">$</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-aegis-bg border border-aegis-border rounded-xl py-4 pl-8 pr-4 text-xl font-mono focus:ring-2 focus:ring-brand-amber/20 outline-none transition-all text-aegis-text"
            />
          </div>
        </div>

        <div 
          onClick={() => setUseAegisShield(!useAegisShield)}
          className={cn(
            "p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between",
            useAegisShield 
              ? "bg-brand-terracotta/10 border-brand-terracotta/30" 
              : "bg-aegis-bg border-aegis-border grayscale opacity-50"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              useAegisShield ? "bg-brand-terracotta text-white" : "bg-aegis-card text-aegis-text-muted"
            )}>
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight text-aegis-text">Aegis Shield</p>
              <p className="text-[10px] text-aegis-text-muted font-bold uppercase tracking-widest">Auto-hedge 50% stake</p>
            </div>
          </div>
          <div className={cn(
            "w-10 h-5 rounded-full relative transition-all",
            useAegisShield ? "bg-brand-terracotta" : "bg-aegis-bg"
          )}>
            <div className={cn(
              "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
              useAegisShield ? "right-1" : "left-1"
            )} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          disabled={isTrading}
          onClick={() => onTrade('CALL', amount, useAegisShield)}
          className="group relative overflow-hidden py-6 bg-brand-jungle hover:bg-brand-jungle/90 text-white rounded-2xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-brand-jungle/20"
        >
          <div className="relative z-10 flex flex-col items-center gap-1">
            <Sword className="w-6 h-6 rotate-45" />
            <span className="font-display tracking-wider">BUY</span>
            <span className="text-[10px] opacity-60 font-bold uppercase tracking-widest">Higher</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </button>

        <button
          disabled={isTrading}
          onClick={() => onTrade('PUT', amount, useAegisShield)}
          className="group relative overflow-hidden py-6 bg-brand-amber hover:bg-brand-amber/90 text-white rounded-2xl font-bold transition-all disabled:opacity-50 neon-glow-red"
        >
          <div className="relative z-10 flex flex-col items-center gap-1">
            <Shield className="w-6 h-6" />
            <span className="font-display tracking-wider">SELL</span>
            <span className="text-[10px] opacity-60 font-bold uppercase tracking-widest">Lower</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </button>
      </div>

      <div className="pt-4 border-t border-aegis-border">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-aegis-text-muted font-bold uppercase tracking-widest">Potential Return</span>
          <span className="text-brand-jungle font-bold">+{formatCurrency(amount * 0.95, currency)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-aegis-text-muted font-bold uppercase tracking-widest">Max Risk</span>
          <span className="text-brand-amber font-bold">
            {useAegisShield ? formatCurrency(amount * 0.5, currency) : formatCurrency(amount, currency)}
          </span>
        </div>
      </div>
    </div>
  );
};
