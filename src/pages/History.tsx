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
    <div className="space-y-8 pb-20 aegis-grid min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold text-white tracking-tight font-display">Operation History</h2>
          <p className="text-orange-100/40 mt-1 uppercase tracking-[0.2em] text-[10px] font-bold">Archived Neural Execution Logs</p>
        </div>
        <button className="px-6 py-3 bg-brand-forest/40 text-orange-100/60 border border-orange-900/20 rounded-xl font-bold hover:bg-brand-forest transition-all flex items-center gap-2 text-sm">
          <Download className="w-5 h-5" />
          Export Data Node
        </button>
      </div>

      <div className="glass-card overflow-hidden bg-brand-forest/40 border-orange-900/20">
        <div className="p-4 border-b border-orange-900/20 flex flex-col md:flex-row gap-4 items-center justify-between bg-brand-earth/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-100/20 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by asset or operation ID..." 
              className="w-full bg-brand-earth/40 border border-orange-900/20 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-brand-amber/20 text-white placeholder:text-orange-100/10"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-4 py-2 bg-brand-earth/40 border border-orange-900/20 rounded-xl text-xs font-bold uppercase tracking-widest text-orange-100/40 flex items-center justify-center gap-2 hover:bg-brand-forest hover:text-white transition-all">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <select className="flex-1 md:flex-none px-4 py-2 bg-brand-earth/40 border border-orange-900/20 rounded-xl text-xs font-bold uppercase tracking-widest text-orange-100/40 outline-none focus:ring-2 focus:ring-brand-amber/20 appearance-none">
              <option>All Protocols</option>
              <option>Sword (Rise)</option>
              <option>Shield (Fall)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-earth/50">
                <th className="px-6 py-4 text-[10px] font-bold text-orange-100/40 uppercase tracking-widest">Asset Node</th>
                <th className="px-6 py-4 text-[10px] font-bold text-orange-100/40 uppercase tracking-widest">Protocol</th>
                <th className="px-6 py-4 text-[10px] font-bold text-orange-100/40 uppercase tracking-widest">Stake</th>
                <th className="px-6 py-4 text-[10px] font-bold text-orange-100/40 uppercase tracking-widest">Payout</th>
                <th className="px-6 py-4 text-[10px] font-bold text-orange-100/40 uppercase tracking-widest">Yield</th>
                <th className="px-6 py-4 text-[10px] font-bold text-orange-100/40 uppercase tracking-widest">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-bold text-orange-100/40 uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-900/20">
              {[
                { asset: 'Volatility 100 Index', type: 'Sword', stake: 10, payout: 19.50, profit: 9.50, date: 'Apr 10, 2026 14:20' },
                { asset: 'BTC/USD', type: 'Shield', stake: 50, payout: 0, profit: -50, date: 'Apr 10, 2026 12:45' },
                { asset: 'Volatility 75 Index', type: 'Sword', stake: 25, payout: 48.75, profit: 23.75, date: 'Apr 09, 2026 18:10' },
                { asset: 'EUR/USD', type: 'Sword', stake: 100, payout: 195, profit: 95, date: 'Apr 09, 2026 10:30' },
                { asset: 'Gold', type: 'Shield', stake: 20, payout: 39, profit: 19, date: 'Apr 08, 2026 15:55' },
              ].map((trade, i) => (
                <tr key={i} className="hover:bg-brand-forest/50 transition-all group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-white text-sm tracking-tight">{trade.asset}</p>
                    <p className="text-[10px] text-orange-100/20 font-mono uppercase tracking-tighter">NODE-ID: #AEGIS-{92834 + i}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border",
                      trade.type === 'Sword' 
                        ? "bg-brand-jungle/10 text-brand-jungle border-brand-jungle/20" 
                        : "bg-brand-terracotta/10 text-brand-terracotta border-brand-terracotta/20"
                    )}>
                      {trade.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-orange-100/60">{formatCurrency(trade.stake, currency)}</td>
                  <td className="px-6 py-4 font-mono text-sm text-orange-100/60">{formatCurrency(trade.payout, currency)}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "font-bold font-mono text-sm",
                      trade.profit >= 0 ? "text-brand-jungle" : "text-brand-terracotta"
                    )}>
                      {trade.profit >= 0 ? '+' : ''}{formatCurrency(trade.profit, currency)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[10px] text-orange-100/40 font-bold uppercase tracking-widest">{trade.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-orange-100/10 hover:text-brand-amber transition-all">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-brand-earth/50 border-t border-orange-900/20 flex items-center justify-between">
          <p className="text-[10px] font-bold text-orange-100/20 uppercase tracking-widest">Showing 5 of 128 Archived Nodes</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-brand-earth/40 border border-orange-900/20 rounded-lg text-[10px] font-bold uppercase tracking-widest text-orange-100/20 disabled:opacity-30" disabled>Previous</button>
            <button className="px-4 py-2 bg-brand-earth/40 border border-orange-900/20 rounded-lg text-[10px] font-bold uppercase tracking-widest text-orange-100/40 hover:text-white hover:bg-brand-forest transition-all">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};
