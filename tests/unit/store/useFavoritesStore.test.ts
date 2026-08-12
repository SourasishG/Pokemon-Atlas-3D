import { describe, it, expect, beforeEach } from 'vitest';
import { useFavoritesStore } from '@/src/store/useFavoritesStore';

describe('useFavoritesStore', () => {
  const mockPikachu = {
    id: 25,
    name: 'pikachu',
    displayName: 'Pikachu',
  };

  const mockBulbasaur = {
    id: 1,
    name: 'bulbasaur',
    displayName: 'Bulbasaur',
  };

  beforeEach(() => {
    useFavoritesStore.getState().clearFavorites();
  });

  it('starts with an empty favorites array', () => {
    expect(useFavoritesStore.getState().favorites).toEqual([]);
    expect(useFavoritesStore.getState().isFavorite(25)).toBe(false);
  });

  it('toggles a Pokémon into favorites', () => {
    useFavoritesStore.getState().toggleFavorite(mockPikachu);
    expect(useFavoritesStore.getState().favorites.length).toBe(1);
    expect(useFavoritesStore.getState().isFavorite(25)).toBe(true);
  });

  it('removes a Pokémon when toggled again', () => {
    useFavoritesStore.getState().toggleFavorite(mockPikachu);
    useFavoritesStore.getState().toggleFavorite(mockPikachu);
    expect(useFavoritesStore.getState().favorites.length).toBe(0);
    expect(useFavoritesStore.getState().isFavorite(25)).toBe(false);
  });

  it('removes a favorite explicitly by ID', () => {
    useFavoritesStore.getState().toggleFavorite(mockPikachu);
    useFavoritesStore.getState().toggleFavorite(mockBulbasaur);
    expect(useFavoritesStore.getState().favorites.length).toBe(2);

    useFavoritesStore.getState().removeFavorite(25);
    expect(useFavoritesStore.getState().favorites.length).toBe(1);
    expect(useFavoritesStore.getState().isFavorite(25)).toBe(false);
    expect(useFavoritesStore.getState().isFavorite(1)).toBe(true);
  });

  it('clears all favorites', () => {
    useFavoritesStore.getState().toggleFavorite(mockPikachu);
    useFavoritesStore.getState().toggleFavorite(mockBulbasaur);
    useFavoritesStore.getState().clearFavorites();
    expect(useFavoritesStore.getState().favorites).toEqual([]);
  });
});
