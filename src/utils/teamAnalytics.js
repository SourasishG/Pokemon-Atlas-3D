import { getTypeDefenses, ALL_TYPES } from './typeEffectiveness';

export const analyzeTeam = (teamMembers = []) => {
  if (!teamMembers || teamMembers.length === 0) {
    return {
      memberCount: 0,
      totalStats: 0,
      avgStats: 0,
      fastest: null,
      strongestAtk: null,
      highestDef: null,
      typeCounts: {},
      sharedWeaknesses: [],
      typeCoverage: {},
      overallWeaknessMatrix: {},
    };
  }

  let totalStatsSum = 0;
  let fastestMember = teamMembers[0];
  let highestAtkMember = teamMembers[0];
  let highestDefMember = teamMembers[0];

  const typeCounts = {};
  const weaknessCounts = {};

  teamMembers.forEach((member) => {
    totalStatsSum += member.totalStats || 0;

    // Stat checks
    const speed = member.stats?.find(s => s.name === 'speed')?.value || 0;
    const currentFastestSpeed = fastestMember.stats?.find(s => s.name === 'speed')?.value || 0;
    if (speed > currentFastestSpeed) fastestMember = member;

    const atk = member.stats?.find(s => s.name === 'attack')?.value || 0;
    const currentAtk = highestAtkMember.stats?.find(s => s.name === 'attack')?.value || 0;
    if (atk > currentAtk) highestAtkMember = member;

    const def = member.stats?.find(s => s.name === 'defense')?.value || 0;
    const currentDef = highestDefMember.stats?.find(s => s.name === 'defense')?.value || 0;
    if (def > currentDef) highestDefMember = member;

    // Type counting
    (member.types || []).forEach((t) => {
      const typeName = (typeof t === 'string' ? t : t.name).toLowerCase();
      typeCounts[typeName] = (typeCounts[typeName] || 0) + 1;
    });

    // Weakness analysis
    const defenses = getTypeDefenses(member.types || []);
    Object.entries(defenses).forEach(([type, mult]) => {
      if (mult > 1) {
        weaknessCounts[type] = (weaknessCounts[type] || 0) + 1;
      }
    });
  });

  // Shared weaknesses (where 2 or more members are vulnerable to same attacking type)
  const sharedWeaknesses = Object.entries(weaknessCounts)
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => ({ type, count }));

  // Find most common type
  const sortedTypeCounts = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
  const mostCommonType = sortedTypeCounts.length > 0 ? sortedTypeCounts[0][0] : null;

  return {
    memberCount: teamMembers.length,
    totalStats: totalStatsSum,
    avgStats: Math.round(totalStatsSum / teamMembers.length),
    fastest: fastestMember,
    strongestAtk: highestAtkMember,
    highestDef: highestDefMember,
    typeCounts,
    mostCommonType,
    sharedWeaknesses,
    weaknessCounts,
  };
};
