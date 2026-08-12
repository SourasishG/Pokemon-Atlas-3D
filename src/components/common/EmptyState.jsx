import React from 'react';

export default function EmptyState({ title, description, actionText, onAction, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center glass-panel rounded-3xl border border-white/10 my-8 max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
        {Icon ? <Icon className="w-8 h-8" /> : <span className="text-2xl">⚡</span>}
      </div>
      <h3 className="text-2xl font-bold uppercase tracking-wide text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm max-w-md leading-relaxed mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-cyan-500 text-slate-950 font-bold uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:bg-cyan-400 transition-all hover:scale-105 active:scale-95"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
