# Agent Instructions

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started.

## Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git
```

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - `yarn check` and `yarn build`
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds

---

## Project Overview

**PokeScan** — A mobile-first PWA Pokédex that scans QR codes to "catch" the original 151 Pokemon.

- **Stack:** Svelte 5 (runes) + Vite + TypeScript
- **Aesthetic:** Retro 8-bit Game Boy screen (green `#9bbc0f`), anime-style red shell (CSS-first, no images for shell)
- **Navigation:** D-pad + A/B buttons are the ONLY interface (no touch/swipe on screen content)
- **Persistence:** IndexedDB via `idb` library
- **Package manager:** Yarn 1.x (`yarn add`, `yarn dev`, `yarn build`, `yarn check`)

## Architecture

### Directory Structure

```
src/
├── App.svelte                        # Root — routes views via state machine
├── main.ts                           # Vite entry point
├── app.css                           # Global styles, CSS variables, font-face
├── assets/fonts/                     # Press Start 2P (self-hosted woff2)
└── lib/
    ├── components/                   # Svelte 5 components
    │   ├── PokedexShell.svelte       # Red hardware frame, indicator lights, layout
    │   ├── CenterScreen.svelte       # Game Boy green screen with bezel
    │   ├── DPad.svelte               # D-pad (CSS grid 3x3), emits InputAction
    │   ├── ActionButtons.svelte      # A + B buttons, emits InputAction
    │   └── MenuView.svelte           # Main menu with cursor (SCAN, POKeDEX, ABOUT)
    ├── stores/
    │   └── navigation.svelte.ts      # Navigation state machine (Svelte 5 runes)
    ├── types/
    │   └── pokemon.ts                # Pokemon, CatchRecord, ViewState, InputAction
    ├── data/
    │   └── sprites/                  # 96x96 sprite PNGs (to be populated)
    └── services/                     # Business logic (to be populated)
```

### Navigation State Machine

All navigation flows through `src/lib/stores/navigation.svelte.ts`. Uses Svelte 5 `$state()` runes.

```
menu ──(a)──→ scanner | pokedex-list | about
scanner ──(b)──→ menu
scanner ──(auto-catch)──→ pokemon-detail    ← via goToDetail()
pokedex-list ──(a)──→ pokemon-detail
pokedex-list ──(b)──→ menu
pokemon-detail ──(b)──→ detailReturnTo      ← returns to caller (menu or list)
about ──(b)──→ menu
```

**Key exports:**
- `dispatch(action: InputAction)` — main input handler, called from App.svelte
- `goToDetail(pokemonId, returnTo)` — programmatic navigation (used by catch flow)
- `getView()`, `getSelectedPokemonId()`, `getMenuCursor()`, `getListCursor()`, `getMenuItems()` — reactive getters

### Input Flow

```
User tap → DPad/ActionButtons → onInput callback → App.svelte handleInput() → dispatch(action)
```

All input is `InputAction`: `'up' | 'down' | 'left' | 'right' | 'a-button' | 'b-button'`

### View Rendering

`App.svelte` uses `{#if getView() === '...'}` conditional blocks to swap views inside `<PokedexShell>`. The shell accepts `children: Snippet` and `onInput` callback via `$props()`.

### TypeScript Interfaces (`src/lib/types/pokemon.ts`)

```typescript
interface Pokemon {
  id: number;         // 1-151
  name: string;
  types: string[];
  sprite: string;     // filename in data/sprites/
}

interface CatchRecord {
  pokemonId: number;
  caughtAt: string;                 // ISO timestamp
  barcodeContent: string;
  location?: { lat: number; lng: number };
}

type ViewState = 'menu' | 'scanner' | 'pokemon-detail' | 'pokedex-list' | 'about';
type InputAction = 'up' | 'down' | 'left' | 'right' | 'a-button' | 'b-button';
```

### CSS Theme (`src/app.css`)

All colors are CSS variables on `:root`:

| Variable | Value | Usage |
|----------|-------|-------|
| `--pokedex-red` | `#dc2626` | Shell background |
| `--pokedex-red-dark` | `#991b1b` | Shell shadow |
| `--pokedex-red-light` | `#ef4444` | Shell highlight |
| `--screen-bg` | `#9bbc0f` | Game Boy green screen |
| `--screen-bg-dark` | `#0f380f` | Screen dark accent |
| `--screen-text` | `#0f380f` | Text on screen |
| `--screen-border` | `#4a5568` | Screen bezel |
| `--button-dark` | `#1a1a2e` | Button color |
| `--dpad-color` | `#2d2d2d` | D-pad color |

Font: `Press Start 2P` at 8px base, monospace fallback. Screen uses `image-rendering: pixelated`.

### Component Patterns

- All components use **Svelte 5 runes** (`$props()`, `$state()`)
- Props are typed inline: `let { onInput }: { onInput: (action: InputAction) => void } = $props()`
- Children use `Snippet` type: `let { children }: { children: Snippet } = $props()`
- Children rendered with `{@render children()}`
- No two-way binding — data flows down, events flow up via callbacks

### Planned Services (`src/lib/services/`)

| File | Purpose |
|------|---------|
| `storage.ts` | IndexedDB via `idb` — catches store + settings store |
| `heuristic.ts` | djb2 hash of barcode string → mod 151 → pick from uncaught pool |
| `pokeapi.ts` | Online enrichment from PokeAPI |
| `sound.ts` | Web Audio API manager |

## Design Decisions

- **No router library** — state machine handles all navigation
- **No touch gestures on screen** — d-pad/buttons only (hardware metaphor)
- **CSS-first visuals** — shell, screen, buttons all pure CSS (no image assets for UI chrome)
- **Catch flow** — scan → auto-capture → heuristic mapping → persist → detail view (no intermediate encounter screen)
- **Scanner overlay** — Pokeball-styled circle (not standard scan line), turns red on QR detection
- **Center screen** — 1:1 aspect ratio square, Game Boy green

## Build & Dev

```bash
yarn dev       # Start dev server (Vite)
yarn build     # Production build
yarn preview   # Preview production build
yarn check     # TypeScript + Svelte type checking
```

Vite config is minimal (`vite.config.ts`): just the Svelte plugin, no PWA plugin yet.

## Dependencies

**Production:** `qr-scanner` (installed, not yet integrated)
**Dev:** `svelte`, `vite`, `typescript`, `svelte-check`, `@sveltejs/vite-plugin-svelte`
**Not yet installed:** `idb` (IndexedDB wrapper), `vite-plugin-pwa`
