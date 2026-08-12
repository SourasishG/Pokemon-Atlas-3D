import React from 'react';
import { LayoutGrid, List, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { POKEMON_TYPES, POKEMON_GENERATIONS } from '../../constants/pokemonConstants';
import { usePokemonStore } from '../../store/usePokemonStore';
import TypeBadge from './TypeBadge';

export default function FilterBar() {
  const {
    selectedType,
    setSelectedType,
    selectedGen,
    setSelectedGen,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
  } = usePokemonStore();

  const handleResetFilters = () => {
    setSelectedType('all');
    setSelectedGen('all');
    setSortBy('id-asc');
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 glass-panel rounded-2xl border border-white/10">
        <div className="flex flex-wrap items-center gap-3">
          {/* Generation Select */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <select
              value={selectedGen}
              onChange={(e) => setSelectedGen(e.target.value)}
              aria-label="Filter by Generation"
              className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono uppercase text-slate-200 focus:outline-none focus:border-cyan-500/50"
            >
              {POKEMON_GENERATIONS.map((gen) => (
                <option key={gen.id} value={gen.id}>
                  {gen.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Select */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort Pokémon list"
            className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono uppercase text-slate-200 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="id-asc">ID: Lowest to Highest</option>
            <option value="id-desc">ID: Highest to Lowest</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="stat-desc">Base Stats: Highest First</option>
          </select>

          {/* Reset Filters */}
          {(selectedType !== 'all' || selectedGen !== 'all' || sortBy !== 'id-asc') && (
            <button
              onClick={handleResetFilters}
              className="px-3 py-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-mono uppercase border border-rose-500/30 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg text-xs transition-colors ${
              viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg text-xs transition-colors ${
              viewMode === 'list' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Type Pills Selector (Horizontally Scrollable) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all border shrink-0 ${
            selectedType === 'all'
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : 'bg-slate-900/60 text-slate-400 border-white/10 hover:text-white hover:border-white/20'
          }`}
        >
          All Types
        </button>

        {POKEMON_TYPES.map((type) => {
          const isSelected = selectedType === type;
          return (
            <button
              key={type}
              onClick={() => setSelectedType(isSelected ? 'all' : type)}
              className={`shrink-0 transition-all ${isSelected ? 'scale-110' : 'opacity-70 hover:opacity-100'}`}
            >
              <TypeBadge type={type} size="md" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
