import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import QuickViewModal from '@/src/components/pokemon/QuickViewModal';
import { usePokemonStore } from '@/src/store/usePokemonStore';
import { useFavoritesStore } from '@/src/store/useFavoritesStore';
import { useTeamStore } from '@/src/store/useTeamStore';

describe('QuickViewModal component', () => {
  const mockPokemon = {
    id: 25,
    name: 'pikachu',
    displayName: 'Pikachu',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    types: [{ name: 'electric' }],
    stats: [
      { name: 'hp', label: 'HP', value: 35, max: 255, color: 'bg-emerald-500' },
      { name: 'attack', label: 'Attack', value: 55, max: 255, color: 'bg-amber-500' },
    ],
    totalStats: 320,
    height: 0.4,
    weight: 6.0,
    abilities: [{ name: 'static' }],
  };

  beforeEach(() => {
    usePokemonStore.setState({ quickViewPokemon: null });
    useFavoritesStore.getState().clearFavorites();
    useTeamStore.getState().clearTeam();
  });

  it('renders nothing when no quickViewPokemon is set', () => {
    const { container } = render(
      <MemoryRouter>
        <QuickViewModal />
      </MemoryRouter>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders modal details when quickViewPokemon is present', () => {
    usePokemonStore.setState({ quickViewPokemon: mockPokemon });

    render(
      <MemoryRouter>
        <QuickViewModal />
      </MemoryRouter>
    );

    expect(screen.getByText('Pikachu Quick Inspection')).toBeInTheDocument();
    expect(screen.getByText('0.4 m')).toBeInTheDocument();
    expect(screen.getByText('6 kg')).toBeInTheDocument();
    expect(screen.getByText('static')).toBeInTheDocument();
  });

  it('allows toggling favorite and adding to team from inside modal', async () => {
    const user = userEvent.setup();
    usePokemonStore.setState({ quickViewPokemon: mockPokemon });

    render(
      <MemoryRouter>
        <QuickViewModal />
      </MemoryRouter>
    );

    const favoriteBtn = screen.getByRole('button', { name: /favorite/i });
    await user.click(favoriteBtn);
    expect(useFavoritesStore.getState().isFavorite(25)).toBe(true);

    const teamBtn = screen.getByRole('button', { name: /add to team/i });
    await user.click(teamBtn);
    expect(useTeamStore.getState().isInTeam(25)).toBe(true);
  });
});
