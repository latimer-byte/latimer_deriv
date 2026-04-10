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
  CheckCircle2
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
  { time: '09:00', value: 10200 },
  { time: '10:00', value: 10150 },
  { time: '11:00', value: 10300 },
  { time: '12:00', value: 10250 },
  { time: '13:00', value: 10400 },
  { time: '14:00', value: 10350 },
  { time: '15:00', value: 10500 },
];

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="glass-card p-6 flex flex-col gap-4"
  >
    <div className="flex items-center justify-between">
      <div className="w-12 h-12 rounded-2xl bg-brand-earth flex items-center justify-center border border-gray-100">
        <Icon className="w-6 h-6 text-brand-terracotta" />
      </div>
      <div className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold",
        trend === 'up' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      )}>
        {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {change}%
      </div>
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
    </div>
  </motion.div>
);

export const Dashboard: React.FC = () => {
  const { balance, currency, loginId } = useDeriv();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {!loginId && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 bg-gradient-to-br from-brand-amber to-brand-terracotta text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-brand-amber/30"
        >
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-4xl">Start Your Trading Journey</h2>
            <p className="text-white/80 text-lg max-w-xl">Join thousands of African traders. Try our $10,000 Demo account or connect your Deriv account for real trading.</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm">
                <CheckCircle2 className="w-4 h-4 text-white" /> Instant Deposits
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm">
                <CheckCircle2 className="w-4 h-4 text-white" /> 24/7 Support
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm">
                <CheckCircle2 className="w-4 h-4 text-white" /> Local Payments
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <button 
              onClick={() => navigate('/profile')}
              className="px-10 py-5 bg-white text-brand-terracotta rounded-2xl font-bold text-xl shadow-xl hover:bg-gray-50 transition-all whitespace-nowrap"
            >
              Login / Connect
            </button>
            <a 
              href="https://deriv.com/signup/" 
              target="_blank"
              className="px-10 py-3 bg-white/10 text-white border border-white/20 rounded-xl font-bold text-center hover:bg-white/20 transition-all"
            >
              Sign Up
            </a>
          </div>
        </motion.div>
      )}

      {/* Roadmap Teaser */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => navigate('/roadmap')}
        className="glass-card p-6 bg-brand-terracotta text-white flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer hover:shadow-2xl transition-all overflow-hidden relative group"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-110 transition-transform" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-serif">The Road to Unicorn</h3>
            <p className="text-white/80">Explore our 3-year product vision and global expansion strategy.</p>
          </div>
        </div>
        <button className="px-8 py-3 bg-white text-brand-terracotta rounded-xl font-bold shadow-xl relative z-10 whitespace-nowrap">
          View Roadmap
        </button>
      </motion.div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl text-brand-terracotta">Market Overview</h2>
          <p className="text-gray-500 mt-2">Track your performance and latest market trends.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/trade')}
            className="px-6 py-3 bg-brand-amber text-white rounded-xl font-bold shadow-lg shadow-brand-amber/20 hover:bg-brand-amber/90 transition-all flex items-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            New Trade
          </button>
          <button 
            onClick={() => navigate('/funds')}
            className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <Wallet className="w-5 h-5" />
            Deposit
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Balance" 
          value={formatCurrency(balance, currency)} 
          change="2.4" 
          icon={Wallet} 
          trend="up" 
        />
        <StatCard 
          title="Active Trades" 
          value="12" 
          change="1.2" 
          icon={TrendingUp} 
          trend="up" 
        />
        <StatCard 
          title="Profit/Loss" 
          value={formatCurrency(450.25, currency)} 
          change="0.5" 
          icon={TrendingUp} 
          trend="up" 
        />
        <StatCard 
          title="Win Rate" 
          value="68%" 
          change="4.2" 
          icon={TrendingUp} 
          trend="down" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl">Portfolio Performance</h3>
            <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium outline-none focus:ring-2 focus:ring-brand-amber/20">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D97706" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9ca3af' }} 
                  dy={10}
                />
                <YAxis 
                  hide 
                  domain={['dataMin - 100', 'dataMax + 100']} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#D97706" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl">Recent Trades</h3>
            <button className="text-brand-amber text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {[
              { pair: 'BTC/USD', type: 'Buy', amount: '+0.024', status: 'Profit', price: '$64,200' },
              { pair: 'ETH/USD', type: 'Sell', amount: '-1.50', status: 'Loss', price: '$3,450' },
              { pair: 'GOLD', type: 'Buy', amount: '+10.0', status: 'Profit', price: '$2,150' },
              { pair: 'EUR/USD', type: 'Buy', amount: '+500', status: 'Profit', price: '1.0850' },
            ].map((trade, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    trade.type === 'Buy' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  )}>
                    {trade.type === 'Buy' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{trade.pair}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 2h ago
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "font-bold",
                    trade.status === 'Profit' ? "text-green-600" : "text-red-600"
                  )}>
                    {trade.amount}
                  </p>
                  <p className="text-xs text-gray-500">{trade.price}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 border border-dashed border-gray-300 rounded-xl text-gray-500 text-sm font-medium hover:border-brand-amber hover:text-brand-amber transition-all flex items-center justify-center gap-2">
            Explore Markets <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
