import type { ViewState, InputAction } from '../types/pokemon';
import { playCry } from '../services/sound';

/**
 * Navigation state machine for the Pokédex.
 *
 * All navigation is driven by d-pad + buttons. The center screen
 * renders whichever view the current state dictates.
 *
 * State diagram:
 *   menu ──a──→ scanner | pokedex | about
 *   scanner ──b──→ menu
 *   scanner ──(auto-catch)──→ pokemon-detail
 *   pokedex ──d-pad──→ navigate grid
 *   pokedex ──a──→ pokemon-detail (from cursor position)
 *   pokedex ──b──→ menu
 *   pokemon-detail ──b──→ (return to caller)
 *   about ──b──→ menu
 */

const MENU_ITEMS: ViewState[] = ['scanner', 'pokedex', 'about'];

// --- Svelte 5 runes state ---

let currentView: ViewState = $state('menu');
let selectedPokemonId: number | null = $state(null);
let detailReturnTo: ViewState = $state('menu');
let menuCursor: number = $state(0);
let gridCursor: number = $state(0);
let gridColumns: number = $state(5); // Updated dynamically by grid view
let listCursor: number = $state(0);
let scannerDetectedBarcode: string | null = $state(null); // Pending barcode awaiting confirmation

/** Process a d-pad or button input */
export function dispatch(action: InputAction): void {
  switch (currentView) {
    case 'menu':
      handleMenu(action);
      break;
    case 'scanner':
      if (action === 'b-button') {
        scannerDetectedBarcode = null; // Clear detected barcode when going back
        currentView = 'menu';
      }
      break;
    case 'pokedex':
      handlePokedexGrid(action);
      break;
    case 'pokemon-detail':
      if (action === 'a-button' && selectedPokemonId) {
        playCry(selectedPokemonId);
      } else if (action === 'b-button') {
        currentView = detailReturnTo;
      }
      break;
    case 'about':
      if (action === 'b-button') currentView = 'menu';
      break;
  }
}

function handleMenu(action: InputAction): void {
  switch (action) {
    case 'up':
      menuCursor = Math.max(0, menuCursor - 1);
      break;
    case 'down':
      menuCursor = Math.min(MENU_ITEMS.length - 1, menuCursor + 1);
      break;
    case 'a-button':
      currentView = MENU_ITEMS[menuCursor];
      break;
  }
}

function handlePokedexGrid(action: InputAction): void {
  const maxCursor = 150; // 0-150 for 151 pokemon

  switch (action) {
    case 'up':
      gridCursor = Math.max(0, gridCursor - gridColumns);
      break;
    case 'down':
      gridCursor = Math.min(maxCursor, gridCursor + gridColumns);
      break;
    case 'left':
      gridCursor = Math.max(0, gridCursor - 1);
      break;
    case 'right':
      gridCursor = Math.min(maxCursor, gridCursor + 1);
      break;
    case 'a-button':
      selectedPokemonId = gridCursor + 1; // 1-indexed
      detailReturnTo = 'pokedex';
      currentView = 'pokemon-detail';
      break;
    case 'b-button':
      currentView = 'menu';
      break;
  }
}

/** Set grid columns (called by grid view when layout changes) */
export function setGridColumns(cols: number): void {
  gridColumns = cols;
}

/** Set grid cursor position (for scrolling to specific Pokemon) */
export function setGridCursor(index: number): void {
  gridCursor = Math.max(0, Math.min(150, index));
}

/** Navigate directly to detail view (used by catch flow) */
export function goToDetail(pokemonId: number, returnTo: ViewState = 'menu'): void {
  selectedPokemonId = pokemonId;
  detailReturnTo = returnTo;
  currentView = 'pokemon-detail';
}

// --- Read-only accessors (reactive via $state) ---

export function getView(): ViewState {
  return currentView;
}

export function getSelectedPokemonId(): number | null {
  return selectedPokemonId;
}

export function getMenuCursor(): number {
  return menuCursor;
}

export function getMenuItems(): ViewState[] {
  return MENU_ITEMS;
}

export function getGridCursor(): number {
  return gridCursor;
}

export function getListCursor(): number {
  return listCursor;
}

export function setScannerDetectedBarcode(barcode: string | null): void {
  scannerDetectedBarcode = barcode;
}

export function getScannerDetectedBarcode(): string | null {
  return scannerDetectedBarcode;
}

// --- Touch/click navigation helpers ---

/** Select and activate a menu item directly (for touch input) */
export function selectMenuItem(index: number): void {
  if (currentView !== 'menu') return;
  if (index < 0 || index >= MENU_ITEMS.length) return;

  menuCursor = index;
  currentView = MENU_ITEMS[index];
}

/** Select and view a Pokemon from the grid (for touch input) */
export function selectGridPokemon(index: number): void {
  if (currentView !== 'pokedex') return;
  if (index < 0 || index > 150) return;

  selectedPokemonId = index + 1; // 1-indexed
  detailReturnTo = 'pokedex';
  currentView = 'pokemon-detail';
}

/** Select and view a Pokemon from the list (for touch input) */
export function selectListPokemon(index: number): void {
  if (currentView !== 'pokedex') return;
  if (index < 0 || index > 150) return;

  selectedPokemonId = index + 1; // 1-indexed
  detailReturnTo = 'pokedex';
  currentView = 'pokemon-detail';
}

