import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, Cpu, Github, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-slate-950/80 backdrop-blur-xl relative z-10 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-cyan-500 flex items-center justify-center relative shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                <div className="w-full h-[1px] bg-cyan-500 absolute" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-cyan-400 z-10" />
              </div>
              <span className="text-lg font-black tracking-tighter uppercase text-white">
                Pokémon Atlas <span className="text-cyan-400">3D</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              A high-fidelity 3D Pokémon exploration, comparison, and competitive team analysis platform powered by PokéAPI and WebGL.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>SYSTEM STATUS: ALL LAB NODES FUNCTIONAL</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-4 font-mono">
              Atlas Modules
            </h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home Landing</Link>
              </li>
              <li>
                <Link to="/pokedex" className="hover:text-white transition-colors">Pokédex Explorer</Link>
              </li>
              <li>
                <Link to="/team" className="hover:text-white transition-colors">Team Analyzer</Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-white transition-colors">Comparison Lab</Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-white transition-colors">Saved Favorites</Link>
              </li>
            </ul>
          </div>

          {/* Technology Stack Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-4 font-mono">
              Core Tech Stack
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-mono">
              <li>• React 19 & Vite 6</li>
              <li>• React Three Fiber & Drei</li>
              <li>• Zustand State Manager</li>
              <li>• PokéAPI v2 REST Engine</li>
              <li>• Tailwind CSS & Glassmorphism</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Pokémon Atlas 3D. Pokémon and Pokémon character names are trademarks of Nintendo.</p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase text-slate-400">COORD: 45.32 // -122.9</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
