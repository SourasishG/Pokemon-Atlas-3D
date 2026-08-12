import { create } from 'zustand';

export const usePokemonStore = create((set) => ({
  // Explorer filters
  searchQuery: '',
  selectedType: 'all',
  selectedGen: 'all',
  sortBy: 'id-asc', // 'id-asc', 'id-desc', 'name-asc', 'stat-desc'
  viewMode: 'grid', // 'grid' | 'list'
  pageOffset: 0,

  // Performance & Accessibility
  lowPerformanceMode: false,
  reducedMotion: false,

  // UI Toast
  toast: null,

  // Quick view modal target
  quickViewPokemon: null,

  // Actions
  setSearchQuery: (query) => set({ searchQuery: query, pageOffset: 0 }),
  setSelectedType: (type) => set({ selectedType: type, pageOffset: 0 }),
  setSelectedGen: (gen) => set({ selectedGen: gen, pageOffset: 0 }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setPageOffset: (offset) => set({ pageOffset: offset }),
  toggleLowPerformanceMode: () => set((state) => ({ lowPerformanceMode: !state.lowPerformanceMode })),
  toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),
  setQuickViewPokemon: (pokemon) => set({ quickViewPokemon: pokemon }),

  // Toast trigger
  showToast: (message, type = 'info') => {
    set({ toast: { message, type, id: Date.now() } });
    setTimeout(() => {
      set({ toast: null });
    }, 3200);
  },
}));
