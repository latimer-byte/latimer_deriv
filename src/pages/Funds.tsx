import React from 'react';
import { 
  Wallet, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Smartphone, 
  Building2, 
  CreditCard,
  Bitcoin,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-4xl text-brand-terracotta">Manage Funds</h2>
        <p className="text-gray-500">Securely deposit and withdraw using your preferred local methods.</p>
      </div>

      <div className="flex justify-center">
        <div className="bg-white p-1 rounded-2xl border border-gray-200 flex shadow-sm">
          <button 
            onClick={() => setActiveTab('deposit')}
            className={cn(
              "px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2",
              activeTab === 'deposit' ? "bg-brand-amber text-white shadow-lg shadow-brand-amber/20" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <ArrowUpCircle className="w-5 h-5" />
            Deposit
          </button>
          <button 
            onClick={() => setActiveTab('withdraw')}
            className={cn(
              "px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2",
              activeTab === 'withdraw' ? "bg-brand-amber text-white shadow-lg shadow-brand-amber/20" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <ArrowDownCircle className="w-5 h-5" />
            Withdraw
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paymentMethods.map((method) => (
          <motion.div
            key={method.id}
            whileHover={{ scale: 1.02 }}
            className="glass-card p-6 flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg", method.color)}>
                <method.icon className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">{method.name}</h4>
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-brand-amber group-hover:text-white transition-all">
              <ChevronRight className="w-5 h-5" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-8 bg-brand-amber text-white overflow-hidden relative">
        {/* Decorative pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-2xl">Need Help?</h3>
            <p className="text-white/80 max-w-md">Our local support team is available 24/7 to assist you with your transactions in Kenya, Nigeria, South Africa, and more.</p>
          </div>
          <button className="px-8 py-4 bg-white text-brand-amber rounded-2xl font-bold shadow-xl hover:bg-gray-50 transition-all">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};
