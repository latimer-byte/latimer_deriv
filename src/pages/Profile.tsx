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
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Profile: React.FC = () => {
  const { loginId, currency, isDemo, authorize, logout } = useDeriv();
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
      setMessage({ type: 'success', text: 'API Token updated successfully!' });
      setToken('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update token' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl text-brand-terracotta">Account Settings</h2>
        <button 
          onClick={logout}
          className="px-4 py-2 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all flex items-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="space-y-2">
          {[
            { icon: User, label: 'Personal Info', active: true },
            { icon: Key, label: 'API & Security', active: false },
            { icon: Bell, label: 'Notifications', active: false },
            { icon: Shield, label: 'Privacy', active: false },
            { icon: Smartphone, label: 'Mobile App', active: false },
          ].map((item, i) => (
            <button
              key={i}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
                item.active ? "bg-brand-amber text-white shadow-lg shadow-brand-amber/20" : "text-gray-500 hover:bg-gray-50"
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
          <div className="glass-card p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-amber/10 flex items-center justify-center">
                <Key className="text-brand-amber w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl">Deriv API Token</h3>
                <p className="text-sm text-gray-500">Connect your Deriv account to start trading.</p>
              </div>
            </div>

            <form onSubmit={handleSaveToken} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">API Token</label>
                <input 
                  type="password" 
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Enter your Deriv API token..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-brand-amber/20"
                />
                <p className="text-[10px] text-gray-400 mt-2">
                  You can generate a token in your <a href="https://app.deriv.com/account/api-token" target="_blank" className="text-brand-amber hover:underline">Deriv Account Settings</a>.
                </p>
              </div>

              {message && (
                <div className={cn(
                  "p-4 rounded-xl flex items-center gap-3 text-sm font-medium",
                  message.type === 'success' ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
                )}>
                  {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  {message.text}
                </div>
              )}

              <button 
                type="submit"
                disabled={isSaving || !token}
                className="w-full py-4 bg-brand-amber text-white rounded-2xl font-bold shadow-lg shadow-brand-amber/20 hover:bg-brand-amber/90 transition-all disabled:opacity-50"
              >
                {isSaving ? 'Connecting...' : 'Connect Account'}
              </button>
            </form>
          </div>

          {/* Account Details */}
          <div className="glass-card p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-forest/10 flex items-center justify-center">
                <User className="text-brand-forest w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl">Account Details</h3>
                <p className="text-sm text-gray-500">Your current account status and preferences.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Login ID</p>
                <p className="font-mono font-bold text-gray-900">{loginId || 'Not Connected'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Currency</p>
                <p className="font-bold text-gray-900">{currency}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Account Type</p>
                <p className="font-bold text-gray-900">{isDemo ? 'Demo / Virtual' : 'Real Account'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", loginId ? "bg-green-500" : "bg-gray-300")} />
                  <p className="font-bold text-gray-900">{loginId ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
