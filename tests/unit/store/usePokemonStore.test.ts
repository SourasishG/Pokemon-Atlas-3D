import { describe, it, expect, beforeEach } from 'vitest';
import { usePokemonStore } from '@/src/store/usePokemonStore';

describe('usePokemonStore', () => {
  beforeEach(() => {
    usePokemonStore.setState({
      searchQuery: '',
      selectedType: 'all',
      selectedGen: 'all',
      sortBy: 'id-asc',
      viewMode: 'grid',
      pageOffset: 0,
      lowPerformanceMode: false,
      reducedMotion: false,
      toast: null,
      quickViewPokemon: null,
    });
  });

  it('updates search query and resets page offset', () => {
    usePokemonStore.getState().setPageOffset(24);
    usePokemonStore.getState().setSearchQuery('charizard');
    expect(usePokemonStore.getState().searchQuery).toBe('charizard');
    expect(usePokemonStore.getState().pageOffset).toBe(0);
  });

  it('updates selected type filter and resets offset', () => {
    usePokemonStore.getState().setSelectedType('fire');
    expect(usePokemonStore.getState().selectedType).toBe('fire');
    expect(usePokemonStore.getState().pageOffset).toBe(0);
  });

  it('toggles view mode between grid and list', () => {
    usePokemonStore.getState().setViewMode('list');
    expect(usePokemonStore.getState().viewMode).toBe('list');
  });

  it('toggles low performance and reduced motion toggles', () => {
    usePokemonStore.getState().toggleLowPerformanceMode();
    expect(usePokemonStore.getState().lowPerformanceMode).toBe(true);

    usePokemonStore.getState().toggleReducedMotion();
    expect(usePokemonStore.getState().reducedMotion).toBe(true);
  });

  it('triggers toast state', () => {
    usePokemonStore.getState().showToast('Test Toast', 'success');
    expect(usePokemonStore.getState().toast?.message).toBe('Test Toast');
    expect(usePokemonStore.getState().toast?.type).toBe('success');
  });
});
