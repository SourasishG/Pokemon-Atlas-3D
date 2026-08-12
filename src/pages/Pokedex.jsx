import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, RefreshCw, Layers } from 'lucide-react';
import SearchBar from '../components/pokemon/SearchBar';
import FilterBar from '../components/pokemon/FilterBar';
import PokemonGrid from '../components/pokemon/PokemonGrid';
import QuickViewModal from '../components/pokemon/QuickViewModal';
import { usePokemonStore } from '../store/usePokemonStore';
import { getPokemonList } from '../services/pokeapi';

export default function Pokedex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('search') || '';

  const {
    searchQuery,
    setSearchQuery,
    selectedType,
    selectedGen,
    sortBy,
    viewMode,
    pageOffset,
    setPageOffset,
  } = usePokemonStore();

  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync URL search param if present on mount
  useEffect(() => {
    if (initialQuery && initialQuery !== searchQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  // Fetch list on filter or page change
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      getPokemonList({
        limit: 24,
        offset: pageOffset,
        search: searchQuery,
        type: selectedType,
        generation: selectedGen,
        signal: controller.signal,
      })
        .then((res) => {
          if (res && res.items) {
            setItems(res.items);
            setTotalCount(res.totalCount || 0);
            setHasMore(res.hasMore || false);
          }
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            console.error('Error in Pokedex fetch:', err);
            setError('Failed to fetch Pokémon directory. Please try again.');
          }
        })
        .finally(() => setLoading(false));
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery, selectedType, selectedGen, pageOffset]);

  // Client-side sorting
  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === 'id-asc') return a.id - b.id;
    if (sortBy === 'id-desc') return b.id - a.id;
    if (sortBy === 'name-asc') return a.displayName.localeCompare(b.displayName);
    if (sortBy === 'stat-desc') return b.totalStats - a.totalStats;
    return 0;
  });

  const handleNextPage = () => {
    setPageOffset(pageOffset + 24);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    setPageOffset(Math.max(0, pageOffset - 24));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
            <Compass className="w-4 h-4" />
            <span>Holographic Species Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
            Pokédex Explorer
          </h1>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 border border-white/10 text-xs font-mono">
          <span className="text-slate-400">INDEXED:</span>
          <strong className="text-cyan-400 font-bold">{totalCount} Pokémon</strong>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-4">
        <SearchBar />
        <FilterBar />
      </div>

      {/* Main Grid / Loading / Empty */}
      {error ? (
        <div className="p-8 rounded-3xl glass-panel border border-rose-500/30 text-center space-y-4">
          <p className="text-rose-400 font-mono text-sm">{error}</p>
          <button
            onClick={() => setPageOffset(0)}
            className="px-4 py-2 rounded-xl bg-slate-900 text-cyan-400 font-mono text-xs font-bold uppercase border border-cyan-500/40"
          >
            Retry Fetch
          </button>
        </div>
      ) : (
        <PokemonGrid items={sortedItems} isLoading={loading} viewMode={viewMode} />
      )}

      {/* Pagination Bar */}
      {!loading && totalCount > 24 && (
        <div className="flex items-center justify-between pt-8 border-t border-white/10 font-mono text-xs">
          <button
            onClick={handlePrevPage}
            disabled={pageOffset === 0}
            className="px-5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 disabled:opacity-30 disabled:pointer-events-none hover:text-cyan-400 hover:border-cyan-500/40 transition-colors uppercase font-bold"
          >
            Previous 24
          </button>

          <span className="text-slate-400">
            Page {Math.floor(pageOffset / 24) + 1} of {Math.ceil(totalCount / 24)}
          </span>

          <button
            onClick={handleNextPage}
            disabled={!hasMore}
            className="px-5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 disabled:opacity-30 disabled:pointer-events-none hover:text-cyan-400 hover:border-cyan-500/40 transition-colors uppercase font-bold"
          >
            Next 24
          </button>
        </div>
      )}

      {/* Quick View Inspection Modal */}
      <QuickViewModal />
    </div>
  );
}
