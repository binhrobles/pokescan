import { openDB, type IDBPDatabase } from 'idb';
import type { CatchRecord } from '../types/pokemon';

const DB_NAME = 'pokescan-db';
const DB_VERSION = 1;

interface PokeScanDB {
  catches: {
    key: number; // pokemonId (1-151)
    value: CatchRecord;
  };
  settings: {
    key: string;
    value: unknown;
  };
}

let db: IDBPDatabase<PokeScanDB> | null = null;

/** Initialize the IndexedDB database */
export async function initDB(): Promise<void> {
  if (db) return;

  db = await openDB<PokeScanDB>(DB_NAME, DB_VERSION, {
    upgrade(database) {
      // Create catches store if it doesn't exist
      if (!database.objectStoreNames.contains('catches')) {
        database.createObjectStore('catches', { keyPath: 'pokemonId' });
      }

      // Create settings store if it doesn't exist
      if (!database.objectStoreNames.contains('settings')) {
        database.createObjectStore('settings');
      }
    },
  });
}

/** Get all caught Pokémon records */
export async function getAllCatches(): Promise<CatchRecord[]> {
  await initDB();
  if (!db) throw new Error('Database not initialized');
  return db.getAll('catches');
}

/** Get a specific catch record by Pokémon ID */
export async function getCatch(pokemonId: number): Promise<CatchRecord | undefined> {
  await initDB();
  if (!db) throw new Error('Database not initialized');
  return db.get('catches', pokemonId);
}

/** Save a new catch (or update existing) */
export async function saveCatch(record: CatchRecord): Promise<void> {
  await initDB();
  if (!db) throw new Error('Database not initialized');
  await db.put('catches', record);
}

/** Check if a Pokémon has been caught */
export async function isCaught(pokemonId: number): Promise<boolean> {
  const record = await getCatch(pokemonId);
  return record !== undefined;
}

/** Get a setting value */
export async function getSetting<T>(key: string): Promise<T | undefined> {
  await initDB();
  if (!db) throw new Error('Database not initialized');
  return db.get('settings', key) as Promise<T | undefined>;
}

/** Save a setting value */
export async function setSetting(key: string, value: unknown): Promise<void> {
  await initDB();
  if (!db) throw new Error('Database not initialized');
  await db.put('settings', value, key);
}
