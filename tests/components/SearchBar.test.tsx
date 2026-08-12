import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import SearchBar from '@/src/components/pokemon/SearchBar';
import { usePokemonStore } from '@/src/store/usePokemonStore';

describe('SearchBar component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    usePokemonStore.setState({ searchQuery: '' });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders search input field with placeholder', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search pokémon by name or pokédex number/i);
    expect(input).toBeInTheDocument();
  });

  it('updates local state on typing and debounces store update by 300ms', async () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search pokémon by name or pokédex number/i);

    fireEvent.change(input, { target: { value: 'pikachu' } });

    expect(usePokemonStore.getState().searchQuery).toBe('');

    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(usePokemonStore.getState().searchQuery).toBe('pikachu');
  });

  it('clears query when clear button is clicked', async () => {
    usePokemonStore.setState({ searchQuery: 'pikachu' });
    render(<SearchBar />);

    const clearButton = screen.getByLabelText('Clear search');
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);

    expect(usePokemonStore.getState().searchQuery).toBe('');
  });
});
