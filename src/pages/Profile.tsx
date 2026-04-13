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
    <div className="max-w-5xl mx-auto space-y-8 pb-20 aegis-grid min-h-screen p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold text-white tracking-tight font-display">Identity & Security</h2>
          <p className="text-orange-100/40 mt-1 uppercase tracking-[0.2em] text-[10px] font-bold">Aegis Shield Protocol v4.0</p>
        </div>
        {loginId && (
          <button 
            onClick={logout}
            className="px-6 py-3 bg-brand-terracotta/10 text-brand-terracotta font-bold hover:bg-brand-terracotta hover:text-white rounded-xl transition-all flex items-center gap-2 border border-brand-terracotta/20"
          >
            <LogOut className="w-5 h-5" />
            Terminate Session
          </button>
        )}
      </div>

      {!loginId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 bg-brand-amber/10 border-brand-amber/30 text-white space-y-6 neon-glow-red"
          >
            <div className="w-16 h-16 rounded-2xl bg-brand-amber flex items-center justify-center shadow-lg shadow-brand-amber/40">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold font-display">Initialize Simulation</h3>
              <p className="text-orange-100/40 mt-2">Access the Aegis Sandbox with 10,000 virtual credits. Perfect for stress-testing your Sword & Shield strategies.</p>
            </div>
            <button 
              onClick={setGuestMode}
              className="w-full py-4 bg-brand-amber text-white rounded-2xl font-bold shadow-xl shadow-brand-amber/20 hover:scale-[1.02] transition-all neon-glow-red"
            >
              Enter Simulation Mode
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 bg-brand-terracotta/10 border-brand-terracotta/30 text-white space-y-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-brand-terracotta flex items-center justify-center shadow-lg shadow-brand-terracotta/40">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold font-display">Establish Live Link</h3>
              <p className="text-orange-100/40 mt-2">Connect your primary Deriv identity to the Aegis Network. Required for real-market capital execution.</p>
            </div>
            <a 
              href="https://deriv.com/signup/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full py-4 bg-brand-terracotta text-white text-center rounded-2xl font-bold shadow-xl shadow-brand-terracotta/20 hover:scale-[1.02] transition-all"
            >
              Register New Identity
            </a>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="space-y-2">
          {[
            { icon: User, label: 'Identity Matrix', active: true },
            { icon: Key, label: 'API Protocols', active: false },
            { icon: Bell, label: 'Neural Alerts', active: false },
            { icon: Shield, label: 'Firewall', active: false },
            { icon: Smartphone, label: 'Mobile Node', active: false },
          ].map((item, i) => (
            <button
              key={i}
              className={cn(
                "w-full flex items-center gap-3 px-6 py-4 rounded-xl font-bold transition-all text-sm uppercase tracking-widest",
                item.active 
                  ? "bg-brand-amber text-white shadow-lg shadow-brand-amber/20 border border-brand-amber/30 neon-glow-red" 
                  : "text-orange-100/40 hover:bg-brand-forest hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="md:col-span-2 space-y-8">
          {/* API Token Section */}
          <div className="glass-card p-8 space-y-6 bg-brand-forest/40 border-orange-900/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-earth flex items-center justify-center border border-orange-900/20">
                <Key className="text-brand-amber w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display">Network Access Token</h3>
                <p className="text-sm text-orange-100/40">Inject your Deriv API token to synchronize with the market.</p>
              </div>
            </div>

            <form onSubmit={handleSaveToken} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-orange-100/40 uppercase tracking-[0.2em] mb-2 block">Encrypted Token</label>
                <input 
                  type="password" 
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste Aegis Access Key..."
                  className="w-full bg-brand-earth border border-orange-900/20 rounded-xl py-4 px-6 text-white outline-none focus:ring-2 focus:ring-brand-amber/20 font-mono placeholder:text-orange-100/10"
                />
                <p className="text-[10px] text-orange-100/20 mt-3">
                  Generate your node key in the <a href="https://app.deriv.com/account/api-token" target="_blank" className="text-brand-amber hover:underline">Deriv Control Panel</a>.
                </p>
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
                className="w-full py-4 bg-brand-earth border border-orange-900/20 text-white rounded-2xl font-bold hover:bg-brand-forest transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-brand-amber border-t-transparent rounded-full animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 text-brand-amber" />
                    Establish Network Link
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Account Details */}
          <div className="glass-card p-8 space-y-6 bg-brand-forest/40 border-orange-900/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-earth flex items-center justify-center border border-orange-900/20">
                <Shield className="text-brand-terracotta w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display">Node Diagnostics</h3>
                <p className="text-sm text-orange-100/40">Current status of your Aegis connection.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Node ID', value: loginId || 'OFFLINE', mono: true },
                { label: 'Currency', value: currency },
                { label: 'Protocol', value: isGuest ? 'GUEST_SIM' : isDemo ? 'VIRTUAL_LINK' : 'REAL_CAPITAL' },
                { label: 'Network Status', value: loginId ? 'ENCRYPTED' : 'DISCONNECTED', status: !!loginId },
              ].map((stat, i) => (
                <div key={i} className="p-4 bg-brand-earth rounded-xl border border-orange-900/20">
                  <p className="text-[10px] text-orange-100/40 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                  <div className="flex items-center gap-2">
                    {stat.status !== undefined && (
                      <div className={cn("w-1.5 h-1.5 rounded-full", stat.status ? "bg-brand-jungle animate-pulse" : "bg-orange-100/10")} />
                    )}
                    <p className={cn(
                      "font-bold text-white text-sm",
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
