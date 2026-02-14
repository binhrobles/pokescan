import type { ViewState, InputAction, PokedexTab } from '../types/pokemon';

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
 *   pokedex ──up──→ switch tabs (list ↔ grid)
 *   pokedex ──a──→ pokemon-detail (from cursor position)
 *   pokedex ──b──→ menu
 *   pokemon-detail ──b──→ (return to caller)
 *   about ──b──→ menu
 */

const MENU_ITEMS: ViewState[] = ['scanner', 'pokedex', 'about'];
const POKEDEX_TABS: PokedexTab[] = ['list', 'grid'];

// --- Svelte 5 runes state ---

let currentView: ViewState = $state('menu');
let selectedPokemonId: number | null = $state(null);
let detailReturnTo: ViewState = $state('menu');
let menuCursor: number = $state(0);
let listCursor: number = $state(0);
let gridCursor: number = $state(0);
let pokedexTab: PokedexTab = $state('list');
let tabCursor: number = $state(0); // 0 = list, 1 = grid
let inTabBar: boolean = $state(false); // true when focus is on tab bar

// Fast scroll tracking for held d-pad
let lastScrollTime = 0;
const FAST_SCROLL_THRESHOLD = 150; // ms - if inputs come faster than this, enable fast scroll
const FAST_SCROLL_AMOUNT = 5; // scroll 5 items at a time when fast scrolling

/** Process a d-pad or button input */
export function dispatch(action: InputAction): void {
  switch (currentView) {
    case 'menu':
      handleMenu(action);
      break;
    case 'scanner':
      if (action === 'b-button') currentView = 'menu';
      break;
    case 'pokedex':
      handlePokedex(action);
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

function handlePokedex(action: InputAction): void {
  // Handle tab bar navigation
  if (inTabBar) {
    switch (action) {
      case 'left':
        tabCursor = Math.max(0, tabCursor - 1);
        pokedexTab = POKEDEX_TABS[tabCursor];
        break;
      case 'right':
        tabCursor = Math.min(POKEDEX_TABS.length - 1, tabCursor + 1);
        pokedexTab = POKEDEX_TABS[tabCursor];
        break;
      case 'down':
        inTabBar = false;
        break;
      case 'b-button':
        currentView = 'menu';
        break;
    }
    return;
  }

  // Handle content navigation based on active tab
  if (pokedexTab === 'list') {
    handlePokedexListContent(action);
  } else {
    handlePokedexGridContent(action);
  }
}

function handlePokedexListContent(action: InputAction): void {
  const now = Date.now();
  const isFastScroll = now - lastScrollTime < FAST_SCROLL_THRESHOLD;
  const scrollAmount = isFastScroll ? FAST_SCROLL_AMOUNT : 1;

  switch (action) {
    case 'up':
      // First up goes to tab bar
      if (listCursor === 0) {
        inTabBar = true;
      } else {
        listCursor = Math.max(0, listCursor - scrollAmount);
        lastScrollTime = now;
      }
      break;
    case 'down':
      listCursor = Math.min(150, listCursor + scrollAmount);
      lastScrollTime = now;
      break;
    case 'a-button':
      selectedPokemonId = listCursor + 1; // 1-indexed
      detailReturnTo = 'pokedex';
      currentView = 'pokemon-detail';
      break;
    case 'b-button':
      currentView = 'menu';
      break;
  }
}

function handlePokedexGridContent(action: InputAction): void {
  const GRID_COLS = 5; // Approximate grid columns
  const maxCursor = 150; // 0-150 for 151 pokemon

  switch (action) {
    case 'up':
      if (gridCursor < GRID_COLS) {
        inTabBar = true;
      } else {
        gridCursor = Math.max(0, gridCursor - GRID_COLS);
      }
      break;
    case 'down':
      gridCursor = Math.min(maxCursor, gridCursor + GRID_COLS);
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

export function getPokedexTab(): PokedexTab {
  return pokedexTab;
}

export function getGridCursor(): number {
  return gridCursor;
}

export function getTabCursor(): number {
  return tabCursor;
}

export function isInTabBar(): boolean {
  return inTabBar;
}
