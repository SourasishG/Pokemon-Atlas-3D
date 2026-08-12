// Matrix of attacking type vs defending type multipliers
// 2: super effective, 0.5: not very effective, 0: immune, 1: normal
const TYPE_CHART = {
  normal:   { rock: 0.5, ghost: 0, steel: 0.5 },
  fire:     { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water:    { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  grass:    { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  electric: { water: 2, grass: 0.5, electric: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  ice:      { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison:   { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground:   { fire: 2, grass: 0.5, electric: 2, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying:   { grass: 2, electric: 0.5, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic:  { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug:      { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock:     { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost:    { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon:   { dragon: 2, steel: 0.5, fairy: 0 },
  dark:     { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel:    { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy:    { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

export const ALL_TYPES = Object.keys(TYPE_CHART);

/**
 * Calculates defense multipliers for a defender with 1 or 2 types
 */
export const getTypeDefenses = (defenderTypes = []) => {
  const result = {};
  const types = defenderTypes.map(t => (typeof t === 'string' ? t : t.name).toLowerCase());

  ALL_TYPES.forEach((attacker) => {
    let multiplier = 1;
    types.forEach((defender) => {
      if (TYPE_CHART[attacker] && TYPE_CHART[attacker][defender] !== undefined) {
        multiplier *= TYPE_CHART[attacker][defender];
      }
    });
    result[attacker] = multiplier;
  });

  return result;
};

/**
 * Groups weaknesses into 4x, 2x, 0.5x, 0.25x, 0x
 */
export const getWeaknessSummary = (defenderTypes = []) => {
  const defenses = getTypeDefenses(defenderTypes);
  const Summary = {
    weak4x: [],
    weak2x: [],
    resistantHalf: [],
    resistantQuarter: [],
    immune: [],
  };

  Object.entries(defenses).forEach(([type, mult]) => {
    if (mult >= 4) Summary.weak4x.push(type);
    else if (mult === 2) Summary.weak2x.push(type);
    else if (mult === 0.5) Summary.resistantHalf.push(type);
    else if (mult === 0.25) Summary.resistantQuarter.push(type);
    else if (mult === 0) Summary.immune.push(type);
  });

  return Summary;
};
