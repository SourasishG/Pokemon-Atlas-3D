import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { normalizePokemonData, getPokemon, getPokemonFullDetails, getPokemonList } from '@/src/services/pokeapi';
import { server } from '../../mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('pokeapi service and normalizePokemonData', () => {
  it('normalizePokemonData returns null when given null or undefined input', () => {
    expect(normalizePokemonData(null)).toBeNull();
    expect(normalizePokemonData(undefined)).toBeNull();
  });

  it('normalizes raw PokéAPI data into structured frontend object', () => {
    const raw = {
      id: 25,
      name: 'pikachu',
      height: 4, // 4 decimeters -> 0.4 m
      weight: 60, // 60 hectograms -> 6.0 kg
      sprites: {
        front_default: 'https://img.png',
        other: {
          'official-artwork': {
            front_default: 'https://artwork.png',
          },
        },
      },
      types: [{ slot: 1, type: { name: 'electric' } }],
      stats: [
        { base_stat: 35, stat: { name: 'hp' } },
        { base_stat: 55, stat: { name: 'attack' } },
      ],
      abilities: [{ ability: { name: 'static' }, is_hidden: false }],
      moves: [{ move: { name: 'thunderbolt' } }],
    };

    const normalized = normalizePokemonData(raw);
    expect(normalized).not.toBeNull();
    expect(normalized.id).toBe(25);
    expect(normalized.name).toBe('pikachu');
    expect(normalized.displayName).toBe('Pikachu');
    expect(normalized.height).toBe(0.4);
    expect(normalized.weight).toBe(6);
    expect(normalized.image).toBe('https://artwork.png');
    expect(normalized.types[0].name).toBe('electric');
    expect(normalized.totalStats).toBe(90);
    expect(normalized.abilities[0].name).toBe('static');
  });

  it('provides fallback image when sprite fields are missing', () => {
    const rawNoImage = {
      id: 999,
      name: 'missingno',
      sprites: {},
    };
    const normalized = normalizePokemonData(rawNoImage);
    expect(normalized.image).toBe('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/999.png');
  });

  it('fetches a single Pokémon using getPokemon with MSW mock', async () => {
    const pikachu = await getPokemon('pikachu');
    expect(pikachu).not.toBeNull();
    expect(pikachu.id).toBe(25);
    expect(pikachu.displayName).toBe('Pikachu');
  });

  it('returns null gracefully when API returns 404', async () => {
    const notFound = await getPokemon('404');
    expect(notFound).toBeNull();
  });

  it('fetches full Pokémon details with species and evolution chain', async () => {
    const fullPikachu = await getPokemonFullDetails('pikachu');
    expect(fullPikachu).not.toBeNull();
    expect(fullPikachu.flavorText).toContain('electricity');
    expect(fullPikachu.evolutionChain.length).toBeGreaterThan(0);
    expect(fullPikachu.evolutionChain[0].name).toBe('pichu');
  });

  it('fetches and filters Pokémon list using getPokemonList', async () => {
    const list = await getPokemonList({ search: 'pika' });
    expect(list.items).toBeDefined();
    expect(list.totalCount).toBeGreaterThan(0);
    expect(list.items[0].name).toBe('pikachu');
  });
});
