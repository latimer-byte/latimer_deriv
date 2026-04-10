import React, { useState, useEffect } from 'react';
import { useDeriv } from '@/contexts/DerivContext';
import { deriv } from '@/lib/deriv';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Info,
  ChevronDown,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn, formatCurrency } from '@/lib/utils';
import { motion } from 'motion/react';

export const Trade: React.FC = () => {
  const { activeSymbols, balance, currency } = useDeriv();
  const [selectedSymbol, setSelectedSymbol] = useState('R_100');
  const [ticks, setTicks] = useState<any[]>([]);
  const [amount, setAmount] = useState(10);
  const [duration, setDuration] = useState(5);
  const [isTrading, setIsTrading] = useState(false);

  useEffect(() => {
    // Subscribe to ticks for selected symbol
    const unsubscribe = deriv.subscribe({ ticks: selectedSymbol }, (data) => {
      setTicks(prev => {
        const newTick = {
          time: new Date(data.tick.epoch * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          value: data.tick.quote
        };
        const updated = [...prev, newTick].slice(-20);
        return updated;
      });
    });

    return () => unsubscribe();
  }, [selectedSymbol]);

  const handleTrade = async (type: 'CALL' | 'PUT') => {
    setIsTrading(true);
    try {
      // In a real app, you'd call buy here
      // const response = await deriv.send({ buy: '...', price: amount });
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert(`Trade placed: ${type} on ${selectedSymbol} for ${formatCurrency(amount, currency)}`);
    } catch (err: any) {
      alert(err.message || 'Trade failed');
    } finally {
      setIsTrading(false);
    }
  };

  const currentPrice = ticks[ticks.length - 1]?.value || 0;
  const priceChange = ticks.length > 1 ? currentPrice - ticks[ticks.length - 2].value : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Left Column: Market Selector & Info */}
      <div className="lg:col-span-1 space-y-6">
        <div className="glass-card p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search markets..." 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-brand-amber/20"
            />
          </div>
          <div className="mt-4 space-y-1 max-h-[400px] overflow-auto pr-2">
            {activeSymbols.slice(0, 10).map((symbol) => (
              <button
                key={symbol.symbol}
                onClick={() => setSelectedSymbol(symbol.symbol)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl transition-all",
                  selectedSymbol === symbol.symbol ? "bg-brand-amber/10 text-brand-amber border border-brand-amber/20" : "hover:bg-gray-50 text-gray-600"
                )}
              >
                <div className="text-left">
                  <p className="font-bold text-sm">{symbol.display_name}</p>
                  <p className="text-[10px] uppercase tracking-wider opacity-60">{symbol.market_display_name}</p>
                </div>
                {selectedSymbol === symbol.symbol && <Zap className="w-4 h-4 fill-current" />}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 bg-brand-forest text-white">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-brand-amber" />
            <h4 className="font-bold">Safe Trading</h4>
          </div>
          <p className="text-xs text-white/80 leading-relaxed">
            AfriTrade uses Deriv's secure API. Your funds are protected and trades are executed instantly on the global market.
          </p>
        </div>
      </div>

      {/* Center Column: Chart */}
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-card p-6 min-h-[500px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl">{activeSymbols.find(s => s.symbol === selectedSymbol)?.display_name || selectedSymbol}</h3>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded uppercase">Live</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-3xl font-mono font-bold tracking-tighter">
                  {currentPrice.toFixed(2)}
                </span>
                <span className={cn(
                  "flex items-center text-sm font-bold",
                  priceChange >= 0 ? "text-green-500" : "text-red-500"
                )}>
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(4)}
                  {priceChange >= 0 ? <TrendingUp className="w-4 h-4 ml-1" /> : <TrendingDown className="w-4 h-4 ml-1" />}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {['1m', '5m', '15m', '1h'].map(t => (
                <button key={t} className="px-3 py-1 text-xs font-bold rounded-lg border border-gray-200 hover:bg-gray-50">{t}</button>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ticks}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                />
                <YAxis 
                  domain={['auto', 'auto']} 
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#D97706" 
                  strokeWidth={2} 
                  dot={false}
                  animationDuration={300}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Right Column: Order Panel */}
      <div className="lg:col-span-1 space-y-6">
        <div className="glass-card p-6 space-y-6">
          <h3 className="text-xl">Place Order</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Stake Amount ({currency})</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 font-bold text-lg outline-none focus:ring-2 focus:ring-brand-amber/20"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <button onClick={() => setAmount(prev => Math.max(1, prev - 5))} className="p-1 hover:bg-gray-200 rounded">-</button>
                  <button onClick={() => setAmount(prev => prev + 5)} className="p-1 hover:bg-gray-200 rounded">+</button>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Duration (Ticks)</label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 5, 10, 20].map(d => (
                  <button 
                    key={d}
                    onClick={() => setDuration(d)}
                    className={cn(
                      "py-2 rounded-lg text-sm font-bold border transition-all",
                      duration === d ? "bg-brand-amber text-white border-brand-amber" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <button 
              disabled={isTrading}
              onClick={() => handleTrade('CALL')}
              className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <TrendingUp className="w-5 h-5" />
              Rise / Higher
            </button>
            <button 
              disabled={isTrading}
              onClick={() => handleTrade('PUT')}
              className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <TrendingDown className="w-5 h-5" />
              Fall / Lower
            </button>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-500">Payout</span>
              <span className="font-bold text-gray-900">{formatCurrency(amount * 1.95, currency)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Potential Profit</span>
              <span className="font-bold text-green-600">+{formatCurrency(amount * 0.95, currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
