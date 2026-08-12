import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import PokemonCard from '@/src/components/pokemon/PokemonCard';
import { useFavoritesStore } from '@/src/store/useFavoritesStore';
import { useTeamStore } from '@/src/store/useTeamStore';

describe('PokemonCard component', () => {
  const mockPokemon = {
    id: 25,
    name: 'pikachu',
    displayName: 'Pikachu',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    types: [{ name: 'electric' }],
    stats: [
      { name: 'speed', value: 90 },
    ],
    totalStats: 320,
  };

  beforeEach(() => {
    useFavoritesStore.getState().clearFavorites();
    useTeamStore.getState().clearTeam();
  });

  it('renders name, formatted ID, alt text, and type badge', () => {
    render(
      <MemoryRouter>
        <PokemonCard pokemon={mockPokemon} />
      </MemoryRouter>
    );

    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('#0025')).toBeInTheDocument();
    
    const img = screen.getByAltText('Pikachu');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockPokemon.image);

    expect(screen.getByText(/electric/i)).toBeInTheDocument();
  });

  it('toggles favorite state when heart button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <PokemonCard pokemon={mockPokemon} />
      </MemoryRouter>
    );

    const favoriteButton = screen.getByTitle('Save Favorite');
    expect(favoriteButton).toBeInTheDocument();

    await user.click(favoriteButton);
    expect(useFavoritesStore.getState().isFavorite(25)).toBe(true);

    const removeFavoriteButton = screen.getByTitle('Remove Favorite');
    expect(removeFavoriteButton).toBeInTheDocument();
  });

  it('adds Pokémon to team when plus button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <PokemonCard pokemon={mockPokemon} />
      </MemoryRouter>
    );

    const teamButton = screen.getByTitle('Add to Team');
    await user.click(teamButton);

    expect(useTeamStore.getState().isInTeam(25)).toBe(true);
    expect(screen.getByTitle('In Team')).toBeInTheDocument();
  });

  it('links to the detailed Pokémon page', () => {
    render(
      <MemoryRouter>
        <PokemonCard pokemon={mockPokemon} />
      </MemoryRouter>
    );

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/pokemon/pikachu');
  });
});
