/**
 * Maps a barcode string to a Pokémon ID (1-151).
 *
 * Uses djb2 hash algorithm to deterministically convert any barcode
 * into a Pokémon ID. The same barcode will always map to the same
 * Pokémon, regardless of catch status.
 *
 * @param barcodeContent - The scanned barcode string
 * @returns A Pokémon ID from 1-151
 */
export function barcodeToPokemon(barcodeContent: string): number {
  // djb2 hash algorithm
  let hash = 5381;
  for (let i = 0; i < barcodeContent.length; i++) {
    hash = (hash * 33) ^ barcodeContent.charCodeAt(i);
  }

  // Convert to unsigned 32-bit integer, then mod 151 to get 0-150
  const base = (hash >>> 0) % 151;

  // Convert to 1-indexed (1-151)
  return base + 1;
}
