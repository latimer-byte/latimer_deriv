import React from 'react';
import { useDeriv } from '@/contexts/DerivContext';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Zap, 
  Globe,
  Star,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const categories = [
  { id: 'all', label: 'All Markets', icon: Globe },
  { id: 'forex', label: 'Forex', icon: TrendingUp },
  { id: 'synthetic_index', label: 'Derived Indices', icon: Zap },
  { id: 'indices', label: 'Stock Indices', icon: BarChart3 },
  { id: 'commodities', label: 'Commodities', icon: BarChart3 },
  { id: 'cryptocurrency', label: 'Cryptocurrencies', icon: TrendingUp },
];

export const Markets: React.FC = () => {
  const { activeSymbols, isLoading, error } = useDeriv();
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const navigate = useNavigate();

  const filteredSymbols = activeSymbols.filter(s => {
    const matchesSearch = s.display_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         s.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Flexible category matching
    let matchesCategory = activeCategory === 'all';
    if (!matchesCategory) {
      if (activeCategory === 'synthetic_index') {
        matchesCategory = s.market === 'synthetic_index' || s.market === 'indices';
      } else if (activeCategory === 'cryptocurrency') {
        matchesCategory = s.market === 'cryptocurrency' || s.market === 'crypto';
      } else if (activeCategory === 'commodities') {
        matchesCategory = s.market === 'commodities' || s.market === 'commodity';
      } else {
        matchesCategory = s.market === activeCategory;
      }
    }
    
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 aegis-grid min-h-screen">
        <div className="w-12 h-12 border-4 border-brand-amber border-t-transparent rounded-full animate-spin"></div>
        <p className="text-aegis-text-muted font-bold uppercase tracking-widest text-xs">Scanning Neural Markets...</p>
      </div>
    );
  }

  if (error && activeSymbols.length === 0) {
    return (
      <div className="text-center py-20 glass-card border-brand-terracotta/20 aegis-grid min-h-screen">
        <AlertCircle className="w-16 h-16 text-brand-terracotta mx-auto mb-4" />
        <h3 className="text-xl text-aegis-text font-bold tracking-tight font-display">Neural Link Severed</h3>
        <p className="text-aegis-text-secondary mt-2">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-brand-amber text-white rounded-xl font-bold hover:bg-brand-amber/90 transition-all shadow-lg shadow-brand-amber/20 neon-glow-red"
        >
          Re-initialize Link
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 aegis-grid min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold text-aegis-text tracking-tight font-display">Market Nodes</h2>
          <p className="text-aegis-text-muted mt-1 uppercase tracking-[0.2em] text-[10px] font-bold">Global Asset Neural Network</p>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap border",
              activeCategory === cat.id 
                ? "bg-brand-amber text-white shadow-lg shadow-brand-amber/20 border-brand-amber neon-glow-red" 
                : "bg-aegis-card/40 text-aegis-text-muted border-aegis-border hover:bg-aegis-card hover:text-aegis-text"
            )}
          >
            <cat.icon className="w-5 h-5" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search & Grid */}
      <div className="space-y-6">
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-aegis-text-muted w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search asset nodes (e.g. BTC, Gold, Volatility)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-aegis-card/40 border border-aegis-border rounded-2xl py-4 pl-12 pr-6 text-lg outline-none focus:ring-2 focus:ring-brand-amber/20 shadow-sm text-aegis-text placeholder:text-aegis-text-muted"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSymbols.slice(0, 100).map((symbol) => (
            <div 
              key={symbol.symbol}
              onClick={() => {
                navigate(`/trade/${symbol.symbol}`);
              }}
              className="glass-card p-6 group cursor-pointer hover:border-brand-amber/50 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-aegis-bg flex items-center justify-center border border-aegis-border group-hover:bg-brand-amber/10 transition-all">
                    <TrendingUp className="text-brand-terracotta w-5 h-5 group-hover:text-brand-amber" />
                  </div>
                  <div>
                    <h4 className="font-bold text-aegis-text text-sm tracking-tight font-display">{symbol.display_name}</h4>
                    <p className="text-[10px] text-aegis-text-muted uppercase tracking-widest font-bold">{symbol.market_display_name}</p>
                  </div>
                </div>
                <button className="text-aegis-text-muted/10 hover:text-brand-amber transition-all">
                  <Star className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-aegis-text-muted mb-1 font-bold uppercase tracking-widest">Spread</p>
                  <p className="font-mono text-sm font-bold text-aegis-text">0.00012</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-aegis-text-muted mb-1 font-bold uppercase tracking-widest">Leverage</p>
                  <p className="font-bold text-aegis-text font-mono text-sm">1:1000</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-aegis-border flex gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/trade/${symbol.symbol}`);
                  }}
                  className="flex-1 py-2 bg-brand-amber/10 text-brand-amber rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-brand-amber hover:text-white transition-all border border-brand-amber/20"
                >
                  Trade
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/trade/${symbol.symbol}`);
                  }}
                  className="px-3 py-2 bg-aegis-bg text-aegis-text-muted rounded-lg hover:bg-aegis-card transition-all border border-aegis-border"
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredSymbols.length === 0 && (
          <div className="text-center py-20 glass-card bg-aegis-card/40 border-aegis-border">
            <Globe className="w-16 h-16 text-aegis-text-muted/10 mx-auto mb-4" />
            <h3 className="text-xl text-aegis-text font-bold tracking-tight font-display">No Market Nodes Found</h3>
            <p className="text-aegis-text-muted mt-1 uppercase tracking-widest text-[10px] font-bold">Adjust neural filters or search parameters</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-brand-amber text-white rounded-xl font-bold hover:bg-brand-amber/90 transition-all shadow-lg shadow-brand-amber/20 neon-glow-red"
            >
              Refresh Matrix
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
