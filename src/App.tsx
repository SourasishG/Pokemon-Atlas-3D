import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Toast from './components/common/Toast';

// Code-split pages for high performance and reduced initial bundle weight
const Home = lazy(() => import('./pages/Home'));
const Pokedex = lazy(() => import('./pages/Pokedex'));
const PokemonDetail = lazy(() => import('./pages/PokemonDetail'));
const TeamBuilder = lazy(() => import('./pages/TeamBuilder'));
const Compare = lazy(() => import('./pages/Compare'));
const Favorites = lazy(() => import('./pages/Favorites'));

function RouteLoadingFallback() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
      <div className="relative w-14 h-14 flex items-center justify-center">
        <div className="w-14 h-14 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
        <div className="w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-400/40 animate-pulse absolute" />
      </div>
      <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 uppercase tracking-widest font-bold">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>Synthesizing Holographic Matrix...</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pokedex" element={<Pokedex />} />
              <Route path="/explorer" element={<Navigate to="/pokedex" replace />} />
              <Route path="/pokemon/:id" element={<PokemonDetail />} />
              <Route path="/pokedex/:id" element={<PokemonDetail />} />
              <Route path="/team" element={<TeamBuilder />} />
              <Route path="/team-builder" element={<Navigate to="/team" replace />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
        <Toast />
      </div>
    </BrowserRouter>
  );
}
