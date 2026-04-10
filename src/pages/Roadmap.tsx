import React from 'react';
import { 
  Rocket, 
  Target, 
  TrendingUp, 
  Zap, 
  Crown, 
  Cpu, 
  Shield, 
  Globe, 
  Users,
  Layers,
  Smartphone,
  Trophy,
  Coins
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

const roadmapPhases = [
  {
    id: 'mvp',
    title: 'Phase 1: MVP (0–3 Months)',
    subtitle: 'Foundation & Core Utility',
    icon: Rocket,
    color: 'bg-blue-500',
    coreFeatures: [
      'Deriv API Integration (WebSocket)',
      'Demo & Real Account Switching',
      'Basic Mobile Money (M-Pesa, MTN)',
      'Major Forex & Synthetic Indices'
    ],
    gamification: [
      'Daily Login XP',
      'First Trade Badge',
      'Simple Leveling System (1-10)'
    ],
    trading: [
      'Real-time Line Charts',
      'Instant Execution (Rise/Fall)',
      'Basic Portfolio Tracking'
    ],
    ai: 'N/A (Focus on system stability)',
    monetization: 'Spreads & Commission (via Deriv)',
    kpis: 'Day 1 Retention, CAC, System Uptime',
    notBuild: 'Social Trading, Complex AI, Advanced Indicators'
  },
  {
    id: 'pmf',
    title: 'Phase 2: PMF (3–9 Months)',
    subtitle: 'Retention & Education',
    icon: Target,
    color: 'bg-green-500',
    coreFeatures: [
      'AfriLearn Hub (Interactive Lessons)',
      'Quiz-based Rewards',
      'Crypto & Commodity Assets',
      'Multi-country Payment Gateways'
    ],
    gamification: [
      'Weekly Trading Leagues (Bronze/Silver/Gold)',
      'Streak Bonuses',
      'Educational Milestone Badges'
    ],
    trading: [
      'Candlestick Charts',
      'Basic Indicators (RSI, MA)',
      'Price Alerts (Push Notifications)'
    ],
    ai: 'Sentiment Analysis (News & Social)',
    monetization: 'Premium Education Content, Entry Fees for Tournaments',
    kpis: 'Day 30 Retention, LTV/CAC, Course Completion Rate',
    notBuild: 'Copy Trading, Clan Systems'
  },
  {
    id: 'growth',
    title: 'Phase 3: Growth (9–18 Months)',
    subtitle: 'Social & Viral Loops',
    icon: TrendingUp,
    color: 'bg-brand-amber',
    coreFeatures: [
      'Social Feed & Community Groups',
      'Copy Trading (Follow Top Traders)',
      'Referral Engine (Trade-to-Earn)',
      'Advanced Risk Management Tools'
    ],
    gamification: [
      '1v1 Trading Battles',
      'Global Leaderboards',
      'Referral XP Multipliers'
    ],
    trading: [
      'Advanced Charting (TradingView Integration)',
      'Multi-chart Layouts',
      'One-click Trading'
    ],
    ai: 'Personalized Risk Alerts & Behavioral Feedback',
    monetization: 'Copy-trading Subscription, Tiered Account Benefits',
    kpis: 'Viral Coefficient, MAU, Social Engagement Rate',
    notBuild: 'Institutional API, Tokenized Real Estate'
  },
  {
    id: 'scale',
    title: 'Phase 4: Scale (18–36 Months)',
    subtitle: 'Global Expansion & Automation',
    icon: Zap,
    color: 'bg-purple-500',
    coreFeatures: [
      'Expansion to LATAM & SE Asia',
      'Institutional Trading API',
      'Automated Trading Bot Builder',
      'Tokenized Stocks & ETFs'
    ],
    gamification: [
      'Clan/Team Trading Competitions',
      'Seasonal World Championships',
      'Dynamic NFT Achievements'
    ],
    trading: [
      'Options & Futures Trading',
      'Algorithmic Execution',
      'Cross-margin Accounts'
    ],
    ai: 'AI-driven Automated Trading Strategies',
    monetization: 'API Access Fees, Asset Management Fees',
    kpis: 'Market Share, Revenue Growth, API Usage',
    notBuild: 'Full Banking License'
  },
  {
    id: 'unicorn',
    title: 'Phase 5: Unicorn (3+ Years)',
    subtitle: 'The Financial Super App',
    icon: Crown,
    color: 'bg-brand-terracotta',
    coreFeatures: [
      'AfriBank (Digital Banking & Cards)',
      'Tokenized Real Estate Marketplace',
      'Insurance & Pension Products',
      'Venture Capital Launchpad'
    ],
    gamification: [
      'Metaverse Trading Floor',
      'Real-world Reward Redemption',
      'Governance Token (DAO)'
    ],
    trading: [
      'Private Equity Access',
      'Fractional Real Estate',
      'Universal Asset Wallet'
    ],
    ai: 'Fully Autonomous Wealth Management (AI Concierge)',
    monetization: 'Ecosystem Fees, Interest Income, Underwriting',
    kpis: 'Valuation ($1B+), Ecosystem Volume, Brand Equity',
    notBuild: 'N/A (Full Ecosystem)'
  }
];

export const Roadmap: React.FC = () => {
  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h2 className="text-5xl text-brand-terracotta">AfriTrade Vision</h2>
        <p className="text-xl text-gray-500 leading-relaxed">
          The roadmap to becoming Africa's first trading unicorn. From a simple utility to a global financial super-app.
        </p>
      </div>

      {/* Tech & Architecture Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-8 space-y-4 border-l-4 border-blue-500">
          <div className="flex items-center gap-3">
            <Layers className="text-blue-500 w-6 h-6" />
            <h3 className="text-xl">Architecture</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> MVP: Node.js Monolith</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Scale: Go Microservices</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Event-driven (Kafka/Redis)</li>
          </ul>
        </div>
        <div className="glass-card p-8 space-y-4 border-l-4 border-purple-500">
          <div className="flex items-center gap-3">
            <Cpu className="text-purple-500 w-6 h-6" />
            <h3 className="text-xl">AI Strategy</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Behavioral Analysis</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Predictive Risk Models</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> LLM-powered Education</li>
          </ul>
        </div>
        <div className="glass-card p-8 space-y-4 border-l-4 border-brand-amber">
          <div className="flex items-center gap-3">
            <Smartphone className="text-brand-amber w-6 h-6" />
            <h3 className="text-xl">UX Philosophy</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-amber" /> Simple, Fast, Addictive</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-amber" /> Low-data Optimization</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-amber" /> Haptic "Win" Feedback</li>
          </ul>
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div className="space-y-12 relative">
        {/* Vertical Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 hidden md:block" />

        {roadmapPhases.map((phase, index) => (
          <motion.div 
            key={phase.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative md:pl-24"
          >
            {/* Phase Icon */}
            <div className={cn(
              "absolute left-0 top-0 w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl z-10 hidden md:flex",
              phase.color
            )}>
              <phase.icon className="w-8 h-8" />
            </div>

            <div className="glass-card p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-3xl text-brand-terracotta">{phase.title}</h3>
                  <p className="text-brand-amber font-bold uppercase tracking-widest text-sm">{phase.subtitle}</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full uppercase">Monetization: {phase.monetization}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-3 h-3" /> Core Features
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {phase.coreFeatures.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <div className="w-1 h-1 rounded-full bg-brand-amber mt-1.5" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Trophy className="w-3 h-3" /> Gamification
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {phase.gamification.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <div className="w-1 h-1 rounded-full bg-brand-amber mt-1.5" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp className="w-3 h-3" /> Trading
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {phase.trading.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <div className="w-1 h-1 rounded-full bg-brand-amber mt-1.5" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                      <Cpu className="w-3 h-3" /> AI Features
                    </h4>
                    <p className="text-sm text-gray-700">{phase.ai}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                      <Target className="w-3 h-3" /> Key KPIs
                    </h4>
                    <p className="text-sm text-gray-700">{phase.kpis}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-red-500 font-medium">
                  <Shield className="w-3 h-3" />
                  <span>NOT TO BUILD YET: {phase.notBuild}</span>
                </div>
                <button className="text-brand-amber text-sm font-bold flex items-center gap-1 hover:underline">
                  Full Spec <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Differentiation Section */}
      <div className="glass-card p-12 bg-brand-terracotta text-white space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-4xl">Unique Differentiation</h3>
          <p className="text-white/70">How we win against global giants like Robinhood and eToro.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold">Africa-First Localization</h4>
            <p className="text-sm text-white/70 leading-relaxed">
              Deep integration with M-Pesa, MTN MoMo, and Airtel Money. Offline trading capabilities for low-connectivity areas.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold">Trading Battles</h4>
            <p className="text-sm text-white/70 leading-relaxed">
              Gamified 1v1 and team-based trading challenges that turn financial markets into a competitive social sport.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <Coins className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold">Tokenized Real World</h4>
            <p className="text-sm text-white/70 leading-relaxed">
              Access to fractionalized real estate and private equity in emerging markets, previously inaccessible to retail traders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);
