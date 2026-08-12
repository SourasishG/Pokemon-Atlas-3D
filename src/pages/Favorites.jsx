import React, { useState } from 'react';
import { Heart, Trash2, Search, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import PokemonCard from '../components/pokemon/PokemonCard';
import EmptyState from '../components/common/EmptyState';
import TypeBadge from '../components/pokemon/TypeBadge';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { usePokemonStore } from '../store/usePokemonStore';
import { POKEMON_TYPES } from '../constants/pokemonConstants';

export default function Favorites() {
  const { favorites, clearFavorites } = useFavoritesStore();
  const { showToast } = usePokemonStore();

  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const filteredFavorites = favorites.filter((p) => {
    const matchesQuery =
      !query ||
      p.displayName.toLowerCase().includes(query.toLowerCase()) ||
      String(p.id) === query.trim();
    const matchesType =
      selectedType === 'all' || p.types.some((t) => t.name === selectedType);
    return matchesQuery && matchesType;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase">
            <Heart className="w-4 h-4 fill-rose-400" />
            <span>Saved Species Vault</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
            Favorites ({favorites.length})
          </h1>
        </div>

        {favorites.length > 0 && (
          <button
            onClick={() => {
              clearFavorites();
              showToast('Cleared all favorites', 'info');
            }}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold uppercase hover:bg-rose-500/20 transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Favorites</span>
          </button>
        )}
      </div>

      {favorites.length > 0 ? (
        <>
          {/* Search & Filter Controls for Favorites */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search saved favorites..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50"
              />
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

          {/* Grid */}
          {filteredFavorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredFavorites.map((p) => (
                <PokemonCard key={p.id} pokemon={p} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 font-mono text-sm glass-panel rounded-3xl border border-white/10">
              No saved favorites match search query "{query}".
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No Favorites Saved Yet"
          description="Browse the Pokédex and click the heart icon on any Pokémon card or detail page to save it to your personal vault."
          icon={Heart}
          actionLabel="Explore Pokédex"
          onAction={() => {}}
        />
      )}
    </div>
  );
}
