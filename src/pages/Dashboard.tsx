import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeriv } from '@/contexts/DerivContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  ChevronRight,
  Rocket,
  CheckCircle2,
  Activity,
  Shield
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn, formatCurrency } from '@/lib/utils';

const mockChartData = [
  { time: 'Mon', value: 10000, profit: 0 },
  { time: 'Tue', value: 10150, profit: 150 },
  { time: 'Wed', value: 10080, profit: -70 },
  { time: 'Thu', value: 10300, profit: 220 },
  { time: 'Fri', value: 10250, profit: -50 },
  { time: 'Sat', value: 10450, profit: 200 },
  { time: 'Sun', value: 10600, profit: 150 },
];

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
  <motion.div 
    whileHover={{ y: -4, scale: 1.02 }}
    className="glass-card p-6 flex flex-col gap-4 border-l-4 border-l-brand-amber"
  >
    <div className="flex items-center justify-between">
      <div className="w-12 h-12 rounded-2xl bg-aegis-bg flex items-center justify-center border border-aegis-border">
        <Icon className="w-6 h-6 text-brand-amber" />
      </div>
      <div className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold",
        trend === 'up' ? "bg-brand-jungle/10 text-brand-jungle" : "bg-brand-terracotta/10 text-brand-terracotta"
      )}>
        {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {change}%
      </div>
    </div>
    <div>
      <p className="text-[10px] text-aegis-text-muted font-bold uppercase tracking-widest">{title}</p>
      <h3 className="text-2xl font-bold text-aegis-text mt-1 font-mono">{value}</h3>
    </div>
  </motion.div>
);

export const Dashboard: React.FC = () => {
  const { balance, currency, loginId, isGuest, guestTrades } = useDeriv();
  const navigate = useNavigate();

  const displayTrades = isGuest ? guestTrades : [
    { pair: 'BTC/USD', type: 'Buy', amount: '+0.024', status: 'Profit', price: '$64,200', time: '2h ago' },
    { pair: 'ETH/USD', type: 'Sell', amount: '-1.50', status: 'Loss', price: '$3,450', time: '4h ago' },
    { pair: 'GOLD', type: 'Buy', amount: '+10.0', status: 'Profit', price: '$2,150', time: '6h ago' },
    { pair: 'EUR/USD', type: 'Buy', amount: '+500', status: 'Profit', price: '1.0850', time: '1d ago' },
  ];

  return (
    <div className="space-y-8 pb-20 aegis-grid min-h-screen">
      {!loginId && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-10 bg-gradient-to-br from-brand-amber/10 via-aegis-card to-brand-terracotta/10 text-aegis-text flex flex-col md:flex-row items-center justify-between gap-10 border-brand-amber/20"
        >
          <div className="space-y-6 text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-amber/10 border border-brand-amber/20 text-[10px] font-bold text-brand-amber uppercase tracking-widest">
              <Shield className="w-3 h-3" /> Secure Trading Environment
            </div>
            <h2 className="text-5xl font-bold tracking-tight font-display leading-tight">Master the Markets with <span className="text-brand-amber">Aegis Precision</span></h2>
            <p className="text-aegis-text-secondary text-lg max-w-2xl leading-relaxed">Connect your Deriv account to access institutional-grade trading tools, real-time analytics, and advanced capital protection protocols.</p>
            <div className="flex flex-wrap gap-6 justify-center md:justify-start">
              <div className="flex items-center gap-2 text-xs font-bold text-aegis-text-muted uppercase tracking-widest">
                <CheckCircle2 className="w-4 h-4 text-brand-jungle" /> Real-time Execution
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-aegis-text-muted uppercase tracking-widest">
                <CheckCircle2 className="w-4 h-4 text-brand-jungle" /> Advanced Risk Management
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-aegis-text-muted uppercase tracking-widest">
                <CheckCircle2 className="w-4 h-4 text-brand-jungle" /> 24/7 Market Access
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full md:w-72 shrink-0">
            <button 
              onClick={() => navigate('/profile')}
              className="w-full py-5 bg-brand-amber text-white rounded-2xl font-bold text-lg shadow-xl shadow-brand-amber/20 hover:bg-brand-amber/90 transition-all"
            >
              Get Started
            </button>
            <a 
              href="https://deriv.com/signup/" 
              target="_blank"
              className="w-full py-4 bg-aegis-text/5 text-aegis-text border border-aegis-border rounded-2xl font-bold text-center hover:bg-aegis-text/10 transition-all text-sm"
            >
              Create Account
            </a>
          </div>
        </motion.div>
      )}

      {/* Roadmap Teaser */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => navigate('/roadmap')}
        className="glass-card p-8 bg-aegis-card/20 text-aegis-text flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer hover:bg-aegis-card/30 transition-all border-aegis-border"
      >
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-brand-terracotta/20 border border-brand-terracotta/30 flex items-center justify-center">
            <Rocket className="w-7 h-7 text-brand-terracotta" />
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight font-display">Platform Evolution</h3>
            <p className="text-aegis-text-secondary text-sm">Explore upcoming features, multi-chain integrations, and network expansion protocols.</p>
          </div>
        </div>
        <button className="px-8 py-3 bg-brand-terracotta/10 text-brand-terracotta border border-brand-terracotta/20 rounded-xl font-bold hover:bg-brand-terracotta hover:text-white transition-all whitespace-nowrap">
          View Roadmap
        </button>
      </motion.div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold text-aegis-text tracking-tight font-display">Market Overview</h2>
          <p className="text-aegis-text-muted mt-1 uppercase tracking-[0.2em] text-[10px] font-bold">Real-time Trading Performance & Analytics</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/trade')}
            className="px-6 py-3 bg-brand-amber text-white rounded-xl font-bold shadow-lg shadow-brand-amber/20 hover:bg-brand-amber/90 transition-all flex items-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            Trade
          </button>
          <button 
            onClick={() => navigate('/funds')}
            className="px-6 py-3 bg-aegis-card text-aegis-text-secondary border border-aegis-border rounded-xl font-bold hover:bg-brand-forest transition-all flex items-center gap-2"
          >
            <Wallet className="w-5 h-5" />
            Deposit
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Liquidity" 
          value={formatCurrency(balance, currency)} 
          change="2.4" 
          icon={Wallet} 
          trend="up" 
        />
        <StatCard 
          title="Active Operations" 
          value="12" 
          change="1.2" 
          icon={TrendingUp} 
          trend="up" 
        />
        <StatCard 
          title="Net Yield" 
          value={formatCurrency(450.25, currency)} 
          change="0.5" 
          icon={TrendingUp} 
          trend="up" 
        />
        <StatCard 
          title="Shield Efficiency" 
          value="68%" 
          change="4.2" 
          icon={Shield} 
          trend="down" 
        />
        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          className="glass-card p-6 flex flex-col gap-4 border-l-4 border-l-brand-amber"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-aegis-bg flex items-center justify-center border border-aegis-border">
              <Activity className="w-6 h-6 text-brand-amber" />
            </div>
            <span className="text-[10px] font-bold text-brand-jungle uppercase tracking-widest">Bullish</span>
          </div>
          <div>
            <p className="text-[10px] text-aegis-text-muted font-bold uppercase tracking-widest">Market Sentiment</p>
            <div className="mt-2 h-2 w-full bg-aegis-bg rounded-full overflow-hidden flex border border-aegis-border">
              <div className="h-full bg-brand-jungle shadow-[0_0_10px_rgba(45,90,39,0.5)]" style={{ width: '72%' }} />
              <div className="h-full bg-brand-terracotta shadow-[0_0_10px_rgba(184,75,38,0.5)]" style={{ width: '28%' }} />
            </div>
            <div className="flex justify-between mt-1 text-[10px] font-bold font-mono">
              <span className="text-brand-jungle">72% ATTACK</span>
              <span className="text-brand-terracotta">28% DEFEND</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-card p-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 relative z-10">
            <div>
              <h3 className="text-xl font-bold text-aegis-text tracking-tight font-display">Performance Analytics</h3>
              <p className="text-[10px] text-aegis-text-muted uppercase tracking-widest font-bold">Historical Yield Matrix</p>
            </div>
            <div className="flex bg-aegis-bg p-1 rounded-xl border border-aegis-border">
              {['1D', '1W', '1M', '1Y', 'ALL'].map(t => (
                <button key={t} className={cn(
                  "px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all",
                  t === '1W' ? "bg-aegis-card text-brand-amber shadow-inner" : "text-aegis-text-muted hover:text-aegis-text"
                )}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[350px] w-full relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={350}>
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F27D26" stopOpacity={0.4}/>
                    <stop offset="50%" stopColor="#F27D26" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#F27D26" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(184, 75, 38, 0.1)" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: 'var(--color-aegis-text-muted)', fontWeight: 500 }} 
                  dy={10}
                />
                <YAxis 
                  hide 
                  domain={['dataMin - 500', 'dataMax + 500']} 
                />
                <Tooltip 
                  cursor={{ stroke: '#F27D26', strokeWidth: 1, strokeDasharray: '5 5' }}
                  content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-aegis-bg p-4 rounded-2xl shadow-2xl border border-aegis-border">
                          <p className="text-[10px] font-bold text-aegis-text-muted uppercase mb-1 tracking-widest">{payload[0].payload.time}</p>
                          <p className="text-xl font-bold text-aegis-text font-mono">{formatCurrency(payload[0].value, currency)}</p>
                          <p className={cn(
                            "text-[10px] font-bold mt-1 uppercase tracking-widest",
                            payload[0].payload.profit >= 0 ? "text-brand-jungle" : "text-brand-terracotta"
                          )}>
                            {payload[0].payload.profit >= 0 ? 'Yield: +' : 'Yield: '}{formatCurrency(payload[0].payload.profit, currency)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#F27D26" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-aegis-border flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-brand-terracotta" />
                <span className="text-[10px] font-bold text-aegis-text-muted uppercase tracking-widest">Equity Node</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-brand-jungle" />
                <span className="text-[10px] font-bold text-aegis-text-muted uppercase tracking-widest">Profit Matrix</span>
              </div>
            </div>
            <p className="text-[10px] font-bold text-aegis-text-muted italic uppercase tracking-widest">Neural Sync Active</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-aegis-text tracking-tight font-display">Recent Activity</h3>
            <button 
              onClick={() => navigate('/history')}
              className="text-brand-amber text-[10px] font-bold hover:underline uppercase tracking-widest"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {displayTrades.slice(0, 4).map((trade, i) => (
              <div 
                key={i} 
                onClick={() => navigate('/history')}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-aegis-card transition-all group cursor-pointer border border-transparent hover:border-aegis-border"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center border",
                    trade.type === 'Buy' || trade.type === 'Sword' ? "bg-brand-jungle/10 text-brand-jungle border-brand-jungle/20" : "bg-brand-terracotta/10 text-brand-terracotta border-brand-terracotta/20"
                  )}>
                    {trade.type === 'Buy' || trade.type === 'Sword' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-aegis-text text-sm">{trade.pair}</p>
                    <p className="text-[10px] text-aegis-text-muted flex items-center gap-1 font-bold uppercase tracking-widest">
                      <Clock className="w-3 h-3" /> {trade.time.includes('ago') ? trade.time : new Date(trade.time).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "font-bold font-mono text-sm",
                    trade.status === 'Profit' || trade.status === 'Win' ? "text-brand-jungle" : "text-brand-terracotta"
                  )}>
                    {trade.amount}
                  </p>
                  <p className="text-[10px] text-aegis-text-muted font-mono">{trade.price}</p>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => navigate('/markets')}
            className="w-full mt-6 py-3 border border-dashed border-aegis-border rounded-xl text-aegis-text-muted text-[10px] font-bold uppercase tracking-widest hover:border-brand-amber hover:text-brand-amber transition-all flex items-center justify-center gap-2"
          >
            Scan Markets <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
