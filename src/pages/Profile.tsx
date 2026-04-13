import React, { useState } from 'react';
import { useDeriv } from '@/contexts/DerivContext';
import { 
  User, 
  Key, 
  Settings, 
  Bell, 
  Shield, 
  Smartphone,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export const Profile: React.FC = () => {
  const { loginId, currency, isDemo, isGuest, authorize, setGuestMode, logout } = useDeriv();
  const [token, setToken] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSaveToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    setIsSaving(true);
    setMessage(null);
    try {
      await authorize(token);
      setMessage({ type: 'success', text: 'Aegis Network Link Established!' });
      setToken('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Link Failed: Invalid Credentials' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 aegis-grid min-h-screen p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold text-aegis-text tracking-tight font-display">Account Settings</h2>
          <p className="text-aegis-text-muted mt-1 uppercase tracking-[0.2em] text-[10px] font-bold">Manage your Aegis Network Identity & Security</p>
        </div>
        {loginId && (
          <button 
            onClick={logout}
            className="px-6 py-3 bg-brand-terracotta/10 text-brand-terracotta font-bold hover:bg-brand-terracotta hover:text-white rounded-xl transition-all flex items-center gap-2 border border-brand-terracotta/20"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        )}
      </div>

      {!loginId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 bg-brand-amber/5 border-brand-amber/20 text-aegis-text space-y-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-brand-amber/20 border border-brand-amber/30 flex items-center justify-center">
              <Zap className="w-7 h-7 text-brand-amber" />
            </div>
            <div>
              <h3 className="text-2xl font-bold font-display">Simulation Account</h3>
              <p className="text-aegis-text-secondary mt-2 text-sm leading-relaxed">Experience the Aegis Network with 10,000 virtual credits. Ideal for testing Sword & Shield strategies without capital risk.</p>
            </div>
            <button 
              onClick={setGuestMode}
              className="w-full py-4 bg-brand-amber text-white rounded-2xl font-bold shadow-lg shadow-brand-amber/20 hover:bg-brand-amber/90 transition-all"
            >
              Launch Simulation
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 bg-brand-terracotta/5 border-brand-terracotta/20 text-aegis-text space-y-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-brand-terracotta/20 border border-brand-terracotta/30 flex items-center justify-center">
              <User className="w-7 h-7 text-brand-terracotta" />
            </div>
            <div>
              <h3 className="text-2xl font-bold font-display">Live Network Link</h3>
              <p className="text-aegis-text-secondary mt-2 text-sm leading-relaxed">Connect your primary Deriv identity to execute real-market capital protocols. Full security clearance required.</p>
            </div>
            <a 
              href="https://deriv.com/signup/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full py-4 bg-brand-terracotta text-white text-center rounded-2xl font-bold shadow-lg shadow-brand-terracotta/20 hover:bg-brand-terracotta/90 transition-all"
            >
              Create Live Account
            </a>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-1">
          {[
            { icon: User, label: 'Personal Details', active: true },
            { icon: Key, label: 'API Token', active: false },
            { icon: Shield, label: 'Security', active: false },
            { icon: Bell, label: 'Notifications', active: false },
            { icon: Settings, label: 'Preferences', active: false },
          ].map((item, i) => (
            <button
              key={i}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-[10px] uppercase tracking-[0.15em]",
                item.active 
                  ? "bg-brand-amber/10 text-brand-amber border border-brand-amber/20" 
                  : "text-aegis-text-muted hover:bg-brand-forest hover:text-aegis-text"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-8">
          {/* Personal Details Section */}
          <div className="glass-card p-8 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-earth flex items-center justify-center border border-aegis-border">
                <User className="text-brand-amber w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-aegis-text">Personal Details</h3>
                <p className="text-sm text-aegis-text-secondary">Your Aegis Network identity information.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-aegis-text-muted uppercase tracking-widest">Full Name</label>
                <p className="text-aegis-text font-bold">{loginId ? 'Aegis Operator' : 'Unidentified'}</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-aegis-text-muted uppercase tracking-widest">Email Address</label>
                <p className="text-aegis-text font-bold">{loginId ? 'operator@aegis.network' : 'Not linked'}</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-aegis-text-muted uppercase tracking-widest">Country</label>
                <p className="text-aegis-text font-bold">Global Node</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-aegis-text-muted uppercase tracking-widest">Account Type</label>
                <p className="text-brand-amber font-bold">{isGuest ? 'Simulation' : isDemo ? 'Virtual' : 'Live'}</p>
              </div>
            </div>
          </div>

          {/* API Token Section */}
          <div className="glass-card p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-earth flex items-center justify-center border border-aegis-border">
                <Key className="text-brand-amber w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-aegis-text">API Token Management</h3>
                <p className="text-sm text-aegis-text-secondary">Securely link your Deriv account to the Aegis interface.</p>
              </div>
            </div>

            <form onSubmit={handleSaveToken} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-aegis-text-muted uppercase tracking-widest block">Deriv API Token</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter your 15-character token..."
                    className="w-full bg-brand-earth/50 border border-aegis-border rounded-xl py-4 px-6 text-aegis-text outline-none focus:border-brand-amber/50 font-mono placeholder:text-aegis-text-muted transition-all"
                  />
                </div>
                <div className="flex items-start gap-2 mt-3 p-4 bg-brand-amber/5 rounded-xl border border-brand-amber/10">
                  <AlertCircle className="w-4 h-4 text-brand-amber shrink-0 mt-0.5" />
                  <p className="text-[10px] text-aegis-text-muted leading-relaxed">
                    To generate a token, go to the <a href="https://app.deriv.com/account/api-token" target="_blank" className="text-brand-amber hover:underline font-bold">Deriv API Token page</a>. Select "Read" and "Trade" scopes for full Aegis functionality.
                  </p>
                </div>
              </div>

              {message && (
                <div className={cn(
                  "p-4 rounded-xl flex items-center gap-3 text-sm font-bold border",
                  message.type === 'success' 
                    ? "bg-brand-jungle/10 text-brand-jungle border-brand-jungle/20" 
                    : "bg-brand-terracotta/10 text-brand-terracotta border-brand-terracotta/20"
                )}>
                  {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  {message.text}
                </div>
              )}

              <button 
                type="submit"
                disabled={isSaving || !token}
                className="w-full py-4 bg-brand-amber text-white rounded-2xl font-bold shadow-lg shadow-brand-amber/20 hover:bg-brand-amber/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Link Deriv Account
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Account Status */}
          <div className="glass-card p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-earth flex items-center justify-center border border-aegis-border">
                <Shield className="text-brand-terracotta w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-aegis-text">Account Status</h3>
                <p className="text-sm text-aegis-text-secondary">Real-time connection diagnostics.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Login ID', value: loginId || 'N/A', mono: true },
                { label: 'Currency', value: currency },
                { label: 'Mode', value: isGuest ? 'Simulation' : isDemo ? 'Virtual' : 'Live' },
                { label: 'Status', value: loginId ? 'Connected' : 'Disconnected', status: !!loginId },
              ].map((stat, i) => (
                <div key={i} className="p-4 bg-brand-earth/30 rounded-xl border border-aegis-border">
                  <p className="text-[9px] text-aegis-text-muted font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                  <div className="flex items-center gap-2">
                    {stat.status !== undefined && (
                      <div className={cn("w-1.5 h-1.5 rounded-full", stat.status ? "bg-brand-jungle shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-aegis-text-muted/10")} />
                    )}
                    <p className={cn(
                      "font-bold text-aegis-text text-xs",
                      stat.mono && "font-mono"
                    )}>{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
