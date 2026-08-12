import React, { useState } from 'react';
import { Scale, Sparkles, ArrowRightLeft } from 'lucide-react';
import CompareCard from '../components/compare/CompareCard';
import PokemonSelectModal from '../components/pokemon/PokemonSelectModal';
import { useCompareStore } from '../store/useCompareStore';
import { usePokemonStore } from '../store/usePokemonStore';
import { getPokemon } from '../services/pokeapi';

const RIVALRY_PAIRS = [
  { name: 'Charizard vs Blastoise', pair: ['charizard', 'blastoise'] },
  { name: 'Mewtwo vs Mew', pair: ['mewtwo', 'mew'] },
  { name: 'Lucario vs Gengar', pair: ['lucario', 'gengar'] },
  { name: 'Koraidon vs Miraidon', pair: ['koraidon', 'miraidon'] },
];

export default function Compare() {
  const {
    slotA,
    slotB,
    setSlotA,
    setSlotB,
    swapSlots,
    clearCompare,
    isSelectionModalOpen,
    activeTargetSlot,
    openSelectionModal,
    closeSelectionModal,
  } = useCompareStore();

  const { showToast } = usePokemonStore();
  const [loadingPair, setLoadingPair] = useState(false);

  const handleSelectPokemon = (pokemon) => {
    if (activeTargetSlot === 'A') {
      setSlotA(pokemon);
    } else {
      setSlotB(pokemon);
    }
    showToast(`Assigned ${pokemon.displayName} to Slot ${activeTargetSlot}`, 'success');
  };

  const handleLoadPair = async (pair) => {
    setLoadingPair(true);
    try {
      const [pkmnA, pkmnB] = await Promise.all([getPokemon(pair[0]), getPokemon(pair[1])]);
      if (pkmnA) setSlotA(pkmnA);
      if (pkmnB) setSlotB(pkmnB);
      showToast(`Loaded rivalry specs: ${pkmnA?.displayName} vs ${pkmnB?.displayName}`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to load rivalry comparison', 'error');
    } finally {
      setLoadingPair(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
            <Scale className="w-4 h-4" />
            <span>Dual Benchmark Analyzer</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
            Compare Pokémon Specs
          </h1>
        </div>

        {/* Rivalry Preset Quick Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold mr-1">
            Iconic Rivalries:
          </span>
          {RIVALRY_PAIRS.map((item) => (
            <button
              key={item.name}
              onClick={() => handleLoadPair(item.pair)}
              disabled={loadingPair}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-[11px] font-mono text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors disabled:opacity-50"
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Comparison Component */}
      <CompareCard
        slotA={slotA}
        slotB={slotB}
        onSelectA={() => openSelectionModal('A')}
        onSelectB={() => openSelectionModal('B')}
        onSwap={swapSlots}
        onReset={clearCompare}
      />

      {/* Selection Modal */}
      <PokemonSelectModal
        isOpen={isSelectionModalOpen}
        onClose={closeSelectionModal}
        onSelectPokemon={handleSelectPokemon}
        title={`Select Pokémon for Slot ${activeTargetSlot}`}
      />
    </div>
  );
}
