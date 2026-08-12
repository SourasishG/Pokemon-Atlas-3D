import React from 'react';
import { motion } from 'motion/react';

export default function StatBar({ label, value, max = 255, color = 'bg-cyan-500', animated = true }) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs font-mono tracking-widest text-slate-300">
        <span className="uppercase text-slate-400 font-semibold">{label}</span>
        <span className="font-bold text-cyan-400">{value} <span className="text-[10px] text-slate-500">/ {max}</span></span>
      </div>
      <div className="h-2 w-full bg-slate-900/80 rounded-full overflow-hidden p-0.5 border border-white/10">
        <motion.div
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${color} shadow-[0_0_10px_rgba(6,182,212,0.5)]`}
        />
      </div>
    </div>
  );
}
