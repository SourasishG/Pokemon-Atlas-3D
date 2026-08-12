import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Heart,
  Plus,
  Scale,
  ArrowLeft,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Check,
  Info,
  Swords,
} from 'lucide-react';
import PokemonViewer from '../components/three/PokemonViewer';
import TypeBadge from '../components/pokemon/TypeBadge';
import StatBar from '../components/pokemon/StatBar';
import EvolutionChain from '../components/pokemon/EvolutionChain';
import { getPokemonFullDetails } from '../services/pokeapi';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useTeamStore } from '../store/useTeamStore';
import { useCompareStore } from '../store/useCompareStore';
import { usePokemonStore } from '../store/usePokemonStore';
import { getWeaknessSummary } from '../utils/typeEffectiveness';

export default function PokemonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isShiny, setIsShiny] = useState(false);

  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { isInTeam, addToTeam } = useTeamStore();
  const { setSlotA, setSlotB } = useCompareStore();
  const { showToast } = usePokemonStore();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setPokemon(null);

    getPokemonFullDetails(id)
      .then((data) => {
        if (isMounted) {
          setPokemon(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching pokemon detail:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">
          Synthesizing Holographic Hologram Matrix for #{id}...
        </span>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="py-20 text-center space-y-4 glass-panel rounded-3xl border border-rose-500/30">
        <h2 className="text-2xl font-black uppercase text-rose-400">Pokémon Record Not Found</h2>
        <p className="text-sm font-mono text-slate-300">
          No species records found matching query "{id}".
        </p>
        <Link
          to="/pokedex"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-extrabold text-xs uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Pokédex</span>
        </Link>
      </div>
    );
  }

  const favorited = isFavorite(pokemon.id);
  const inTeam = isInTeam(pokemon.id);
  const weaknesses = getWeaknessSummary(pokemon.types);

  const handleFavoriteClick = () => {
    toggleFavorite(pokemon);
    showToast(
      favorited ? `Removed ${pokemon.displayName} from Favorites` : `Added ${pokemon.displayName} to Favorites`,
      favorited ? 'info' : 'success'
    );
  };

  const handleTeamClick = () => {
    if (inTeam) {
      showToast(`${pokemon.displayName} is already in your team`, 'info');
      return;
    }
    const res = addToTeam(pokemon);
    showToast(res.message, res.success ? 'success' : 'error');
  };

  const handleCompareClick = () => {
    setSlotA(pokemon);
    showToast(`Set ${pokemon.displayName} as Slot A in Compare!`, 'success');
    navigate('/compare');
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Top Back Navigation & Main Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono font-bold uppercase text-slate-300 hover:text-cyan-400 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleFavoriteClick}
            className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-bold uppercase flex items-center gap-2 transition-all ${
              favorited
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                : 'bg-slate-900 text-slate-300 border-white/10 hover:text-rose-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-400' : ''}`} />
            <span>{favorited ? 'Favorited' : 'Favorite'}</span>
          </button>

          <button
            onClick={handleTeamClick}
            className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-extrabold uppercase flex items-center gap-2 transition-all ${
              inTeam
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-cyan-500 text-slate-950 border-cyan-400 hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
            }`}
          >
            {inTeam ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{inTeam ? 'In Team' : 'Add to Team'}</span>
          </button>

          <button
            onClick={handleCompareClick}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono font-bold uppercase text-slate-300 hover:text-cyan-400 flex items-center gap-2 transition-colors"
          >
            <Scale className="w-4 h-4 text-cyan-400" />
            <span>Compare</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 3D Stage + Overview Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 3D Interactive Stage */}
        <div className="lg:col-span-6 space-y-4">
          <PokemonViewer
            pokemon={pokemon}
            isShiny={isShiny}
            onToggleShiny={() => setIsShiny(!isShiny)}
          />

          {/* Dimension Details Banner */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/80 border border-white/10 font-mono text-center">
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Height</span>
              <span className="text-base font-extrabold text-white">{pokemon.height} m</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Weight</span>
              <span className="text-base font-extrabold text-white">{pokemon.weight} kg</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Base Stat Total</span>
              <span className="text-base font-black text-cyan-400">{pokemon.totalStats} BST</span>
            </div>
          </div>
        </div>

        {/* Right Details: Species Header, Bio, Stats */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-extrabold text-cyan-400 tracking-widest">
                #{String(pokemon.id).padStart(4, '0')}
              </span>
              <div className="flex gap-1.5">
                {pokemon.types.map((t) => (
                  <TypeBadge key={t.name} type={t.name} size="md" />
                ))}
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black uppercase text-white tracking-tight">
              {pokemon.displayName}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-mono bg-slate-950/40 p-4 rounded-2xl border border-white/5">
              "{pokemon.flavorText}"
            </p>
          </div>

          {/* Base Stats Matrix */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Base Stat Benchmark Matrix</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">MAX: 255</span>
            </div>

            <div className="space-y-3">
              {pokemon.stats.map((s) => (
                <StatBar
                  key={s.name}
                  label={s.label}
                  value={s.value}
                  max={s.max}
                  color={s.color}
                />
              ))}
            </div>
          </div>

          {/* Abilities & Moves */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Abilities */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-cyan-400 block">
                Abilities
              </span>
              <ul className="space-y-1.5 font-mono text-xs">
                {pokemon.abilities.map((a, idx) => (
                  <li key={idx} className="flex items-center justify-between text-slate-200 uppercase font-bold">
                    <span>{a.name}</span>
                    {a.isHidden && (
                      <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-normal">
                        Hidden
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Top Moves */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-cyan-400 block">
                Combat Moves Sample
              </span>
              <div className="flex flex-wrap gap-1.5">
                {pokemon.moves.map((m, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 border border-white/5 text-[10px] font-mono uppercase text-slate-300"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evolution Chain Section */}
      <EvolutionChain chain={pokemon.evolutionChain} currentPokemonId={pokemon.id} />

      {/* Defensive Type Matchup Vulnerability Breakdown */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Defensive Type Matchups & Resistances</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Weaknesses */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
            <span className="text-xs font-mono uppercase text-amber-300 font-extrabold block">
              Vulnerable To (2x / 4x Damage)
            </span>
            <div className="flex flex-wrap gap-2">
              {[...weaknesses.weak4x, ...weaknesses.weak2x].map((t) => (
                <div key={t} className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl">
                  <TypeBadge type={t} size="sm" />
                  {weaknesses.weak4x.includes(t) && (
                    <span className="text-[10px] font-mono text-amber-400 font-black px-1">4x</span>
                  )}
                </div>
              ))}
              {weaknesses.weak4x.length === 0 && weaknesses.weak2x.length === 0 && (
                <span className="text-xs font-mono text-slate-400">None</span>
              )}
            </div>
          </div>

          {/* Resistances */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
            <span className="text-xs font-mono uppercase text-emerald-300 font-extrabold block">
              Resistant To (0.5x / 0.25x Damage)
            </span>
            <div className="flex flex-wrap gap-2">
              {[...weaknesses.resistantQuarter, ...weaknesses.resistantHalf].map((t) => (
                <div key={t} className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl">
                  <TypeBadge type={t} size="sm" />
                  {weaknesses.resistantQuarter.includes(t) && (
                    <span className="text-[10px] font-mono text-emerald-400 font-black px-1">1/4</span>
                  )}
                </div>
              ))}
              {weaknesses.resistantQuarter.length === 0 && weaknesses.resistantHalf.length === 0 && (
                <span className="text-xs font-mono text-slate-400">None</span>
              )}
            </div>
          </div>

          {/* Immunities */}
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-3">
            <span className="text-xs font-mono uppercase text-cyan-300 font-extrabold block">
              Immune To (0x Damage)
            </span>
            <div className="flex flex-wrap gap-2">
              {weaknesses.immune.map((t) => (
                <TypeBadge key={t} type={t} size="sm" />
              ))}
              {weaknesses.immune.length === 0 && (
                <span className="text-xs font-mono text-slate-400">No complete immunities</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
