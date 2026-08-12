import { describe, it, expect, beforeEach } from 'vitest';
import { useCompareStore } from '@/src/store/useCompareStore';

describe('useCompareStore', () => {
  const mockMonA = { id: 1, name: 'bulbasaur', displayName: 'Bulbasaur' };
  const mockMonB = { id: 25, name: 'pikachu', displayName: 'Pikachu' };

  beforeEach(() => {
    useCompareStore.getState().clearCompare();
    useCompareStore.getState().closeSelectionModal();
  });

  it('sets slot A and slot B', () => {
    useCompareStore.getState().setSlotA(mockMonA);
    useCompareStore.getState().setSlotB(mockMonB);

    expect(useCompareStore.getState().slotA?.id).toBe(1);
    expect(useCompareStore.getState().slotB?.id).toBe(25);
  });

  it('swaps slots A and B', () => {
    useCompareStore.getState().setSlotA(mockMonA);
    useCompareStore.getState().setSlotB(mockMonB);
    useCompareStore.getState().swapSlots();

    expect(useCompareStore.getState().slotA?.id).toBe(25);
    expect(useCompareStore.getState().slotB?.id).toBe(1);
  });

  it('opens and closes selection modal for target slot', () => {
    useCompareStore.getState().openSelectionModal('B');
    expect(useCompareStore.getState().isSelectionModalOpen).toBe(true);
    expect(useCompareStore.getState().activeTargetSlot).toBe('B');

    useCompareStore.getState().closeSelectionModal();
    expect(useCompareStore.getState().isSelectionModalOpen).toBe(false);
  });

  it('clears comparison slots', () => {
    useCompareStore.getState().setSlotA(mockMonA);
    useCompareStore.getState().setSlotB(mockMonB);
    useCompareStore.getState().clearCompare();

    expect(useCompareStore.getState().slotA).toBeNull();
    expect(useCompareStore.getState().slotB).toBeNull();
  });
});
