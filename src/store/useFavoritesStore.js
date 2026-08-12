import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [], // Array of normalized pokemon objects

      isFavorite: (id) => {
        return get().favorites.some((item) => item.id === id);
      },

      toggleFavorite: (pokemon) => {
        if (!pokemon) return;
        const exists = get().isFavorite(pokemon.id);
        if (exists) {
          set((state) => ({
            favorites: state.favorites.filter((item) => item.id !== pokemon.id),
          }));
        } else {
          set((state) => ({
            favorites: [pokemon, ...state.favorites],
          }));
        }
      },

      removeFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.filter((item) => item.id !== id),
        }));
      },

      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: 'pokemon-atlas-favorites',
    }
  )
);
