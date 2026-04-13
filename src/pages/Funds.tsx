import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Smartphone, 
  Building2, 
  CreditCard,
  Bitcoin,
  ChevronRight,
  X,
  CheckCircle2
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useDeriv } from '@/contexts/DerivContext';

const paymentMethods = [
  { id: 'mpesa', name: 'M-Pesa', icon: Smartphone, color: 'bg-green-600', description: 'Instant deposit via Safaricom' },
  { id: 'mtn', name: 'MTN MoMo', icon: Smartphone, color: 'bg-yellow-500', description: 'Instant mobile money' },
  { id: 'airtel', name: 'Airtel Money', icon: Smartphone, color: 'bg-red-600', description: 'Fast mobile payments' },
  { id: 'bank', name: 'Bank Transfer', icon: Building2, color: 'bg-blue-600', description: 'Local bank settlement' },
  { id: 'card', name: 'Card', icon: CreditCard, color: 'bg-indigo-600', description: 'Visa / Mastercard' },
  { id: 'crypto', name: 'Crypto', icon: Bitcoin, color: 'bg-orange-500', description: 'BTC / ETH / USDT' },
];

export const Funds: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'deposit' | 'withdraw'>('deposit');
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const { balance, currency, updateGuestBalance } = useDeriv();

  const handleAction = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      // Update balance
      const updateAmount = activeTab === 'deposit' ? numAmount : -numAmount;
      updateGuestBalance(updateAmount, {
        pair: activeTab === 'deposit' ? 'DEPOSIT' : 'WITHDRAWAL',
        type: activeTab === 'deposit' ? 'Deposit' : 'Withdrawal',
        amount: `${activeTab === 'deposit' ? '+' : '-'}${formatCurrency(numAmount, currency)}`,
        status: 'Completed',
        price: selectedMethod.name,
        time: new Date().toISOString()
      });

      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setSelectedMethod(null);
        setAmount('');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 aegis-grid min-h-screen">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold text-aegis-text tracking-tight font-display">Capital Management</h2>
        <p className="text-aegis-text-muted uppercase tracking-widest text-[10px] font-bold">Neural Liquidity Deposit & Withdrawal</p>
      </div>

      <div className="flex justify-center">
        <div className="bg-aegis-bg p-1 rounded-2xl border border-aegis-border flex shadow-inner">
          <button 
            onClick={() => setActiveTab('deposit')}
            className={cn(
              "px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 uppercase tracking-widest text-xs",
              activeTab === 'deposit' 
                ? "bg-brand-amber text-white shadow-lg shadow-brand-amber/20 neon-glow-red" 
                : "text-aegis-text-muted hover:bg-aegis-card"
            )}
          >
            <ArrowUpCircle className="w-5 h-5" />
            Deposit
          </button>
          <button 
            onClick={() => setActiveTab('withdraw')}
            className={cn(
              "px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 uppercase tracking-widest text-xs",
              activeTab === 'withdraw' 
                ? "bg-brand-amber text-white shadow-lg shadow-brand-amber/20 neon-glow-red" 
                : "text-aegis-text-muted hover:bg-aegis-card"
            )}
          >
            <ArrowDownCircle className="w-5 h-5" />
            Withdrawal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paymentMethods.map((method) => (
          <motion.div
            key={method.id}
            whileHover={{ scale: 1.02, y: -2 }}
            onClick={() => setSelectedMethod(method)}
            className="glass-card p-6 flex items-center justify-between group cursor-pointer hover:border-brand-amber/30 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg", method.color)}>
                <method.icon className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-aegis-text tracking-tight font-display">{method.name}</h4>
                <p className="text-[10px] text-aegis-text-muted font-bold uppercase tracking-widest">{method.description}</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-aegis-bg flex items-center justify-center text-aegis-text-muted group-hover:bg-brand-amber group-hover:text-white transition-all border border-aegis-border">
              <ChevronRight className="w-5 h-5" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Modal */}
      <AnimatePresence>
        {selectedMethod && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-aegis-bg/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-aegis-card border border-orange-900/20 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-amber to-transparent" />
              
              <button 
                onClick={() => setSelectedMethod(null)}
                className="absolute top-4 right-4 p-2 hover:bg-aegis-bg rounded-full text-aegis-text-muted hover:text-aegis-text transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center space-y-6">
                <div className={cn("w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl", selectedMethod.color)}>
                  <selectedMethod.icon className="w-10 h-10" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-aegis-text tracking-tight capitalize font-display">{activeTab} Protocol: {selectedMethod.name}</h3>
                  <p className="text-aegis-text-muted text-[10px] font-bold uppercase tracking-widest mt-1">Neural Authorization Required</p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-aegis-text-muted font-mono">$</span>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-aegis-bg border border-aegis-border rounded-2xl py-4 pl-10 pr-4 text-xl font-bold outline-none focus:ring-2 focus:ring-brand-amber/20 text-aegis-text font-mono placeholder:text-aegis-text-muted"
                    />
                  </div>

                  {isSuccess ? (
                    <div className="bg-brand-jungle/10 text-brand-jungle p-4 rounded-2xl flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs border border-brand-jungle/20">
                      <CheckCircle2 className="w-6 h-6" />
                      {activeTab === 'deposit' ? 'Deposit' : 'Withdrawal'} Complete
                    </div>
                  ) : (
                    <button 
                      onClick={handleAction}
                      disabled={!amount || isProcessing}
                      className="w-full py-4 bg-brand-amber text-white rounded-2xl font-bold shadow-lg shadow-brand-amber/20 hover:bg-brand-amber/90 transition-all disabled:opacity-30 uppercase tracking-widest text-sm neon-glow-red"
                    >
                      {isProcessing ? 'Processing Neural Link...' : `Confirm ${activeTab === 'deposit' ? 'Deposit' : 'Withdrawal'}`}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="glass-card p-8 bg-gradient-to-br from-brand-amber/20 to-brand-terracotta/20 text-aegis-text overflow-hidden relative border-brand-amber/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-amber/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold tracking-tight font-display">Neural Support Node</h3>
            <p className="text-aegis-text-secondary text-sm max-w-md">Our global response team is active 24/7 to facilitate neural link stability across all African nodes.</p>
          </div>
          <button 
            onClick={() => navigate('/profile')}
            className="px-8 py-4 bg-brand-amber text-white rounded-2xl font-bold shadow-xl hover:scale-105 transition-all whitespace-nowrap neon-glow-red"
          >
            Connect Support
          </button>
        </div>
      </div>
    </div>
  );
};
