import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Sparkles } from 'lucide-react';
import Modal from '../common/Modal';
import TypeBadge from './TypeBadge';
import SkeletonCard from '../common/SkeletonCard';
import { getPokemonList } from '../../services/pokeapi';
import { POKEMON_TYPES } from '../../constants/pokemonConstants';

export default function PokemonSelectModal({ isOpen, onClose, onSelectPokemon, title = "Select a Pokémon" }) {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();
    setLoading(true);

    const timer = setTimeout(() => {
      getPokemonList({
        limit: 20,
        offset: 0,
        search,
        type: selectedType,
        signal: controller.signal,
      })
        .then((res) => {
          if (res && res.items) {
            setItems(res.items);
          }
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            console.error(err);
          }
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [isOpen, search, selectedType]);

  const handleSelect = (pokemon) => {
    onSelectPokemon(pokemon);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-4xl">
      <div className="space-y-4">
        {/* Search & Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or #ID (e.g. Lucario, 448)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/50"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 uppercase font-mono"
            >
              <option value="all">All Types</option>
              {POKEMON_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results grid */}
        <div className="max-h-[60vh] overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {loading
            ? Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="h-32 rounded-2xl bg-slate-900/60 border border-white/5 animate-pulse" />
              ))
            : items.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p)}
                  className="p-3 glass-card rounded-2xl border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 flex flex-col items-center justify-center text-center group transition-all"
                >
                  <span className="font-mono text-[10px] text-cyan-400 font-bold self-start">
                    #{String(p.id).padStart(4, '0')}
                  </span>
                  <img
                    src={p.image}
                    alt={p.displayName}
                    className="w-16 h-16 object-contain my-1 group-hover:scale-110 transition-transform"
                  />
                  <span className="text-xs font-extrabold uppercase text-white group-hover:text-cyan-400 truncate w-full">
                    {p.displayName}
                  </span>
                  <div className="flex gap-1 mt-1">
                    {p.types.map((t) => (
                      <TypeBadge key={t.name} type={t.name} size="sm" />
                    ))}
                  </div>
                </button>
              ))}

          {!loading && items.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 font-mono text-sm">
              No Pokémon found matching "{search}". Try another search term or filter.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
