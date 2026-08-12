export const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export const POKEMON_GENERATIONS = [
  { id: 'all', label: 'All Generations', range: [1, 1025] },
  { id: 'gen1', label: 'Gen I (Kanto 1-151)', range: [1, 151] },
  { id: 'gen2', label: 'Gen II (Johto 152-251)', range: [152, 251] },
  { id: 'gen3', label: 'Gen III (Hoenn 252-386)', range: [252, 386] },
  { id: 'gen4', label: 'Gen IV (Sinnoh 387-493)', range: [387, 493] },
  { id: 'gen5', label: 'Gen V (Unova 494-649)', range: [494, 649] },
  { id: 'gen6', label: 'Gen VI (Kalos 650-721)', range: [650, 721] },
  { id: 'gen7', label: 'Gen VII (Alola 722-809)', range: [722, 809] },
  { id: 'gen8', label: 'Gen VIII (Galar 810-905)', range: [810, 905] },
  { id: 'gen9', label: 'Gen IX (Paldea 906-1025)', range: [906, 1025] },
];

export const STAT_MAP = {
  hp: { name: 'HP', short: 'HP', max: 255, color: 'bg-emerald-500' },
  attack: { name: 'Attack', short: 'ATK', max: 255, color: 'bg-rose-500' },
  defense: { name: 'Defense', short: 'DEF', max: 255, color: 'bg-amber-500' },
  'special-attack': { name: 'Sp. Atk', short: 'SPA', max: 255, color: 'bg-cyan-500' },
  'special-defense': { name: 'Sp. Def', short: 'SPD', max: 255, color: 'bg-indigo-500' },
  speed: { name: 'Speed', short: 'SPE', max: 255, color: 'bg-yellow-400' },
};

export const FEATURED_POKEMON_IDS = [6, 150, 250, 384, 445, 658, 1008];
