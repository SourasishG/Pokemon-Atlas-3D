import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Toast from './components/common/Toast';
import Home from './pages/Home';
import Pokedex from './pages/Pokedex';
import PokemonDetail from './pages/PokemonDetail';
import TeamBuilder from './pages/TeamBuilder';
import Compare from './pages/Compare';
import Favorites from './pages/Favorites';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pokedex" element={<Pokedex />} />
            <Route path="/pokemon/:id" element={<PokemonDetail />} />
            <Route path="/pokedex/:id" element={<PokemonDetail />} />
            <Route path="/team" element={<TeamBuilder />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
        <Toast />
      </div>
    </BrowserRouter>
  );
}
