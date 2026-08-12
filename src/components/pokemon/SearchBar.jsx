import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { usePokemonStore } from '../../store/usePokemonStore';

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = usePokemonStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Debounce user typing by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(localQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [localQuery, setSearchQuery]);

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
        <Search className="w-5 h-5 text-cyan-400" />
      </div>

      <input
        type="text"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        placeholder="Search Pokémon by name or Pokédex number (e.g. Charizard, 25)..."
        className="w-full pl-12 pr-10 py-3.5 bg-slate-900/60 border border-white/10 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/60 backdrop-blur-xl transition-all text-sm font-medium"
      />

      {localQuery && (
        <button
          onClick={() => {
            setLocalQuery('');
            setSearchQuery('');
          }}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-cyan-400 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
