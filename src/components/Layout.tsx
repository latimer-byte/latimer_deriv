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
  Rocket,
  Sun,
  Moon
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
  const { balance, currency, isDemo, isGuest, loginId, logout, theme, toggleTheme } = useDeriv();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-aegis-bg relative overflow-hidden">
      {/* African Pattern Background Overlay */}
      <div className="absolute inset-0 african-pattern pointer-events-none" />

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-aegis-card backdrop-blur-xl border-r border-aegis-border z-10">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-amber rounded-xl flex items-center justify-center shadow-lg shadow-brand-amber/20">
            <TrendingUp className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-aegis-text font-display">Aegis</h1>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-brand-amber/10 text-brand-amber border border-brand-amber/20" 
                  : "text-aegis-text-muted hover:bg-brand-forest hover:text-aegis-text"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span className="font-bold uppercase tracking-[0.15em] text-[9px]">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-aegis-border space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-aegis-text-muted hover:bg-brand-forest hover:text-aegis-text transition-all"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="font-bold uppercase tracking-[0.15em] text-[9px]">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <NavLink
            to="/profile"
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
              isActive ? "bg-aegis-card text-aegis-text" : "text-aegis-text-muted hover:bg-aegis-card hover:text-aegis-text"
            )}
          >
            <User className="w-4 h-4" />
            <span className="font-bold uppercase tracking-[0.15em] text-[9px]">{loginId ? 'Account' : 'Sign In'}</span>
          </NavLink>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-aegis-card backdrop-blur-xl border-b border-aegis-border p-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-amber rounded-lg flex items-center justify-center">
            <TrendingUp className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-aegis-text font-display leading-tight">Aegis</h1>
            <p className="text-[10px] font-mono font-bold text-brand-amber leading-tight">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(balance)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="text-aegis-text p-2">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-aegis-text p-2">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 bg-aegis-bg z-30 p-6 flex flex-col md:hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-amber rounded-lg flex items-center justify-center neon-glow-red">
                  <TrendingUp className="text-white w-5 h-5" />
                </div>
                <h1 className="text-2xl font-bold text-aegis-text font-display">Aegis Trader</h1>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-aegis-text-muted hover:text-aegis-text"><X /></button>
            </div>
            <nav className="space-y-4 flex-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center gap-4 px-6 py-4 rounded-2xl text-lg font-bold uppercase tracking-widest",
                    isActive ? "bg-brand-amber text-white neon-glow-red" : "text-aegis-text-muted"
                  )}
                >
                  <item.icon className="w-6 h-6" />
                  {item.label}
                </NavLink>
              ))}
              <NavLink
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-4 px-6 py-4 rounded-2xl text-lg font-bold uppercase tracking-widest text-aegis-text-muted"
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
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-aegis-card/30 backdrop-blur-sm border-b border-aegis-border">
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-aegis-text-muted font-bold uppercase tracking-widest">System Status: <span className="text-brand-jungle">Operational</span></span>
            {isGuest ? (
              <span className="px-2 py-0.5 bg-brand-amber/10 text-brand-amber text-[9px] font-bold uppercase tracking-widest rounded border border-brand-amber/20">
                Simulation Mode
              </span>
            ) : isDemo && loginId ? (
              <span className="px-2 py-0.5 bg-brand-amber/10 text-brand-amber text-[9px] font-bold uppercase tracking-widest rounded border border-brand-amber/20">
                Virtual Account
              </span>
            ) : loginId ? (
              <span className="px-2 py-0.5 bg-brand-terracotta/10 text-brand-terracotta text-[9px] font-bold uppercase tracking-widest rounded border border-brand-terracotta/20">
                Live Network
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-8">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-aegis-card/50 border border-aegis-border text-aegis-text-muted hover:text-aegis-text transition-all"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="text-right">
              <p className="text-[9px] text-aegis-text-muted font-bold uppercase tracking-widest">Balance</p>
              <p className="text-xl font-mono font-bold text-aegis-text">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(balance)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-aegis-card/50 flex items-center justify-center border border-aegis-border">
              <User className="text-aegis-text-muted w-5 h-5" />
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
