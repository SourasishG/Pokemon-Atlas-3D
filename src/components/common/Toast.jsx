import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { usePokemonStore } from '../../store/usePokemonStore';

export default function Toast() {
  const toast = usePokemonStore((state) => state.toast);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-white shadow-[0_0_30px_rgba(6,182,212,0.3)] backdrop-blur-xl"
      >
        {icons[toast.type] || icons.info}
        <span className="text-sm font-medium tracking-wide">{toast.message}</span>
      </motion.div>
    </AnimatePresence>
  );
}
