import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { currency, guestTrades } = useDeriv();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterType, setFilterType] = React.useState('All');

  const filteredTrades = guestTrades.filter(trade => {
    const matchesSearch = trade.pair.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         trade.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'All' || 
                         (filterType === 'Buy' && trade.type === 'Buy') ||
                         (filterType === 'Sell' && trade.type === 'Sell') ||
                         (filterType === 'Funds' && (trade.type === 'Deposit' || trade.type === 'Withdrawal'));
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 pb-20 aegis-grid min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold text-aegis-text tracking-tight font-display">Operation History</h2>
          <p className="text-aegis-text-muted mt-1 uppercase tracking-[0.2em] text-[10px] font-bold">Archived Neural Execution Logs</p>
        </div>
        <button className="px-6 py-3 bg-brand-forest/40 text-aegis-text-secondary border border-aegis-border rounded-xl font-bold hover:bg-brand-forest transition-all flex items-center gap-2 text-sm">
          <Download className="w-5 h-5" />
          Export Data Node
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-aegis-border flex flex-col md:flex-row gap-4 items-center justify-between bg-brand-earth/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-aegis-text-muted w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by asset or operation ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-earth/40 border border-aegis-border rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-brand-amber/20 text-aegis-text placeholder:text-aegis-text-muted"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-4 py-2 bg-brand-earth/40 border border-aegis-border rounded-xl text-xs font-bold uppercase tracking-widest text-aegis-text-muted flex items-center justify-center gap-2 hover:bg-brand-forest hover:text-aegis-text transition-all">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex-1 md:flex-none px-4 py-2 bg-brand-earth/40 border border-aegis-border rounded-xl text-xs font-bold uppercase tracking-widest text-aegis-text-muted outline-none focus:ring-2 focus:ring-brand-amber/20 appearance-none"
            >
              <option value="All">All Protocols</option>
              <option value="Buy">Buy (Rise)</option>
              <option value="Sell">Sell (Fall)</option>
              <option value="Funds">Funds (D/W)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-earth/50">
                <th className="px-6 py-4 text-[10px] font-bold text-aegis-text-muted uppercase tracking-widest">Asset Node</th>
                <th className="px-6 py-4 text-[10px] font-bold text-aegis-text-muted uppercase tracking-widest">Protocol</th>
                <th className="px-6 py-4 text-[10px] font-bold text-aegis-text-muted uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold text-aegis-text-muted uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-aegis-text-muted uppercase tracking-widest">Reference</th>
                <th className="px-6 py-4 text-[10px] font-bold text-aegis-text-muted uppercase tracking-widest">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-bold text-aegis-text-muted uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aegis-border">
              {filteredTrades.length > 0 ? filteredTrades.map((trade, i) => (
                <tr 
                  key={i} 
                  onClick={() => trade.symbol && navigate(`/trade/${trade.symbol}`)}
                  className={cn(
                    "hover:bg-brand-forest/50 transition-all group",
                    trade.symbol ? "cursor-pointer" : ""
                  )}
                >
                  <td className="px-6 py-4">
                    <p className="font-bold text-aegis-text text-sm tracking-tight">{trade.pair}</p>
                    <p className="text-[10px] text-aegis-text-muted font-mono uppercase tracking-tighter">NODE-ID: #AEGIS-{92834 + i}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border",
                      trade.type === 'Buy' || trade.type === 'Deposit'
                        ? "bg-brand-jungle/10 text-brand-jungle border-brand-jungle/20" 
                        : "bg-brand-terracotta/10 text-brand-terracotta border-brand-terracotta/20"
                    )}>
                      {trade.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "font-bold font-mono text-sm",
                      trade.amount.startsWith('+') ? "text-brand-jungle" : "text-brand-terracotta"
                    )}>
                      {trade.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      trade.status === 'Win' || trade.status === 'Completed' ? "text-brand-jungle" : "text-brand-terracotta"
                    )}>
                      {trade.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-[10px] text-aegis-text-muted">{trade.price}</td>
                  <td className="px-6 py-4 text-[10px] text-aegis-text-muted font-bold uppercase tracking-widest">
                    {new Date(trade.time).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {trade.symbol && (
                      <button className="p-2 text-aegis-text-muted/20 hover:text-brand-amber transition-all">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <HistoryIcon className="w-12 h-12 text-aegis-text-muted/10 mx-auto mb-4" />
                    <p className="text-aegis-text-muted font-bold uppercase tracking-widest text-xs">No neural logs found in this sector</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-brand-earth/50 border-t border-aegis-border flex items-center justify-between">
          <p className="text-[10px] font-bold text-aegis-text-muted uppercase tracking-widest">
            Showing {filteredTrades.length} Archived Nodes
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-brand-earth/40 border border-aegis-border rounded-lg text-[10px] font-bold uppercase tracking-widest text-aegis-text-muted disabled:opacity-30" disabled>Previous</button>
            <button className="px-4 py-2 bg-brand-earth/40 border border-aegis-border rounded-lg text-[10px] font-bold uppercase tracking-widest text-aegis-text-secondary hover:text-aegis-text hover:bg-brand-forest transition-all">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};
