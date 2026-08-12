import { create } from 'zustand';

export const useCompareStore = create((set) => ({
  slotA: null, // Normalized pokemon object 1
  slotB: null, // Normalized pokemon object 2
  isSelectionModalOpen: false,
  activeTargetSlot: 'A', // 'A' | 'B'

  setSlotA: (pokemon) => set({ slotA: pokemon }),
  setSlotB: (pokemon) => set({ slotB: pokemon }),

  swapSlots: () => set((state) => ({ slotA: state.slotB, slotB: state.slotA })),

  openSelectionModal: (slotTarget) => set({ isSelectionModalOpen: true, activeTargetSlot: slotTarget }),
  closeSelectionModal: () => set({ isSelectionModalOpen: false }),

  clearCompare: () => set({ slotA: null, slotB: null }),
}));
