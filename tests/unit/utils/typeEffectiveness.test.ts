import { describe, it, expect } from 'vitest';
import { getTypeDefenses, getWeaknessSummary, ALL_TYPES } from '@/src/utils/typeEffectiveness';

describe('typeEffectiveness utility', () => {
  it('contains 18 canonical Pokémon types', () => {
    expect(ALL_TYPES.length).toBe(18);
    expect(ALL_TYPES).toContain('fire');
    expect(ALL_TYPES).toContain('water');
    expect(ALL_TYPES).toContain('fairy');
  });

  it('calculates defenses correctly for single-type Pokémon', () => {
    // Fire type is weak to Water, Ground, Rock (2x damage)
    const fireDefenses = getTypeDefenses(['fire']);
    expect(fireDefenses.water).toBe(2);
    expect(fireDefenses.ground).toBe(2);
    expect(fireDefenses.rock).toBe(2);
    expect(fireDefenses.grass).toBe(0.5);
  });

  it('calculates defenses correctly for dual-type Pokémon', () => {
    // Grass/Poison (Bulbasaur): weak to Fire (2x), Ice (2x), Flying (2x), Psychic (2x); 0.25x against Grass
    const grassPoisonDefenses = getTypeDefenses(['grass', 'poison']);
    expect(grassPoisonDefenses.fire).toBe(2);
    expect(grassPoisonDefenses.grass).toBe(0.25); // 0.5 * 0.5
  });

  it('handles empty or invalid inputs gracefully', () => {
    const emptyDefenses = getTypeDefenses([]);
    // Default defense multiplier is 1 for all types
    Object.values(emptyDefenses).forEach((mult) => {
      expect(mult).toBe(1);
    });
  });

  it('handles object-formatted types [{ name: "water" }]', () => {
    const defenses = getTypeDefenses([{ name: 'water' }]);
    expect(defenses.electric).toBe(2);
    expect(defenses.fire).toBe(0.5);
  });

  it('summarizes weaknesses into categorized groups', () => {
    const summary = getWeaknessSummary(['grass', 'poison']);
    expect(summary.weak2x).toContain('fire');
    expect(summary.weak2x).toContain('ice');
    expect(summary.resistantQuarter).toContain('grass');
  });
});
