import { getTypeColor } from '../utils/typeColors';
import { STAT_MAP, POKEMON_GENERATIONS } from '../constants/pokemonConstants';

const BASE_URL = 'https://pokeapi.co/api/v2';

// In-memory cache for API responses
const memoryCache = new Map();

/**
 * Normalizes raw PokéAPI responses into a consistent frontend object
 */
export const normalizePokemonData = (pokemon, speciesData = null, evoChainData = null) => {
  if (!pokemon) return null;

  const id = pokemon.id;
  const name = pokemon.name || '';
  const displayName = pokemon.displayName || (name ? name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ') : '');

  // Images
  const officialArtwork = pokemon.sprites?.other?.['official-artwork']?.front_default;
  const shinyArtwork = pokemon.sprites?.other?.['official-artwork']?.front_shiny;
  const homeSprite = pokemon.sprites?.other?.home?.front_default;
  const homeShinySprite = pokemon.sprites?.other?.home?.front_shiny;
  const defaultSprite = pokemon.sprites?.front_default;
  const shinySprite = pokemon.sprites?.front_shiny;
  const animatedShowdown = pokemon.sprites?.other?.showdown?.front_default;

  const image = pokemon.image || officialArtwork || homeSprite || defaultSprite || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  const shinyImage = pokemon.shinyImage || shinyArtwork || homeShinySprite || shinySprite || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`;
  const animatedSprite = pokemon.animatedSprite || animatedShowdown || image;

  // Types
  const types = (pokemon.types || []).map((t) => {
    const typeName = t.type ? t.type.name : (t.name || (typeof t === 'string' ? t : 'normal'));
    const colorInfo = getTypeColor(typeName);
    return {
      name: typeName,
      color: colorInfo.hex,
      badgeClass: colorInfo.badge,
    };
  });

  // Base Stats
  let totalStats = 0;
  const stats = (pokemon.stats || []).map((s) => {
    const statKey = s.stat ? s.stat.name : (s.name || '');
    const value = s.base_stat !== undefined ? s.base_stat : (s.value || 0);
    const meta = STAT_MAP[statKey] || { name: statKey || 'Stat', short: (statKey || 'STAT').toUpperCase(), max: 255, color: 'bg-cyan-500' };
    totalStats += value;
    return {
      name: statKey,
      label: meta.name,
      short: meta.short,
      value,
      max: meta.max,
      color: meta.color,
      percentage: Math.min(Math.round((value / meta.max) * 100), 100),
    };
  });

  // Abilities
  const abilities = (pokemon.abilities || []).map((a) => ({
    name: (a.ability ? a.ability.name : a.name || '').replace(/-/g, ' '),
    isHidden: a.is_hidden !== undefined ? a.is_hidden : !!a.isHidden,
  }));

  // Moves (top 8)
  const moves = (pokemon.moves || []).slice(0, 8).map((m) => {
    if (typeof m === 'string') return m;
    return (m.move ? m.move.name : m.name || '').replace(/-/g, ' ');
  });

  // Height & Weight (if from raw, raw is in decimeters/hectograms so divide by 10)
  const height = pokemon.sprites ? (pokemon.height || 0) / 10 : (pokemon.height || 0);
  const weight = pokemon.sprites ? (pokemon.weight || 0) / 10 : (pokemon.weight || 0);

  // Flavor Text & Species Details
  let flavorText = pokemon.flavorText || 'An enigmatic Pokémon species waiting to be thoroughly researched in the 3D Atlas.';
  if (speciesData && speciesData.flavor_text_entries) {
    const englishEntry = speciesData.flavor_text_entries.find(
      (entry) => entry.language && entry.language.name === 'en'
    );
    if (englishEntry) {
      flavorText = englishEntry.flavor_text.replace(/[\n\f]/g, ' ');
    }
  }

  // Parse evolution chain if available
  let evolutionChain = pokemon.evolutionChain || [];
  if (evoChainData && evoChainData.chain) {
    evolutionChain = parseEvolutionChain(evoChainData.chain);
  }

  const primaryTypeColor = types[0] ? getTypeColor(types[0].name) : getTypeColor('normal');

  return {
    id,
    name,
    displayName,
    image,
    shinyImage,
    animatedSprite,
    types,
    stats,
    totalStats,
    height,
    weight,
    abilities,
    moves,
    flavorText,
    color: primaryTypeColor.hex,
    badgeStyle: primaryTypeColor.badge,
    speciesUrl: pokemon.species?.url || pokemon.speciesUrl,
    evolutionChain,
  };
};

/**
 * Recursive evolution chain parser
 */
function parseEvolutionChain(chainNode) {
  if (!chainNode) return [];

  const results = [];

  function traverse(node) {
    if (!node || !node.species) return;
    const speciesName = node.species.name || '';
    const speciesId = node.species.url ? node.species.url.split('/').filter(Boolean).pop() : '1';

    let minLevel = null;
    let trigger = null;

    if (node.evolution_details && node.evolution_details.length > 0) {
      const detail = node.evolution_details[0];
      minLevel = detail.min_level;
      trigger = detail.trigger?.name?.replace(/-/g, ' ');
    }

    results.push({
      id: parseInt(speciesId, 10),
      name: speciesName,
      displayName: speciesName ? speciesName.charAt(0).toUpperCase() + speciesName.slice(1) : '',
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${speciesId}.png`,
      minLevel,
      trigger,
    });

    if (node.evolves_to && node.evolves_to.length > 0) {
      node.evolves_to.forEach((nextChild) => traverse(nextChild));
    }
  }

  traverse(chainNode);
  return results;
}

/**
 * Get paginated or filtered Pokémon list with full metadata
 */
export async function getPokemonList({
  limit = 24,
  offset = 0,
  search = '',
  type = 'all',
  generation = 'all',
  signal,
} = {}) {
  const cacheKey = `list_${limit}_${offset}_${search}_${type}_${generation}`;
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  try {
    let targetList = [];

    if (type !== 'all') {
      const typeRes = await fetch(`${BASE_URL}/type/${type}`, { signal });
      const typeData = await typeRes.json();
      targetList = typeData.pokemon.map((p) => ({
        name: p.pokemon.name,
        url: p.pokemon.url,
        id: parseInt(p.pokemon.url.split('/').filter(Boolean).pop(), 10),
      }));
    } else {
      // Get base list
      const genObj = POKEMON_GENERATIONS.find((g) => g.id === generation);
      let fetchLimit = limit;
      let fetchOffset = offset;

      if (genObj && genObj.id !== 'all') {
        fetchOffset = genObj.range[0] - 1;
        fetchLimit = genObj.range[1] - genObj.range[0] + 1;
      } else {
        fetchLimit = 1025; // Fetch full directory for fast dynamic search/filter
      }

      const res = await fetch(`${BASE_URL}/pokemon?limit=${fetchLimit}&offset=${fetchOffset}`, { signal });
      const data = await res.json();
      targetList = data.results.map((p) => {
        const id = parseInt(p.url.split('/').filter(Boolean).pop(), 10);
        return { name: p.name, url: p.url, id };
      });
    }

    // Filter by Generation if type was selected
    if (type !== 'all' && generation !== 'all') {
      const genObj = POKEMON_GENERATIONS.find((g) => g.id === generation);
      if (genObj) {
        targetList = targetList.filter((p) => p.id >= genObj.range[0] && p.id <= genObj.range[1]);
      }
    }

    // Filter by Search Query
    if (search) {
      const query = search.toLowerCase().trim();
      targetList = targetList.filter(
        (p) => p.name.toLowerCase().includes(query) || String(p.id) === query
      );
    }

    const totalCount = targetList.length;
    const paginatedSlice = targetList.slice(offset, offset + limit);

    // Fetch details for the slice in parallel
    const detailedList = await Promise.all(
      paginatedSlice.map(async (item) => {
        return await getPokemon(item.name, signal);
      })
    );

    const result = {
      items: detailedList.filter(Boolean),
      totalCount,
      hasMore: offset + limit < totalCount,
    };

    memoryCache.set(cacheKey, result);
    return result;
  } catch (err) {
    if (err.name === 'AbortError') return { items: [], totalCount: 0, hasMore: false, aborted: true };
    console.error('Error in getPokemonList:', err);
    throw err;
  }
}

/**
 * Fetch detailed Pokémon metadata
 */
export async function getPokemon(nameOrId, signal) {
  if (!nameOrId) return null;
  const key = `pokemon_${String(nameOrId).toLowerCase()}`;
  if (memoryCache.has(key)) return memoryCache.get(key);

  try {
    const res = await fetch(`${BASE_URL}/pokemon/${String(nameOrId).toLowerCase()}`, { signal });
    if (!res.ok) return null;
    const raw = await res.json();
    const normalized = normalizePokemonData(raw);

    memoryCache.set(key, normalized);
    memoryCache.set(`pokemon_${raw.id}`, normalized);
    memoryCache.set(`pokemon_${raw.name}`, normalized);
    return normalized;
  } catch (err) {
    if (err.name === 'AbortError') return null;
    console.error(`Error fetching pokemon ${nameOrId}:`, err);
    return null;
  }
}

/**
 * Fetch complete Pokémon details including species and evolution chain
 */
export async function getPokemonFullDetails(nameOrId, signal) {
  if (!nameOrId) return null;
  const key = `full_${String(nameOrId).toLowerCase()}`;
  if (memoryCache.has(key)) return memoryCache.get(key);

  try {
    const res = await fetch(`${BASE_URL}/pokemon/${String(nameOrId).toLowerCase()}`, { signal });
    if (!res.ok) return null;
    const raw = await res.json();

    // Fetch species
    let speciesData = null;
    let evoChainData = null;

    try {
      const speciesRes = await fetch(`${BASE_URL}/pokemon-species/${raw.id}`, { signal });
      if (speciesRes.ok) {
        speciesData = await speciesRes.json();
        if (speciesData.evolution_chain?.url) {
          const evoRes = await fetch(speciesData.evolution_chain.url, { signal });
          if (evoRes.ok) {
            evoChainData = await evoRes.json();
          }
        }
      }
    } catch (e) {
      console.warn('Species fetch warning:', e);
    }

    const fullNormalized = normalizePokemonData(raw, speciesData, evoChainData);
    fullNormalized.rawStats = fullNormalized.stats;

    memoryCache.set(key, fullNormalized);
    memoryCache.set(`full_${raw.id}`, fullNormalized);
    memoryCache.set(`full_${raw.name}`, fullNormalized);
    return fullNormalized;
  } catch (err) {
    if (err.name === 'AbortError') return null;
    console.error(`Error in getPokemonFullDetails for ${nameOrId}:`, err);
    return null;
  }
}
