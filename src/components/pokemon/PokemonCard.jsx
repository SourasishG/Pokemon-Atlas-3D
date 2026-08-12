import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, Plus, Eye, Check } from 'lucide-react';
import TypeBadge from './TypeBadge';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useTeamStore } from '../../store/useTeamStore';
import { usePokemonStore } from '../../store/usePokemonStore';
import { getTypeColor } from '../../utils/typeColors';

export default function PokemonCard({ pokemon }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!pokemon) return null;

  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { isInTeam, addToTeam } = useTeamStore();
  const { showToast, setQuickViewPokemon } = usePokemonStore();

  const favorited = isFavorite(pokemon.id);
  const inTeam = isInTeam(pokemon.id);
  const primaryType = pokemon.types[0]?.name || 'normal';
  const typeTheme = getTypeColor(primaryType);

  const formattedId = `#${String(pokemon.id).padStart(4, '0')}`;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(pokemon);
    showToast(
      favorited ? `Removed ${pokemon.displayName} from Favorites` : `Added ${pokemon.displayName} to Favorites`,
      favorited ? 'info' : 'success'
    );
  };

  const handleTeamClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inTeam) {
      showToast(`${pokemon.displayName} is already in your team`, 'info');
      return;
    }
    const result = addToTeam(pokemon);
    showToast(result.message, result.success ? 'success' : 'error');
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewPokemon(pokemon);
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-3xl p-5 glass-card flex flex-col justify-between h-[360px] overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[45px] opacity-20 group-hover:opacity-45 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: typeTheme.hex }}
      />

      {/* Top Bar: ID + Actions */}
      <div className="flex items-center justify-between z-10">
        <span className="font-mono text-xs font-bold tracking-widest text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded-full border border-cyan-500/20 shadow-inner">
          {formattedId}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
              favorited
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                : 'bg-slate-900/70 text-slate-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/30'
            }`}
            title={favorited ? 'Remove Favorite' : 'Save Favorite'}
          >
            <Heart className={`w-4 h-4 transition-transform group-active:scale-90 ${favorited ? 'fill-rose-400' : ''}`} />
          </button>
          <button
            onClick={handleTeamClick}
            className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
              inTeam
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900/70 text-slate-400 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/30'
            }`}
            title={inTeam ? 'In Team' : 'Add to Team'}
          >
            {inTeam ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
          <button
            onClick={handleQuickView}
            className="p-2 rounded-full bg-slate-900/70 text-slate-400 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/30 backdrop-blur-md transition-all duration-200"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Image Container */}
      <Link to={`/pokemon/${pokemon.name}`} className="relative my-2 flex items-center justify-center flex-1">
        <div className="w-32 h-32 relative flex items-center justify-center">
          {/* Subtle spinning ring behind pokemon */}
          <div
            className="absolute inset-0 rounded-full border border-dashed opacity-20 group-hover:opacity-50 animate-spin-slow transition-opacity duration-300 pointer-events-none"
            style={{ borderColor: typeTheme.hex }}
          />

          {!imageLoaded && (
            <div className="absolute w-24 h-24 rounded-full bg-slate-800/50 animate-pulse" />
          )}

          <img
            src={pokemon.image}
            alt={pokemon.displayName}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`w-28 h-28 object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-all duration-300 relative z-10 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          />
        </div>
      </Link>

      {/* Bottom Information */}
      <div className="z-10 space-y-3">
        <Link to={`/pokemon/${pokemon.name}`} className="block text-center">
          <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white group-hover:text-cyan-400 transition-colors">
            {pokemon.displayName}
          </h3>
        </Link>

        {/* Type Badges */}
        <div className="flex items-center justify-center gap-1.5">
          {pokemon.types.map((t) => (
            <TypeBadge key={t.name} type={t.name} size="sm" />
          ))}
        </div>

        {/* Stat Summary Meter */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono uppercase text-slate-400">
          <span>Total BST: <strong className="text-cyan-400 font-bold">{pokemon.totalStats}</strong></span>
          <span className="text-emerald-400 font-bold">SPD: {pokemon.stats.find(s => s.name === 'speed')?.value || 0}</span>
        </div>
      </div>
    </motion.div>
  );
}

