/**
 * PokeAPI enrichment service
 *
 * Fetches flavor text, trivia, and higher-res artwork from PokeAPI v2
 * when online. Data is cached in memory for the session.
 */

export interface PokemonEnrichment {
  flavorText: string;
  genus: string; // e.g., "Seed Pokémon"
  artworkUrl: string; // Official artwork (higher res than sprites)
  height: number; // in decimeters
  weight: number; // in hectograms
}

const POKEAPI_BASE = 'https://pokeapi.co/api/v2';
const cache = new Map<number, PokemonEnrichment>();

/**
 * Fetch enrichment data for a Pokémon by ID
 * Returns cached data if available, otherwise fetches from PokeAPI
 */
export async function fetchPokemonEnrichment(
  pokemonId: number
): Promise<PokemonEnrichment | null> {
  // Check cache first
  if (cache.has(pokemonId)) {
    return cache.get(pokemonId)!;
  }

  try {
    // Fetch main pokemon data
    const pokemonResponse = await fetch(`${POKEAPI_BASE}/pokemon/${pokemonId}`);
    if (!pokemonResponse.ok) return null;
    const pokemonData = await pokemonResponse.json();

    // Fetch species data for flavor text
    const speciesResponse = await fetch(`${POKEAPI_BASE}/pokemon-species/${pokemonId}`);
    if (!speciesResponse.ok) return null;
    const speciesData = await speciesResponse.json();

    // Extract English flavor text (prefer the first Red/Blue version)
    const flavorTextEntries = speciesData.flavor_text_entries.filter(
      (entry: any) => entry.language.name === 'en'
    );
    const flavorText = flavorTextEntries[0]?.flavor_text
      .replace(/\f/g, ' ') // Remove form feed characters
      .replace(/\n/g, ' ') // Remove newlines
      .replace(/\s+/g, ' ') // Collapse multiple spaces
      .trim() || 'No data available.';

    // Extract genus (e.g., "Seed Pokémon")
    const genusEntry = speciesData.genera.find(
      (entry: any) => entry.language.name === 'en'
    );
    const genus = genusEntry?.genus || 'Unknown';

    // Extract official artwork URL
    const artworkUrl =
      pokemonData.sprites.other['official-artwork'].front_default ||
      pokemonData.sprites.front_default ||
      '';

    const enrichment: PokemonEnrichment = {
      flavorText,
      genus,
      artworkUrl,
      height: pokemonData.height,
      weight: pokemonData.weight,
    };

    // Cache it
    cache.set(pokemonId, enrichment);

    return enrichment;
  } catch (error) {
    console.error(`Failed to fetch enrichment for Pokémon ${pokemonId}:`, error);
    return null;
  }
}

/**
 * Check if device is online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}
