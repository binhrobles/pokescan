import type { Pokemon, CatchRecord } from '../types/pokemon';
import { getAllCatches, saveCatch, initDB } from '../services/storage';
import pokemonData from '../data/pokemon.json';

/**
 * Pokédex store — manages caught/uncaught state across the app.
 *
 * Loads catch records from IndexedDB on init, provides reactive
 * state for all 151 Pokémon.
 */

// Static Pokémon data (all 151)
const ALL_POKEMON: Pokemon[] = pokemonData as Pokemon[];

// Reactive state
let catches = $state<Map<number, CatchRecord>>(new Map());
let initialized = $state(false);

/** Load all catches from IndexedDB */
export async function loadPokedex(): Promise<void> {
  await initDB();
  const records = await getAllCatches();

  catches = new Map(records.map((record) => [record.pokemonId, record]));
  initialized = true;
}

/** Record a new catch and persist to IndexedDB */
export async function recordCatch(
  pokemonId: number,
  barcodeContent: string,
  location?: { lat: number; lng: number }
): Promise<void> {
  const record: CatchRecord = {
    pokemonId,
    caughtAt: new Date().toISOString(),
    barcodeContent,
    location,
  };

  await saveCatch(record);

  // Update reactive state
  catches.set(pokemonId, record);
}

/** Get all Pokémon with caught status */
export function getAllPokemon(): Array<Pokemon & { caught: boolean; catchRecord?: CatchRecord }> {
  return ALL_POKEMON.map((pokemon) => ({
    ...pokemon,
    caught: catches.has(pokemon.id),
    catchRecord: catches.get(pokemon.id),
  }));
}

/** Get a single Pokémon by ID */
export function getPokemon(id: number): (Pokemon & { caught: boolean; catchRecord?: CatchRecord }) | undefined {
  const pokemon = ALL_POKEMON.find((p) => p.id === id);
  if (!pokemon) return undefined;

  return {
    ...pokemon,
    caught: catches.has(id),
    catchRecord: catches.get(id),
  };
}

/** Get set of all caught Pokémon IDs (for heuristic) */
export function getCaughtIds(): Set<number> {
  return new Set(catches.keys());
}

/** Get count of caught Pokémon */
export function getCaughtCount(): number {
  return catches.size;
}

/** Check if store is initialized */
export function isInitialized(): boolean {
  return initialized;
}

/** Find Pokemon ID associated with a barcode (if already scanned) */
export function findPokemonByBarcode(barcodeContent: string): number | undefined {
  for (const [pokemonId, record] of catches) {
    if (record.barcodeContent === barcodeContent) {
      return pokemonId;
    }
  }
  return undefined;
}
