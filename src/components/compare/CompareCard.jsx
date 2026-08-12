import React from 'react';
import { Award, ArrowRightLeft, Plus } from 'lucide-react';
import TypeBadge from '../pokemon/TypeBadge';

export default function CompareCard({ slotA, slotB, onSelectA, onSelectB, onSwap, onReset }) {
  const getStatWinner = (statName) => {
    if (!slotA || !slotB) return null;
    const valA = slotA.stats.find((s) => s.name === statName)?.value || 0;
    const valB = slotB.stats.find((s) => s.name === statName)?.value || 0;
    if (valA > valB) return 'A';
    if (valB > valA) return 'B';
    return 'TIE';
  };

  const statList = [
    { key: 'hp', label: 'HP' },
    { key: 'attack', label: 'Attack' },
    { key: 'defense', label: 'Defense' },
    { key: 'special-attack', label: 'Sp. Atk' },
    { key: 'special-defense', label: 'Sp. Def' },
    { key: 'speed', label: 'Speed' },
  ];

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex items-center justify-between p-4 glass-panel rounded-2xl border border-white/10">
        <span className="text-xs font-mono font-bold uppercase text-cyan-400">
          Dual Comparison Holographic Stage
        </span>
        <div className="flex items-center gap-2">
          {slotA && slotB && (
            <button
              onClick={onSwap}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono font-bold text-slate-300 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
            >
              <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
              <span>Swap</span>
            </button>
          )}
          {(slotA || slotB) && (
            <button
              onClick={onReset}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold uppercase hover:bg-rose-500/20 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Dual Stage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Slot A */}
        <SlotBox
          pokemon={slotA}
          slotLabel="Slot A"
          onSelect={onSelectA}
          isWinner={slotA && slotB && slotA.totalStats > slotB.totalStats}
        />

        {/* Slot B */}
        <SlotBox
          pokemon={slotB}
          slotLabel="Slot B"
          onSelect={onSelectB}
          isWinner={slotA && slotB && slotB.totalStats > slotA.totalStats}
        />
      </div>

      {/* Detailed Side-by-Side Stat Breakdown Bar Matrix */}
      {slotA && slotB && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <h3 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Direct Stat Benchmark Analysis
          </h3>

          <div className="space-y-4">
            {statList.map(({ key, label }) => {
              const valA = slotA.stats.find((s) => s.name === key)?.value || 0;
              const valB = slotB.stats.find((s) => s.name === key)?.value || 0;
              const winner = getStatWinner(key);

              return (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className={`font-bold ${winner === 'A' ? 'text-cyan-400 font-extrabold' : 'text-slate-400'}`}>
                      {valA} {winner === 'A' && '🏆'}
                    </span>
                    <span className="uppercase font-bold text-slate-300">{label}</span>
                    <span className={`font-bold ${winner === 'B' ? 'text-cyan-400 font-extrabold' : 'text-slate-400'}`}>
                      {winner === 'B' && '🏆'} {valB}
                    </span>
                  </div>

                  {/* Dual Comparison Bars */}
                  <div className="grid grid-cols-2 gap-2 h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/10">
                    {/* Left Bar (Slot A - grows right to left) */}
                    <div className="flex justify-end bg-slate-950/80 rounded-l-full overflow-hidden">
                      <div
                        className={`h-full rounded-l-full transition-all duration-500 ${
                          winner === 'A' ? 'bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'bg-slate-700'
                        }`}
                        style={{ width: `${Math.min((valA / 255) * 100, 100)}%` }}
                      />
                    </div>

                    {/* Right Bar (Slot B - grows left to right) */}
                    <div className="flex justify-start bg-slate-950/80 rounded-r-full overflow-hidden">
                      <div
                        className={`h-full rounded-r-full transition-all duration-500 ${
                          winner === 'B' ? 'bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'bg-slate-700'
                        }`}
                        style={{ width: `${Math.min((valB / 255) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* BST Total Stat Winner Banner */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between font-mono text-sm">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Total BST:</span>
              <span className="text-cyan-400 font-bold">{slotA.totalStats} vs {slotB.totalStats}</span>
            </div>

            {slotA.totalStats !== slotB.totalStats ? (
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold uppercase flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                Winner: {slotA.totalStats > slotB.totalStats ? slotA.displayName : slotB.displayName}
              </span>
            ) : (
              <span className="text-slate-400 font-bold">DRAW / EQUAL BST</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SlotBox({ pokemon, slotLabel, onSelect, isWinner }) {
  if (!pokemon) {
    return (
      <button
        onClick={onSelect}
        className="glass-card rounded-3xl p-8 border border-dashed border-white/20 hover:border-cyan-500/50 flex flex-col items-center justify-center gap-4 text-center min-h-[360px] group transition-all"
      >
        <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          <Plus className="w-8 h-8" />
        </div>
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
            {slotLabel} Empty
          </span>
          <h4 className="text-lg font-bold text-white mt-1">Select Pokémon to Compare</h4>
        </div>
      </button>
    );
  }

  return (
    <div className={`glass-card rounded-3xl p-6 border relative overflow-hidden flex flex-col justify-between min-h-[360px] ${
      isWinner ? 'border-cyan-500/60 shadow-[0_0_30px_rgba(6,182,212,0.3)]' : 'border-white/10'
    }`}>
      {isWinner && (
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-cyan-500 text-slate-950 font-mono text-[10px] font-black uppercase flex items-center gap-1 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
          <Award className="w-3.5 h-3.5" /> Higher BST
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-bold text-cyan-400 uppercase">{slotLabel}</span>
        <button
          onClick={onSelect}
          className="text-xs font-mono uppercase text-slate-400 hover:text-cyan-400 transition-colors"
        >
          Change
        </button>
      </div>

      <div className="my-4 flex flex-col items-center text-center">
        <img
          src={pokemon.image}
          alt={pokemon.displayName}
          className="w-36 h-36 object-contain drop-shadow-[0_10px_20px_rgba(6,182,212,0.4)]"
        />
        <h3 className="text-2xl font-black uppercase text-white mt-2">{pokemon.displayName}</h3>
        <span className="font-mono text-xs text-slate-400 mt-0.5">#{String(pokemon.id).padStart(4, '0')}</span>

        <div className="flex gap-1.5 mt-3">
          {pokemon.types.map((t) => (
            <TypeBadge key={t.name} type={t.name} size="sm" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/10 text-xs font-mono text-slate-300">
        <div>Height: <strong className="text-white">{pokemon.height} m</strong></div>
        <div>Weight: <strong className="text-white">{pokemon.weight} kg</strong></div>
        <div>BST: <strong className="text-cyan-400">{pokemon.totalStats}</strong></div>
        <div>SPD: <strong className="text-yellow-400">{pokemon.stats.find(s => s.name === 'speed')?.value || 0}</strong></div>
      </div>
    </div>
  );
}
