import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, Compass, Shield, Scale, Heart, Menu, X, Cpu } from 'lucide-react';
import { useTeamStore } from '../../store/useTeamStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const team = useTeamStore((state) => state.team);
  const favorites = useFavoritesStore((state) => state.favorites);

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/pokedex', label: 'Pokédex', icon: Compass },
    { to: '/team', label: 'Team Builder', icon: Shield, badge: team.length > 0 ? `${team.length}/6` : null },
    { to: '/compare', label: 'Compare', icon: Scale },
    { to: '/favorites', label: 'Favorites', icon: Heart, badge: favorites.length > 0 ? favorites.length : null },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/5 backdrop-blur-md bg-slate-950/70 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Text Branding */}
          <Link to="/" className="flex items-center group">
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter uppercase text-white flex items-center gap-1">
                Atlas <span className="text-cyan-400">3D</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase -mt-1">
                Holographic Lab
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 relative ${
                      isActive
                        ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] border border-cyan-500/30 font-mono">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* System Status Indicator & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono uppercase text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>GEN IX ONLINE</span>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={navLinks}
      />
    </>
  );
}
