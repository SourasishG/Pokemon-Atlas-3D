import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import FilterBar from '@/src/components/pokemon/FilterBar';
import { usePokemonStore } from '@/src/store/usePokemonStore';

describe('FilterBar component', () => {
  beforeEach(() => {
    usePokemonStore.setState({
      selectedType: 'all',
      selectedGen: 'all',
      sortBy: 'id-asc',
      viewMode: 'grid',
    });
  });

  it('renders generation dropdown and sort dropdown options', () => {
    render(<FilterBar />);
    expect(screen.getByDisplayValue('All Generations')).toBeInTheDocument();
    expect(screen.getByDisplayValue('ID: Lowest to Highest')).toBeInTheDocument();
  });

  it('changes generation select and updates store state', async () => {
    const user = userEvent.setup();
    render(<FilterBar />);

    const genSelect = screen.getByDisplayValue('All Generations');
    await user.selectOptions(genSelect, 'gen1');

    expect(usePokemonStore.getState().selectedGen).toBe('gen1');
  });

  it('selects a type filter when clicking a type badge button', async () => {
    const user = userEvent.setup();
    render(<FilterBar />);

    const fireButton = screen.getByText('fire');
    await user.click(fireButton);

    expect(usePokemonStore.getState().selectedType).toBe('fire');
  });

  it('resets filters when clicking the reset button', async () => {
    const user = userEvent.setup();
    usePokemonStore.setState({ selectedType: 'fire', selectedGen: 'gen1' });

    render(<FilterBar />);
    const resetButton = screen.getByRole('button', { name: /reset/i });
    expect(resetButton).toBeInTheDocument();

    await user.click(resetButton);

    expect(usePokemonStore.getState().selectedType).toBe('all');
    expect(usePokemonStore.getState().selectedGen).toBe('all');
  });

  it('toggles view mode between grid and list', async () => {
    const user = userEvent.setup();
    render(<FilterBar />);

    const listViewButton = screen.getByTitle('List View');
    await user.click(listViewButton);

    expect(usePokemonStore.getState().viewMode).toBe('list');
  });
});
