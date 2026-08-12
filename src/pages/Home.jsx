import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Compass,
  Shield,
  Scale,
  Sparkles,
  Search,
  ArrowRight,
  Cpu,
  Layers,
  Database,
  Flame,
  Zap,
} from 'lucide-react';
import HeroBallScene from '../components/three/HeroBallScene';
import PokemonCard from '../components/pokemon/PokemonCard';
import SkeletonCard from '../components/common/SkeletonCard';
import { getPokemon } from '../services/pokeapi';

const FEATURED_NAMES = ['rayquaza', 'mewtwo', 'lucario', 'charizard', 'gengar', 'greninja'];

export default function Home() {
  const [quickQuery, setQuickQuery] = useState('');
  const [featuredList, setFeaturedList] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    setLoadingFeatured(true);

    Promise.all(FEATURED_NAMES.map((name) => getPokemon(name)))
      .then((results) => {
        if (isMounted) {
          setFeaturedList(results.filter(Boolean));
          setLoadingFeatured(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching featured pokemon:', err);
        if (isMounted) setLoadingFeatured(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleQuickSearchSubmit = (e) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      navigate(`/pokedex?search=${encodeURIComponent(quickQuery.trim())}`);
    } else {
      navigate('/pokedex');
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl glass-panel border border-white/10 p-6 sm:p-12 md:p-16">
        {/* Glow Effects */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-500/20 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-600/20 blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Text & Search */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Next-Gen Holographic Explorer</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-tight">
              Pokémon Atlas <span className="text-cyan-400">3D</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              An immersive 3D web experience to inspect Pokémon species, run competitive squad synergy analytics, compare dual specs, and discover evolution chains in real-time.
            </p>

            {/* Quick Search Form */}
            <form onSubmit={handleQuickSearchSubmit} className="relative max-w-lg">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Search any species by name or #ID (e.g., Lucario)..."
                className="w-full pl-12 pr-32 py-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              >
                Explore
              </button>
            </form>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/pokedex"
                className="px-6 py-3.5 rounded-2xl bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-cyan-400 transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)]"
              >
                <Compass className="w-4 h-4" />
                <span>Launch Pokédex</span>
              </Link>
              <Link
                to="/team"
                className="px-6 py-3.5 rounded-2xl bg-slate-900 border border-white/10 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-white/5 hover:border-cyan-500/40 transition-all"
              >
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>Team Builder</span>
              </Link>
              <Link
                to="/compare"
                className="px-6 py-3.5 rounded-2xl bg-slate-900 border border-white/10 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-white/5 hover:border-cyan-500/40 transition-all"
              >
                <Scale className="w-4 h-4 text-cyan-400" />
                <span>Compare Specs</span>
              </Link>
            </div>
          </div>

          {/* Right 3D Pokéball Scene */}
          <div className="lg:col-span-5 h-[340px] sm:h-[420px] relative">
            <HeroBallScene />
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Indexed Species', val: '1,025+', sub: 'Gen I - Gen IX Directory', icon: Database },
          { label: 'Type Effectiveness', val: '18 Types', sub: 'Calculated Matrix Logic', icon: Flame },
          { label: '3D Rendering', val: 'Real-Time', sub: 'WebGL Holo Projections', icon: Cpu },
          { label: 'Team Analytics', val: '6 Slots', sub: 'Weakness & BST Coverage', icon: Shield },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl glass-card border border-white/10 space-y-2 hover:border-cyan-500/40 transition-all"
            >
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">{item.val}</div>
              <div>
                <div className="text-xs font-mono font-bold text-cyan-400 uppercase">{item.label}</div>
                <div className="text-[11px] text-slate-400 font-mono">{item.sub}</div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Featured Legendary & Icon Spotlight */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
              <Zap className="w-4 h-4" />
              <span>Iconic Holograms</span>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white mt-1">
              Featured Species Spotlight
            </h2>
          </div>
          <Link
            to="/pokedex"
            className="text-xs font-mono font-bold uppercase text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
          >
            <span>View All 1,025 Pokémon</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingFeatured
            ? Array.from({ length: 6 }).map((_, idx) => <SkeletonCard key={idx} />)
            : featuredList.map((p) => <PokemonCard key={p.id} pokemon={p} />)}
        </div>
      </section>

      {/* Core Platform Capabilities */}
      <section className="space-y-8 glass-panel rounded-3xl border border-white/10 p-8 sm:p-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
            Platform Capabilities
          </span>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">
            Designed for Pokémon Researchers & Competitors
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: '3D Holographic Viewer',
              desc: 'Inspect high-definition models in 3D space with smooth orbit controls, lighting filters, and interactive Shiny transformations.',
              icon: Cpu,
              link: '/pokedex',
              btn: 'Launch 3D Lab',
            },
            {
              title: 'Competitive Squad Matrix',
              desc: 'Assemble 6-Pokémon squads with automated type vulnerability alerts, speed tier rankings, and exportable JSON format.',
              icon: Shield,
              link: '/team',
              btn: 'Build Team',
            },
            {
              title: 'Dual Spec Benchmarking',
              desc: 'Compare any two Pokémon side-by-side with stat winner badges, total BST indicators, height/weight dimensions, and move sets.',
              icon: Scale,
              link: '/compare',
              btn: 'Compare Specs',
            },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-900/60 border border-white/5 space-y-4 flex flex-col justify-between hover:border-cyan-500/40 transition-all"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-extrabold uppercase text-white">{feature.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono">{feature.desc}</p>
                </div>

                <Link
                  to={feature.link}
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-cyan-400 hover:text-cyan-300 pt-2"
                >
                  <span>{feature.btn}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
