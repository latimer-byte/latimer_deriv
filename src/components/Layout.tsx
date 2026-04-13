import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Wallet, 
  History, 
  Globe, 
  User,
  LogOut,
  Menu,
  X,
  Rocket
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDeriv } from '@/contexts/DerivContext';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: TrendingUp, label: 'Trade', path: '/trade' },
  { icon: Wallet, label: 'Funds', path: '/funds' },
  { icon: History, label: 'History', path: '/history' },
  { icon: Globe, label: 'Markets', path: '/markets' },
  { icon: Rocket, label: 'Roadmap', path: '/roadmap' },
];

export const Layout: React.FC = () => {
  const { balance, currency, isDemo, isGuest, loginId, logout } = useDeriv();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-brand-earth relative overflow-hidden">
      {/* African Pattern Background Overlay */}
      <div className="absolute inset-0 african-pattern pointer-events-none" />

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-brand-forest/80 backdrop-blur-xl border-r border-orange-900/20 z-10">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-amber rounded-xl flex items-center justify-center shadow-lg shadow-brand-amber/20 neon-glow-red">
            <TrendingUp className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">Aegis Trader</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-brand-amber text-white shadow-lg shadow-brand-amber/20 neon-glow-red" 
                  : "text-orange-100/40 hover:bg-brand-forest hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-bold uppercase tracking-widest text-[10px]">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-orange-900/20">
          <NavLink
            to="/profile"
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
              isActive ? "bg-brand-forest text-white" : "text-orange-100/40 hover:bg-brand-forest hover:text-white"
            )}
          >
            <User className="w-5 h-5" />
            <span className="font-bold uppercase tracking-widest text-[10px]">{loginId ? 'Profile' : 'Login / Sign Up'}</span>
          </NavLink>
          {loginId && (
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-brand-terracotta hover:bg-brand-terracotta/10 transition-all mt-2"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-bold uppercase tracking-widest text-[10px]">Logout</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-brand-forest/90 backdrop-blur-xl border-b border-orange-900/20 p-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-amber rounded-lg flex items-center justify-center neon-glow-red">
            <TrendingUp className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-white font-display">Aegis Trader</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 bg-brand-earth z-30 p-6 flex flex-col md:hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-amber rounded-lg flex items-center justify-center neon-glow-red">
                  <TrendingUp className="text-white w-5 h-5" />
                </div>
                <h1 className="text-2xl font-bold text-white font-display">Aegis Trader</h1>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-orange-100/40 hover:text-white"><X /></button>
            </div>
            <nav className="space-y-4 flex-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center gap-4 px-6 py-4 rounded-2xl text-lg font-bold uppercase tracking-widest",
                    isActive ? "bg-brand-amber text-white neon-glow-red" : "text-orange-100/40"
                  )}
                >
                  <item.icon className="w-6 h-6" />
                  {item.label}
                </NavLink>
              ))}
              <NavLink
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-4 px-6 py-4 rounded-2xl text-lg font-bold uppercase tracking-widest text-orange-100/40"
            >
              <User className="w-6 h-6" />
              {loginId ? 'Profile' : 'Login / Sign Up'}
            </NavLink>
          </nav>
          {loginId && (
            <button 
              onClick={logout}
              className="flex items-center gap-4 px-6 py-4 rounded-2xl text-lg font-bold uppercase tracking-widest text-brand-terracotta"
            >
              <LogOut className="w-6 h-6" />
              Logout
            </button>
          )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col z-10 overflow-auto">
        {/* Top Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-brand-forest/50 backdrop-blur-sm border-b border-orange-900/20">
          <div className="flex items-center gap-4">
            <span className="text-sm text-orange-100/40 font-medium">Welcome back, <span className="text-white">{loginId || 'Trader'}</span></span>
            {isGuest ? (
              <span className="px-2 py-0.5 bg-brand-amber/10 text-brand-amber text-[10px] font-bold uppercase tracking-wider rounded border border-brand-amber/20">
                Aegis Shield Active
              </span>
            ) : isDemo && loginId ? (
              <span className="px-2 py-0.5 bg-brand-amber/10 text-brand-amber text-[10px] font-bold uppercase tracking-wider rounded border border-brand-amber/20">
                Simulation Mode
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-orange-100/40 font-medium uppercase tracking-wider">Available Credits</p>
              <p className="text-xl font-mono font-bold text-white">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(balance)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-brand-forest flex items-center justify-center border border-orange-900/20">
              <User className="text-orange-100/40 w-5 h-5" />
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
