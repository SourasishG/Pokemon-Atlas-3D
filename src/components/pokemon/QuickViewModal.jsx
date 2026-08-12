import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, ExternalLink, Check } from 'lucide-react';
import Modal from '../common/Modal';
import TypeBadge from './TypeBadge';
import StatBar from './StatBar';
import { usePokemonStore } from '../../store/usePokemonStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useTeamStore } from '../../store/useTeamStore';

export default function QuickViewModal() {
  const { quickViewPokemon, setQuickViewPokemon, showToast } = usePokemonStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { isInTeam, addToTeam } = useTeamStore();

  if (!quickViewPokemon) return null;

  const favorited = isFavorite(quickViewPokemon.id);
  const inTeam = isInTeam(quickViewPokemon.id);

  const handleFavorite = () => {
    toggleFavorite(quickViewPokemon);
    showToast(favorited ? 'Removed from favorites' : 'Added to favorites', 'info');
  };

  const handleTeam = () => {
    if (inTeam) return;
    const res = addToTeam(quickViewPokemon);
    showToast(res.message, res.success ? 'success' : 'error');
  };

  return (
    <Modal
      isOpen={!!quickViewPokemon}
      onClose={() => setQuickViewPokemon(null)}
      title={`${quickViewPokemon.displayName} Quick Inspection`}
      maxWidth="max-w-3xl"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
        {/* Left Side: Artwork & Badges */}
        <div className="flex flex-col items-center justify-center p-6 glass-card rounded-2xl border border-white/10 relative overflow-hidden">
          <span className="absolute top-3 left-3 font-mono text-xs font-bold text-cyan-400">
            #{String(quickViewPokemon.id).padStart(4, '0')}
          </span>

          <img
            src={quickViewPokemon.image}
            alt={quickViewPokemon.displayName}
            className="w-48 h-48 object-contain drop-shadow-[0_10px_20px_rgba(6,182,212,0.3)] my-4"
          />

          <div className="flex gap-2">
            {quickViewPokemon.types.map((t) => (
              <TypeBadge key={t.name} type={t.name} size="md" />
            ))}
          </div>
        </div>

        {/* Right Side: Stats & Details */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              Base Stats Summary
            </h4>
            <div className="space-y-2">
              {quickViewPokemon.stats.slice(0, 4).map((s) => (
                <StatBar key={s.name} label={s.label} value={s.value} max={s.max} color={s.color} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-white/10 text-slate-300">
            <div>Height: <strong className="text-white">{quickViewPokemon.height} m</strong></div>
            <div>Weight: <strong className="text-white">{quickViewPokemon.weight} kg</strong></div>
            <div>Total BST: <strong className="text-cyan-400">{quickViewPokemon.totalStats}</strong></div>
            <div>Abilities: <strong className="text-white">{quickViewPokemon.abilities.map(a => a.name).join(', ')}</strong></div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center gap-2 pt-4">
            <button
              onClick={handleFavorite}
              className={`px-4 py-2.5 rounded-xl border text-xs font-mono uppercase font-bold flex items-center gap-2 transition-all ${
                favorited
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-slate-900/60 text-slate-300 border-white/10 hover:text-rose-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-400' : ''}`} />
              {favorited ? 'Favorited' : 'Favorite'}
            </button>

            <button
              onClick={handleTeam}
              className={`px-4 py-2.5 rounded-xl border text-xs font-mono uppercase font-bold flex items-center gap-2 transition-all ${
                inTeam
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-cyan-500 text-slate-950 font-extrabold border-cyan-400 hover:bg-cyan-400'
              }`}
            >
              {inTeam ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {inTeam ? 'In Team' : 'Add to Team'}
            </button>

            <Link
              to={`/pokemon/${quickViewPokemon.name}`}
              onClick={() => setQuickViewPokemon(null)}
              className="ml-auto p-2.5 rounded-xl bg-slate-900 border border-white/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
              title="Open 3D Detail Page"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
