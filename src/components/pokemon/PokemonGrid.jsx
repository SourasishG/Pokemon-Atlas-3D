import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import PokemonCard from './PokemonCard';
import TypeBadge from './TypeBadge';
import { SkeletonGrid } from '../common/SkeletonCard';
import { Link } from 'react-router-dom';
import { Heart, Plus, Eye, Check } from 'lucide-react';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useTeamStore } from '../../store/useTeamStore';
import { usePokemonStore } from '../../store/usePokemonStore';

export default function PokemonGrid({ items, isLoading, viewMode = 'grid' }) {
  if (isLoading) {
    return <SkeletonGrid count={24} />;
  }

  if (!items || items.length === 0) {
    return (
      <div className="py-16 text-center space-y-3 glass-panel rounded-3xl border border-white/10">
        <p className="text-slate-400 font-mono text-sm">No Pokémon matches the current search and filter parameters.</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return <ListView items={items} />;
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <AnimatePresence mode="popLayout">
        {items.map((pokemon, index) => (
          <motion.div
            key={pokemon.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.3) }}
          >
            <PokemonCard pokemon={pokemon} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

function ListView({ items }) {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { isInTeam, addToTeam } = useTeamStore();
  const { showToast, setQuickViewPokemon } = usePokemonStore();

  return (
    <div className="space-y-3">
      {items.map((pokemon) => {
        const favorited = isFavorite(pokemon.id);
        const inTeam = isInTeam(pokemon.id);
        const formattedId = `#${String(pokemon.id).padStart(4, '0')}`;

        return (
          <motion.div
            key={pokemon.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-cyan-500/40 transition-all"
          >
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs font-bold text-cyan-400 min-w-[50px]">
                {formattedId}
              </span>

              <img
                src={pokemon.image}
                alt={pokemon.displayName}
                className="w-12 h-12 object-contain"
                loading="lazy"
              />

              <div>
                <Link
                  to={`/pokemon/${pokemon.name}`}
                  className="text-base font-bold uppercase text-white hover:text-cyan-400 transition-colors"
                >
                  {pokemon.displayName}
                </Link>
                <div className="flex gap-1.5 mt-1">
                  {pokemon.types.map((t) => (
                    <TypeBadge key={t.name} type={t.name} size="sm" />
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-6 font-mono text-xs text-slate-300">
              <div>BST: <strong className="text-cyan-400">{pokemon.totalStats}</strong></div>
              <div>SPD: <strong className="text-yellow-400">{pokemon.stats.find(s => s.name === 'speed')?.value || 0}</strong></div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  toggleFavorite(pokemon);
                  showToast(
                    favorited ? `Removed ${pokemon.displayName}` : `Favorited ${pokemon.displayName}`,
                    'info'
                  );
                }}
                className={`p-2 rounded-xl backdrop-blur-md transition-colors ${
                  favorited ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-900/60 text-slate-400 hover:text-rose-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-400' : ''}`} />
              </button>
              <button
                onClick={() => {
                  if (inTeam) return;
                  const res = addToTeam(pokemon);
                  showToast(res.message, res.success ? 'success' : 'error');
                }}
                className={`p-2 rounded-xl backdrop-blur-md transition-colors ${
                  inTeam ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-900/60 text-slate-400 hover:text-cyan-400'
                }`}
              >
                {inTeam ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setQuickViewPokemon(pokemon)}
                className="p-2 rounded-xl bg-slate-900/60 text-slate-400 hover:text-cyan-400"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
