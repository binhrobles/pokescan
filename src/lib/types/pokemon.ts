/** Static data bundled for each of the 151 Pokémon */
export interface Pokemon {
  id: number; // 1-151
  name: string;
  types: string[];
  sprite: string; // filename in data/sprites/
}

/** Persisted record of a caught Pokémon */
export interface CatchRecord {
  pokemonId: number;
  caughtAt: string; // ISO timestamp
  barcodeContent: string;
  location?: {
    lat: number;
    lng: number;
  };
}

/** Navigation view states */
export type ViewState =
  | 'menu'
  | 'scanner'
  | 'pokemon-detail'
  | 'pokedex'
  | 'about';

/** Pokedex tab types */
export type PokedexTab = 'list' | 'grid';

/** D-pad + button input events */
export type InputAction =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'a-button'
  | 'b-button';
