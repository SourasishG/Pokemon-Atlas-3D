import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import PokemonCard from '@/src/components/pokemon/PokemonCard';
import SearchBar from '@/src/components/pokemon/SearchBar';
import FilterBar from '@/src/components/pokemon/FilterBar';
import Navbar from '@/src/components/layout/Navbar';

describe('Accessibility (a11y) Automated Tests with jest-axe', () => {
  const mockPokemon = {
    id: 25,
    name: 'pikachu',
    displayName: 'Pikachu',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    types: [{ name: 'electric' }],
    stats: [{ name: 'speed', value: 90 }],
    totalStats: 320,
  };

  it('PokemonCard component has no accessibility violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <PokemonCard pokemon={mockPokemon} />
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('SearchBar component has no accessibility violations', async () => {
    const { container } = render(<SearchBar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('FilterBar component has no accessibility violations', async () => {
    const { container } = render(<FilterBar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Navbar component has no accessibility violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
