/**
 * Maps a barcode string to a Pokémon ID (1-151).
 *
 * Uses djb2 hash algorithm to deterministically convert any barcode
 * into a Pokémon ID. If the selected Pokémon has already been caught,
 * wraps around to find the next uncaught one in the pool.
 *
 * @param barcodeContent - The scanned barcode string
 * @param caughtIds - Set of already-caught Pokémon IDs
 * @returns A Pokémon ID from 1-151
 */
export function barcodeToPokemon(
  barcodeContent: string,
  caughtIds: Set<number>
): number {
  // djb2 hash algorithm
  let hash = 5381;
  for (let i = 0; i < barcodeContent.length; i++) {
    hash = (hash * 33) ^ barcodeContent.charCodeAt(i);
  }

  // Convert to unsigned 32-bit integer, then mod 151 to get 0-150
  const base = (hash >>> 0) % 151;

  // Convert to 1-indexed (1-151)
  const startId = base + 1;

  // If not caught, return it
  if (!caughtIds.has(startId)) {
    return startId;
  }

  // Otherwise, find the next uncaught Pokémon (wrap around)
  for (let offset = 1; offset < 151; offset++) {
    const candidateId = ((startId - 1 + offset) % 151) + 1;
    if (!caughtIds.has(candidateId)) {
      return candidateId;
    }
  }

  // All 151 caught! Just return the hash result
  return startId;
}
