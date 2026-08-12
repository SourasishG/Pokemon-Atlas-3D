import { describe, it, expect } from 'vitest';
import { analyzeTeam } from '@/src/utils/teamAnalytics';

describe('teamAnalytics utility', () => {
  const mockPikachu = {
    id: 25,
    name: 'pikachu',
    displayName: 'Pikachu',
    totalStats: 320,
    types: [{ name: 'electric' }],
    stats: [
      { name: 'hp', value: 35 },
      { name: 'attack', value: 55 },
      { name: 'defense', value: 40 },
      { name: 'speed', value: 90 },
    ],
  };

  const mockCharizard = {
    id: 6,
    name: 'charizard',
    displayName: 'Charizard',
    totalStats: 534,
    types: [{ name: 'fire' }, { name: 'flying' }],
    stats: [
      { name: 'hp', value: 78 },
      { name: 'attack', value: 84 },
      { name: 'defense', value: 78 },
      { name: 'speed', value: 100 },
    ],
  };

  const mockGyara = {
    id: 130,
    name: 'gyarados',
    displayName: 'Gyarados',
    totalStats: 540,
    types: [{ name: 'water' }, { name: 'flying' }],
    stats: [
      { name: 'hp', value: 95 },
      { name: 'attack', value: 125 },
      { name: 'defense', value: 79 },
      { name: 'speed', value: 81 },
    ],
  };

  it('returns default empty structures for empty or null team input', () => {
    const emptyAnalysis = analyzeTeam([]);
    expect(emptyAnalysis.memberCount).toBe(0);
    expect(emptyAnalysis.totalStats).toBe(0);
    expect(emptyAnalysis.avgStats).toBe(0);
    expect(emptyAnalysis.fastest).toBeNull();
    expect(emptyAnalysis.sharedWeaknesses).toEqual([]);

    const nullAnalysis = analyzeTeam(null);
    expect(nullAnalysis.memberCount).toBe(0);
  });

  it('correctly calculates total and average stats for a team', () => {
    const analysis = analyzeTeam([mockPikachu, mockCharizard]);
    expect(analysis.memberCount).toBe(2);
    expect(analysis.totalStats).toBe(854); // 320 + 534
    expect(analysis.avgStats).toBe(427); // 854 / 2
  });

  it('identifies fastest, highest attack, and highest defense team members', () => {
    const analysis = analyzeTeam([mockPikachu, mockCharizard, mockGyara]);
    expect(analysis.fastest?.id).toBe(6); // Charizard speed 100
    expect(analysis.strongestAtk?.id).toBe(130); // Gyarados attack 125
    expect(analysis.highestDef?.id).toBe(130); // Gyarados defense 79
  });

  it('detects shared weaknesses across team members', () => {
    // Both Charizard (fire/flying) and Gyarados (water/flying) are weak to Electric
    const analysis = analyzeTeam([mockCharizard, mockGyara]);
    const electricWeakness = analysis.sharedWeaknesses.find((w) => w.type === 'electric');
    expect(electricWeakness).toBeDefined();
    expect(electricWeakness?.count).toBe(2);
  });

  it('determines the most common type in the team', () => {
    const analysis = analyzeTeam([mockCharizard, mockGyara]); // Both have Flying
    expect(analysis.mostCommonType).toBe('flying');
  });
});
