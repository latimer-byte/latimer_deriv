import React from 'react';
import { motion } from 'motion/react';

interface ShieldGaugeProps {
  riskLevel: number;
}

export const ShieldGauge: React.FC<ShieldGaugeProps> = ({ riskLevel }) => {
  const shieldColor = riskLevel > 70 ? '#B84B26' : '#F27D26'; // Terracotta if high risk, Amber if shielded

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle 
          cx="96" 
          cy="96" 
          r="80" 
          stroke="#1c1917" 
          strokeWidth="12" 
          fill="transparent" 
        />
        <motion.circle
          cx="96" 
          cy="96" 
          r="80" 
          stroke={shieldColor} 
          strokeWidth="12" 
          fill="transparent"
          strokeDasharray="502.4"
          initial={{ strokeDashoffset: 502.4 }}
          animate={{ strokeDashoffset: 502.4 - (502.4 * riskLevel) / 100 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-[10px] uppercase tracking-widest text-aegis-text-muted font-bold font-display">Shield Integrity</span>
        <span className="text-4xl font-mono font-bold text-aegis-text">{riskLevel}%</span>
      </div>
    </div>
  );
};
