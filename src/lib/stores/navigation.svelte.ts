import type { ViewState, InputAction } from '../types/pokemon';

/**
 * Navigation state machine for the Pokédex.
 *
 * All navigation is driven by d-pad + buttons. The center screen
 * renders whichever view the current state dictates.
 *
 * State diagram:
 *   menu ──a──→ scanner | pokedex-list | about
 *   scanner ──b──→ menu
 *   scanner ──(auto-catch)──→ pokemon-detail
 *   pokedex-list ──a──→ pokemon-detail
 *   pokedex-list ──b──→ menu
 *   pokemon-detail ──b──→ (return to caller)
 *   about ──b──→ menu
 */

const MENU_ITEMS: ViewState[] = ['scanner', 'pokedex-list', 'about'];

// --- Svelte 5 runes state ---

let currentView: ViewState = $state('menu');
let selectedPokemonId: number | null = $state(null);
let detailReturnTo: ViewState = $state('menu');
let menuCursor: number = $state(0);
let listCursor: number = $state(0);

/** Process a d-pad or button input */
export function dispatch(action: InputAction): void {
  switch (currentView) {
    case 'menu':
      handleMenu(action);
      break;
    case 'scanner':
      if (action === 'b-button') currentView = 'menu';
      break;
    case 'pokedex-list':
      handlePokedexList(action);
      break;
    case 'pokemon-detail':
      if (action === 'b-button') currentView = detailReturnTo;
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

function handlePokedexList(action: InputAction): void {
  switch (action) {
    case 'up':
      listCursor = Math.max(0, listCursor - 1);
      break;
    case 'down':
      listCursor = Math.min(150, listCursor + 1);
      break;
    case 'a-button':
      // Only enter detail if Pokémon is caught — caller checks this
      selectedPokemonId = listCursor + 1; // 1-indexed
      detailReturnTo = 'pokedex-list';
      currentView = 'pokemon-detail';
      break;
    case 'b-button':
      currentView = 'menu';
      break;
  }
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

export function getListCursor(): number {
  return listCursor;
}

export function getMenuItems(): ViewState[] {
  return MENU_ITEMS;
}
