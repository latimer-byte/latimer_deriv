import React from 'react';
import { useDeriv } from '@/contexts/DerivContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  ChevronRight
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
  const { balance, currency } = useDeriv();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl text-brand-terracotta">Market Overview</h2>
          <p className="text-gray-500 mt-2">Track your performance and latest market trends.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-brand-amber text-white rounded-xl font-bold shadow-lg shadow-brand-amber/20 hover:bg-brand-amber/90 transition-all flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            New Trade
          </button>
          <button className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center gap-2">
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
