import { http, HttpResponse } from 'msw';

export const mockPikachuRaw = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  sprites: {
    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    front_shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/25.png',
    other: {
      'official-artwork': {
        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
        front_shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/25.png',
      },
    },
  },
  types: [
    {
      slot: 1,
      type: { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' },
    },
  ],
  stats: [
    { base_stat: 35, stat: { name: 'hp' } },
    { base_stat: 55, stat: { name: 'attack' } },
    { base_stat: 40, stat: { name: 'defense' } },
    { base_stat: 50, stat: { name: 'special-attack' } },
    { base_stat: 50, stat: { name: 'special-defense' } },
    { base_stat: 90, stat: { name: 'speed' } },
  ],
  abilities: [
    { ability: { name: 'static' }, is_hidden: false },
    { ability: { name: 'lightning-rod' }, is_hidden: true },
  ],
  moves: [
    { move: { name: 'thunder-shock' } },
    { move: { name: 'thunderbolt' } },
  ],
};

export const mockBulbasaurRaw = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  sprites: {
    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    other: {
      'official-artwork': {
        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
      },
    },
  },
  types: [
    { slot: 1, type: { name: 'grass' } },
    { slot: 2, type: { name: 'poison' } },
  ],
  stats: [
    { base_stat: 45, stat: { name: 'hp' } },
    { base_stat: 49, stat: { name: 'attack' } },
    { base_stat: 49, stat: { name: 'defense' } },
    { base_stat: 65, stat: { name: 'special-attack' } },
    { base_stat: 65, stat: { name: 'special-defense' } },
    { base_stat: 45, stat: { name: 'speed' } },
  ],
  abilities: [{ ability: { name: 'overgrow' }, is_hidden: false }],
  moves: [{ move: { name: 'tackle' } }],
};

export const handlers = [
  // List endpoint
  http.get('https://pokeapi.co/api/v2/pokemon', ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit') || '24';
    const offset = url.searchParams.get('offset') || '0';

    return HttpResponse.json({
      count: 1025,
      next: `https://pokeapi.co/api/v2/pokemon?offset=${Number(offset) + Number(limit)}&limit=${limit}`,
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
      ],
    });
  }),

  // Type endpoint
  http.get('https://pokeapi.co/api/v2/type/:type', ({ params }) => {
    const { type } = params;
    if (type === 'electric') {
      return HttpResponse.json({
        pokemon: [
          { pokemon: { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' } },
        ],
      });
    }
    return HttpResponse.json({ pokemon: [] });
  }),

  // Individual Pokémon endpoint
  http.get('https://pokeapi.co/api/v2/pokemon/:idOrName', ({ params }) => {
    const { idOrName } = params;
    if (idOrName === '25' || idOrName === 'pikachu') {
      return HttpResponse.json(mockPikachuRaw);
    }
    if (idOrName === '1' || idOrName === 'bulbasaur') {
      return HttpResponse.json(mockBulbasaurRaw);
    }
    if (idOrName === '404') {
      return new HttpResponse(null, { status: 404 });
    }
    if (idOrName === '500') {
      return new HttpResponse(null, { status: 500 });
    }
    if (idOrName === '429') {
      return new HttpResponse(null, { status: 429 });
    }
    return HttpResponse.json(mockPikachuRaw);
  }),

  // Species endpoint
  http.get('https://pokeapi.co/api/v2/pokemon-species/:id', () => {
    return HttpResponse.json({
      flavor_text_entries: [
        {
          flavor_text: 'When several of these Pokémon gather, their electricity could build and cause lightning storms.',
          language: { name: 'en' },
        },
      ],
      evolution_chain: {
        url: 'https://pokeapi.co/api/v2/evolution-chain/10/',
      },
    });
  }),

  // Evolution chain endpoint
  http.get('https://pokeapi.co/api/v2/evolution-chain/:id', () => {
    return HttpResponse.json({
      chain: {
        species: { name: 'pichu', url: 'https://pokeapi.co/api/v2/pokemon-species/172/' },
        evolves_to: [
          {
            species: { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon-species/25/' },
            evolution_details: [{ min_level: 10, trigger: { name: 'level-up' } }],
            evolves_to: [
              {
                species: { name: 'raichu', url: 'https://pokeapi.co/api/v2/pokemon-species/26/' },
                evolution_details: [{ trigger: { name: 'use-item' } }],
                evolves_to: [],
              },
            ],
          },
        ],
      },
    });
  }),
];
