import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function EvolutionChain({ chain = [] }) {
  if (!chain || chain.length <= 1) {
    return (
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 text-slate-400 text-xs text-center font-mono">
        This Pokémon does not evolve or has a unique standalone evolution structure.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-4">
      {chain.map((evo, index) => (
        <React.Fragment key={evo.id}>
          {index > 0 && (
            <div className="flex flex-col items-center justify-center text-slate-500 my-2">
              <ChevronRight className="w-6 h-6 text-cyan-400 animate-pulse" />
              <span className="text-[10px] font-mono text-slate-400 mt-1 uppercase">
                {evo.minLevel ? `Lvl ${evo.minLevel}` : evo.trigger || 'Evolve'}
              </span>
            </div>
          )}

          <Link
            to={`/pokemon/${evo.name}`}
            className="flex flex-col items-center gap-2 group p-3 rounded-2xl bg-slate-900/50 border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all text-center min-w-[120px]"
          >
            <div className="w-20 h-20 relative flex items-center justify-center">
              <img
                src={evo.image}
                alt={evo.displayName}
                className="w-16 h-16 object-contain group-hover:scale-110 transition-transform"
                loading="lazy"
              />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-white group-hover:text-cyan-400">
              {evo.displayName}
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              #{String(evo.id).padStart(4, '0')}
            </span>
          </Link>
        </React.Fragment>
      ))}
    </div>
  );
}
