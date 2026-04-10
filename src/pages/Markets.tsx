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
      } else {
        matchesCategory = s.market === activeCategory;
      }
    }
    
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-brand-amber border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading markets...</p>
      </div>
    );
  }

  if (error && activeSymbols.length === 0) {
    return (
      <div className="text-center py-20 glass-card bg-red-50 border-red-100">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl text-red-900 font-bold">Connection Error</h3>
        <p className="text-red-600 mt-2">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl text-brand-terracotta">Explore Markets</h2>
          <p className="text-gray-500 mt-2">Discover thousands of assets across global financial markets.</p>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap",
              activeCategory === cat.id ? "bg-brand-amber text-white shadow-lg shadow-brand-amber/20" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
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
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search assets (e.g. BTC, Gold, Volatility)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-6 text-lg outline-none focus:ring-2 focus:ring-brand-amber/20 shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSymbols.slice(0, 100).map((symbol) => (
            <div 
              key={symbol.symbol}
              onClick={() => navigate('/trade')}
              className="glass-card p-6 group cursor-pointer hover:border-brand-amber/50 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-earth flex items-center justify-center border border-gray-100 group-hover:bg-brand-amber/10 transition-all">
                    <TrendingUp className="text-brand-terracotta w-5 h-5 group-hover:text-brand-amber" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{symbol.display_name}</h4>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{symbol.market_display_name}</p>
                  </div>
                </div>
                <button className="text-gray-300 hover:text-yellow-400 transition-all">
                  <Star className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Spread</p>
                  <p className="font-mono text-sm font-bold text-gray-900">0.00012</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Leverage</p>
                  <p className="font-bold text-gray-900">1:1000</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-50 flex gap-2">
                <button className="flex-1 py-2 bg-brand-amber/10 text-brand-amber rounded-lg text-xs font-bold hover:bg-brand-amber hover:text-white transition-all">
                  Trade Now
                </button>
                <button className="px-3 py-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-gray-100 transition-all">
                  <BarChart3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredSymbols.length === 0 && (
          <div className="text-center py-20 glass-card">
            <Globe className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl text-gray-900">No markets found</h3>
            <p className="text-gray-500">Try adjusting your search or category filters.</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-brand-amber text-white rounded-xl font-bold hover:bg-brand-amber/90 transition-all"
            >
              Refresh Markets
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
