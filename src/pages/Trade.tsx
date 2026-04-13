import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Zap, 
  Activity, 
  BarChart2,
  Shield,
  Sword,
  Crosshair,
  AlertCircle
} from 'lucide-react';
import { deriv } from '@/lib/deriv';
import { useDeriv } from '@/contexts/DerivContext';
import { cn, formatCurrency } from '@/lib/utils';
import { CandlestickChart } from '@/components/CandlestickChart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldGauge } from '@/components/trading/ShieldGauge';
import { TradePanel } from '@/components/trading/TradePanel';
import { motion, AnimatePresence } from 'motion/react';

export const Trade: React.FC = () => {
  const { symbol: urlSymbol } = useParams();
  const navigate = useNavigate();
  const { activeSymbols, balance, currency, loginId, isGuest, updateGuestBalance } = useDeriv();
  const [selectedSymbol, setSelectedSymbol] = useState(urlSymbol || 'R_100');
  const [ticks, setTicks] = useState<any[]>([]);
  const [candles, setCandles] = useState<any[]>([]);
  const [chartType, setChartType] = useState<'line' | 'candles'>('candles');
  const [isTrading, setIsTrading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskLevel, setRiskLevel] = useState(45);
  const [tradeMessage, setTradeMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

  useEffect(() => {
    if (activeSymbols.length > 0 && urlSymbol) {
      const exactMatch = activeSymbols.find(s => s.symbol === urlSymbol);
      if (!exactMatch) {
        const partialMatch = activeSymbols.find(s => s.symbol.includes(urlSymbol) || s.display_name.includes(urlSymbol));
        if (partialMatch) {
          setSelectedSymbol(partialMatch.symbol);
          navigate(`/trade/${partialMatch.symbol}`, { replace: true });
        }
      }
    }
  }, [activeSymbols, urlSymbol]);

  useEffect(() => {
    if (urlSymbol && urlSymbol !== selectedSymbol) {
      setTicks([]);
      setCandles([]);
      setSelectedSymbol(urlSymbol);
    }
  }, [urlSymbol]);

  const handleSymbolChange = (symbol: string) => {
    setTicks([]);
    setCandles([]);
    setSelectedSymbol(symbol);
    navigate(`/trade/${symbol}`);
  };

  const filteredSymbols = activeSymbols.filter(s => 
    s.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!loginId) return;
    
    setTicks([]);
    setCandles([]);
    
    // Always subscribe to ticks to keep currentPrice updated
    const unsubscribeTicks = deriv.subscribe({ ticks: selectedSymbol }, (data) => {
      if (data.tick) {
        setTicks(prev => {
          const newTickValue = data.tick.quote;
          const newTick = {
            time: new Date(data.tick.epoch * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            value: newTickValue,
          };
          return [...prev, newTick].slice(-50);
        });
        // Randomly fluctuate risk level for gamification
        setRiskLevel(prev => Math.max(10, Math.min(95, prev + (Math.random() * 4 - 2))));
      }
    });

    let unsubscribeCandles = () => {};

    if (chartType === 'candles') {
      deriv.send({
        ticks_history: selectedSymbol,
        count: 100,
        end: 'latest',
        style: 'candles',
        granularity: 60
      }).then(response => {
        if (response.candles) {
          const formatted = response.candles.map((c: any) => ({
            time: c.epoch,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close
          })).sort((a: any, b: any) => a.time - b.time);
          setCandles(formatted);
        }
      }).catch(err => console.error('Candle history error:', err));

      unsubscribeCandles = deriv.subscribe({ 
        ticks_history: selectedSymbol, 
        style: 'candles', 
        granularity: 60 
      }, (data) => {
        if (data.ohlc) {
          setCandles(prev => {
            const newCandle = {
              time: data.ohlc.open_time,
              open: parseFloat(data.ohlc.open),
              high: parseFloat(data.ohlc.high),
              low: parseFloat(data.ohlc.low),
              close: parseFloat(data.ohlc.close)
            };
            
            const lastCandle = prev[prev.length - 1];
            let updated;
            if (lastCandle && lastCandle.time === newCandle.time) {
              updated = [...prev.slice(0, -1), newCandle];
            } else {
              updated = [...prev, newCandle].slice(-100);
            }
            return updated.sort((a, b) => a.time - b.time);
          });
        }
      });
    }

    return () => {
      unsubscribeTicks();
      unsubscribeCandles();
    };
  }, [selectedSymbol, chartType, loginId]);

  const handleAegisTrade = async (type: 'CALL' | 'PUT', amount: number, hedge: boolean) => {
    if (amount > balance) {
      setTradeMessage({ type: 'error', text: 'Insufficient credits for this operation.' });
      setTimeout(() => setTradeMessage(null), 3000);
      return;
    }

    setIsTrading(true);
    setTradeMessage(null);
    try {
      // Simulate Aegis Execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const entryPrice = ticks[ticks.length - 1]?.value || 0;
      
      if (entryPrice === 0) {
        throw new Error('Neural link unstable. Price data missing.');
      }

      const isWin = Math.random() > 0.45; // 55% win rate for demo
      const payout = amount * 1.95;

      if (isGuest) {
        if (isWin) {
          updateGuestBalance(payout - amount, {
            pair: selectedSymbol,
            symbol: selectedSymbol,
            type: type === 'CALL' ? 'Buy' : 'Sell',
            amount: `+${formatCurrency(payout - amount, currency)}`,
            status: 'Win',
            price: entryPrice.toFixed(2),
            time: new Date().toISOString()
          });
        } else {
          // If hedged, loss is only 50%
          const actualLoss = hedge ? amount * 0.5 : amount;
          updateGuestBalance(-actualLoss, {
            pair: selectedSymbol,
            symbol: selectedSymbol,
            type: type === 'CALL' ? 'Buy' : 'Sell',
            amount: `-${formatCurrency(actualLoss, currency)}`,
            status: hedge ? 'Shielded' : 'Loss',
            price: entryPrice.toFixed(2),
            time: new Date().toISOString()
          });
        }
      }
      
      setTradeMessage({ 
        type: isWin ? 'success' : (hedge ? 'info' : 'error'), 
        text: isWin ? 'Aegis Strike Successful!' : (hedge ? 'Shield Absorbed Damage!' : 'Shield Failed! Critical Hit.')
      });
      setTimeout(() => setTradeMessage(null), 4000);
    } catch (err: any) {
      setTradeMessage({ type: 'error', text: 'Aegis Network Error: ' + err.message });
      setTimeout(() => setTradeMessage(null), 4000);
    } finally {
      setIsTrading(false);
    }
  };

  const currentPrice = ticks[ticks.length - 1]?.value || 0;
  const priceChange = ticks.length > 1 ? currentPrice - ticks[ticks.length - 2].value : 0;

  return (
    <div className="relative min-h-screen aegis-grid">
      {!loginId && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-brand-earth/60 backdrop-blur-xl">
          <div className="text-center space-y-6 max-w-md p-10 glass-card border-brand-amber/30 neon-glow-red">
            <div className="w-24 h-24 rounded-full bg-brand-amber/10 flex items-center justify-center mx-auto border border-brand-amber/20">
              <Shield className="text-brand-amber w-12 h-12 animate-pulse" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-aegis-text font-display">Trade</h3>
              <p className="text-aegis-text-secondary mt-2">Authentication required to access the Aegis Trade Network.</p>
            </div>
            <button 
              onClick={() => navigate('/profile')}
              className="w-full py-4 bg-brand-amber text-white rounded-2xl font-bold shadow-2xl shadow-brand-amber/40 hover:scale-105 transition-all neon-glow-red"
            >
              Connect Identity
            </button>
          </div>
        </div>
      )}

      <div className={cn("grid grid-cols-1 lg:grid-cols-4 gap-8", !loginId && "opacity-20 pointer-events-none grayscale")}>
        {/* Trade Message Overlay */}
        <AnimatePresence>
          {tradeMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
            >
              <div className={cn(
                "p-4 rounded-2xl border shadow-2xl flex items-center gap-3 backdrop-blur-xl",
                tradeMessage.type === 'success' ? "bg-brand-jungle/20 border-brand-jungle/50 text-brand-jungle" :
                tradeMessage.type === 'error' ? "bg-brand-terracotta/20 border-brand-terracotta/50 text-brand-terracotta" :
                "bg-brand-amber/20 border-brand-amber/50 text-brand-amber"
              )}>
                {tradeMessage.type === 'success' ? <Sword className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
                <p className="font-bold uppercase tracking-widest text-xs">{tradeMessage.text}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Left Column: Market Selector */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-aegis-text-muted w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search Aegis Assets..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-aegis-bg border border-aegis-border rounded-xl py-2 pl-10 pr-4 text-sm text-aegis-text outline-none focus:ring-2 focus:ring-brand-amber/20 placeholder:text-aegis-text-muted"
              />
            </div>
            <div className="mt-4 space-y-1 max-h-[500px] overflow-auto pr-2 custom-scrollbar">
              {filteredSymbols.slice(0, 20).map((symbol) => (
                <button
                  key={symbol.symbol}
                  onClick={() => handleSymbolChange(symbol.symbol)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl transition-all",
                    selectedSymbol === symbol.symbol 
                      ? "bg-brand-amber/10 text-brand-amber border border-brand-amber/30" 
                      : "hover:bg-aegis-card text-aegis-text-muted"
                  )}
                >
                  <div className="text-left">
                    <p className="font-bold text-sm tracking-tight">{symbol.display_name}</p>
                    <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">{symbol.market_display_name}</p>
                  </div>
                  {selectedSymbol === symbol.symbol && <Crosshair className="w-4 h-4 text-brand-amber" />}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 border-brand-terracotta/30">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-brand-terracotta" />
              <h4 className="font-bold text-brand-terracotta font-display">Network Status</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-aegis-text-secondary">Latency</span>
                <span className="text-brand-jungle font-mono font-bold">24ms</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-aegis-text-secondary">Shield Status</span>
                <span className="text-brand-terracotta font-bold">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Chart & Gauge */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 flex flex-col min-h-[600px]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold font-display text-aegis-text">{activeSymbols.find(s => s.symbol === selectedSymbol)?.display_name || selectedSymbol}</h3>
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-brand-jungle/10 text-brand-jungle text-[10px] font-bold rounded uppercase border border-brand-jungle/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-jungle animate-pulse" />
                      Live Feed
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-4xl font-mono font-bold tracking-tighter text-aegis-text">
                      {currentPrice.toFixed(2)}
                    </span>
                    <span className={cn(
                      "flex items-center text-sm font-bold px-2 py-0.5 rounded-lg",
                      priceChange >= 0 ? "bg-brand-jungle/10 text-brand-jungle" : "bg-brand-terracotta/10 text-brand-terracotta"
                    )}>
                      {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(4)}
                    </span>
                  </div>
                </div>
                <div className="hidden xl:block h-12 w-px bg-aegis-border" />
                <div className="hidden xl:block">
                  <ShieldGauge riskLevel={Math.round(riskLevel)} />
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Balance Display */}
                <div className="hidden sm:flex flex-col items-end mr-4">
                  <span className="text-[10px] font-bold text-aegis-text-muted uppercase tracking-widest">Available Balance</span>
                  <span className="text-lg font-mono font-bold text-brand-amber">{formatCurrency(balance, currency)}</span>
                </div>

                <div className="flex bg-aegis-bg p-1 rounded-xl border border-aegis-border">
                  <button 
                    onClick={() => setChartType('line')}
                    className={cn(
                      "p-2 rounded-lg transition-all",
                      chartType === 'line' ? "bg-aegis-card text-brand-amber shadow-inner" : "text-aegis-text-muted hover:text-aegis-text"
                    )}
                  >
                    <Activity className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setChartType('candles')}
                    className={cn(
                      "p-2 rounded-lg transition-all",
                      chartType === 'candles' ? "bg-aegis-card text-brand-amber shadow-inner" : "text-aegis-text-muted hover:text-aegis-text"
                    )}
                  >
                    <BarChart2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full min-h-[400px] relative">
              {chartType === 'line' ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={400}>
                  <LineChart data={ticks}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.1} className="text-aegis-border" />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: 'currentColor', fillOpacity: 0.4 }} 
                      className="text-aegis-text"
                    />
                    <YAxis 
                      domain={['auto', 'auto']} 
                      orientation="right"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: 'currentColor', fillOpacity: 0.4 }}
                      className="text-aegis-text"
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--aegis-bg)', border: '1px solid var(--aegis-border)', borderRadius: '12px' }}
                      itemStyle={{ color: 'var(--aegis-text)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#F27D26" 
                      strokeWidth={3} 
                      dot={false}
                      animationDuration={300}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <CandlestickChart data={candles} colors={{ backgroundColor: 'transparent', textColor: 'var(--aegis-text-muted)' }} />
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Trade Panel */}
        <div className="lg:col-span-1">
          <TradePanel 
            symbol={selectedSymbol} 
            onTrade={handleAegisTrade}
            isTrading={isTrading}
          />
        </div>
      </div>
    </div>
  );
};
