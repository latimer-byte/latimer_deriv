import React from 'react';
import { useDeriv } from '@/contexts/DerivContext';
import { 
  History as HistoryIcon, 
  Search, 
  Filter, 
  Download,
  TrendingUp,
  TrendingDown,
  ExternalLink
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

export const History: React.FC = () => {
  const { currency } = useDeriv();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl text-brand-terracotta">Trade History</h2>
          <p className="text-gray-500 mt-2">Review your past performance and trading activity.</p>
        </div>
        <button className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by asset or ID..." 
              className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-brand-amber/20"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <select className="flex-1 md:flex-none px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-brand-amber/20">
              <option>All Types</option>
              <option>Rise</option>
              <option>Fall</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Asset</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stake</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Payout</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Profit/Loss</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { asset: 'Volatility 100 Index', type: 'Rise', stake: 10, payout: 19.50, profit: 9.50, date: 'Apr 10, 2026 14:20' },
                { asset: 'BTC/USD', type: 'Fall', stake: 50, payout: 0, profit: -50, date: 'Apr 10, 2026 12:45' },
                { asset: 'Volatility 75 Index', type: 'Rise', stake: 25, payout: 48.75, profit: 23.75, date: 'Apr 09, 2026 18:10' },
                { asset: 'EUR/USD', type: 'Rise', stake: 100, payout: 195, profit: 95, date: 'Apr 09, 2026 10:30' },
                { asset: 'Gold', type: 'Fall', stake: 20, payout: 39, profit: 19, date: 'Apr 08, 2026 15:55' },
              ].map((trade, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-all group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{trade.asset}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-tighter">ID: #TRD-92834{i}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                      trade.type === 'Rise' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                      {trade.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm">{formatCurrency(trade.stake, currency)}</td>
                  <td className="px-6 py-4 font-mono text-sm">{formatCurrency(trade.payout, currency)}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "font-bold font-mono",
                      trade.profit >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {trade.profit >= 0 ? '+' : ''}{formatCurrency(trade.profit, currency)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{trade.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-brand-amber transition-all">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing 5 of 128 trades</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium disabled:opacity-50" disabled>Previous</button>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};
