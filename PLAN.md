# PokeScan — Project Plan

## Context
PokeScan is a mobile-first PWA built with Svelte 5 that mimics a classic Pokédex. Users scan real-world QR codes / barcodes using their phone camera, and a heuristic maps each barcode to one of the original 151 Pokémon. The app tracks caught Pokémon in a retro Game Boy-styled interface, with the entire navigation driven by an on-screen d-pad and buttons rendered as part of the Pokédex shell.

**Current state:** Svelte 5 + Vite + TypeScript scaffold. `qr-scanner` library installed and wired up (logs to console). No PWA setup, no routing, no components, empty `lib/` folder.

---

## Tech Stack

| Concern | Choice | Rationale |
|---|---|---|
| Framework | Svelte 5 (already set up) | Runes, small bundle |
| Build | Vite | Already set up |
| PWA | `vite-plugin-pwa` | Auto-generates manifest + service worker, precaching |
| Storage | IndexedDB via `idb` (tiny ~1KB wrapper) | Offline-friendly, larger quota than localStorage, easy export later |
| QR Scanning | `qr-scanner` (already installed) | Works, good perf |
| Sprites | Bundled: PokeAPI sprite PNGs (96x96, ~3-5KB each) for all 151 | Offline-first |
| Online enrichment | PokeAPI v2 REST | Flavor text, cries, higher-res art |
| Pixel font | Press Start 2P (Google Fonts, self-hosted for offline) | Authentic Game Boy feel |
| Sound | Bundled small 8-bit WAV/MP3 clips (menu blip, catch jingle, encounter) | Web Audio API for playback |
| Routing | State machine (no router library) | All "navigation" happens within the center screen of the Pokédex shell — no URL routing needed |

---

## Architecture Overview

```
src/
├── App.svelte                  # Pokédex shell (red frame, d-pad, buttons)
├── lib/
│   ├── components/
│   │   ├── PokedexShell.svelte     # The red Pokédex hardware frame + d-pad + buttons
│   │   ├── CenterScreen.svelte     # The grey Game Boy screen area (hosts all views)
│   │   ├── DPad.svelte             # Tappable d-pad component (emits up/down/left/right)
│   │   ├── ActionButtons.svelte    # A button, B button
│   │   ├── MenuView.svelte         # 8-bit main menu (Scan / Pokédex / About)
│   │   ├── ScannerView.svelte      # Camera feed + Pokéball-styled scan overlay (replaces standard scan line)
│   │   ├── PokedexListView.svelte  # 1-151 scrollable list
│   │   ├── PokemonDetailView.svelte # Individual Pokémon info screen
│   │   └── AboutView.svelte        # Credits / info
│   ├── stores/
│   │   ├── navigation.svelte.ts    # State machine: current view + menu cursor position
│   │   └── pokedex.svelte.ts       # Caught Pokémon state, persisted to IndexedDB
│   ├── data/
│   │   ├── pokemon.json            # Bundled 151: id, name, types, sprite filename
│   │   └── sprites/                # 151 small PNGs (96x96)
│   ├── services/
│   │   ├── heuristic.ts            # Barcode string → Pokémon ID mapping
│   │   ├── storage.ts              # IndexedDB read/write via idb
│   │   ├── sound.ts                # Web Audio API sound manager
│   │   └── pokeapi.ts              # Online enrichment fetcher
│   └── types/
│       └── pokemon.ts              # TypeScript interfaces
├── assets/
│   └── fonts/                      # Press Start 2P self-hosted
├── app.css                         # Global styles, pixel font face
└── main.ts
```

### Navigation State Machine
All navigation is driven by d-pad + buttons. No touch/swipe on the center screen.

```
States: menu | scanner | pokemon-detail | pokedex-list | about
Inputs: up | down | left | right | a-button | b-button

menu:
  up/down → move cursor
  a-button → enter selected (scanner | pokedex-list | about)

scanner:
  (auto-scan) QR detected → Pokéball overlay turns red → auto-capture → run heuristic → pokemon-detail (newly caught)
  b-button → back to menu

pokemon-detail:
  b-button → back to pokedex-list (or menu if came from scanner)

pokedex-list:
  up/down → scroll list
  a-button → pokemon-detail for selected entry (if caught)
  b-button → back to menu

about:
  b-button → back to menu
```

### Barcode → Pokémon Heuristic (v1)
```
1. Take QR/barcode decoded string
2. Hash it to a numeric value (simple string hash, e.g., djb2)
3. mod 151 → candidate Pokémon ID (1-indexed)
4. If that Pokémon is already caught, pick next uncaught in sequence (wrap around)
5. If all 151 caught → special "Pokédex complete!" flow
```

### IndexedDB Schema
```
pokescan-db:
  catches (store):
    key: pokemonId (1-151)
    value: {
      pokemonId: number,
      caughtAt: ISO timestamp,
      barcodeContent: string,
      location?: { lat, lng }  // if geolocation permission granted
    }

  settings (store):
    key: string
    value: any (sound on/off, etc.)
```

---

## Milestones

### M1: Pokédex Shell & Navigation
**Goal:** The app looks and feels like a Pokédex. D-pad and buttons work. Menu navigates between placeholder screens.

- [ ] Install `vite-plugin-pwa`, configure manifest (app name, icons, theme color red)
- [ ] Create `PokedexShell.svelte` — the red hardware frame styled with pure CSS shapes/gradients (iterative, swap for custom art later)
- [ ] Create `CenterScreen.svelte` — grey Game Boy-styled viewport inside the shell (pixel font, dark background)
- [ ] Create `DPad.svelte` + `ActionButtons.svelte` — tappable touch targets, emit events
- [ ] Build navigation state machine in `navigation.svelte.ts`
- [ ] Create `MenuView.svelte` — 8-bit styled menu with cursor, responds to d-pad up/down + A button
- [ ] Wire up d-pad/button events → state machine → view switching
- [ ] Add Press Start 2P pixel font
- [ ] Basic PWA: manifest.json, service worker via vite-plugin-pwa, app icons
- [ ] Mobile viewport meta, responsive layout (portrait-locked feel)

### M2: Scan & Catch
**Goal:** Scan a real QR code, see which Pokémon it maps to, persist the catch.

- [ ] Bundle `pokemon.json` (151 entries: id, name, types) and sprite PNGs
- [ ] Create `storage.ts` with IndexedDB setup via `idb`
- [ ] Create `pokedex.svelte.ts` store — load catches from IndexedDB, expose caught/uncaught state
- [ ] Create `heuristic.ts` — djb2 hash → mod 151 → pick from uncaught pool
- [ ] Create `ScannerView.svelte` — integrate `qr-scanner` into center screen, Pokéball-styled scan overlay (circle outline instead of standard scan line, turns red on detection)
- [ ] Wire the full flow: scan detects QR → Pokéball overlay turns red → auto-capture → heuristic → persist catch → transition to `PokemonDetailView` showing the new catch
- [ ] Create TypeScript interfaces in `pokemon.ts`

### M3: Pokédex Browser
**Goal:** Browse all 151 Pokémon, see catch details, online enrichment.

- [ ] Create `PokedexListView.svelte` — scrollable 1-151 list in center screen, ??? for uncaught, sprite + name for caught, d-pad scrollable
- [ ] Create `PokemonDetailView.svelte` — sprite, name, types, catch timestamp, barcode content, location if available
- [ ] Create `pokeapi.ts` — fetch flavor text / trivia / higher-res art when online
- [ ] Online enrichment in detail view (graceful fallback when offline)
- [ ] Center screen "expand" behavior for list/detail views (take up more device real estate)
- [ ] Create `AboutView.svelte`

### M4: Polish
**Goal:** Feels like a finished product.

- [ ] 8-bit sound effects: menu blips, encounter jingle, catch sound
- [ ] `sound.ts` service with Web Audio API + mute toggle in settings
- [ ] Catch flow animation (Pokéball throw/shake/catch sequence in 8-bit style)
- [ ] Scanline/CRT shader effect on the center screen (CSS)
- [ ] Install prompt / "Add to Home Screen" UX
- [ ] Offline indicator in Pokédex UI
- [ ] Geolocation capture on catch (with permission prompt)
- [ ] Pokédex completion celebration when all 151 caught
- [ ] Performance pass: lazy-load sprites, optimize service worker caching strategy

---

## Backlog (Future Fun)
- **Catch mini-game** — instead of instant catch, a brief interactive mini-game (timing-based Pokéball throw, fishing rod, tall grass encounter)
- **Contextual heuristic v2** — context-aware Pokémon pools: near water → water types, on wifi → psychic types, time of day influences encounters, lat/lng biomes. Plus a small % chance for rare/legendary Pokémon on every scan regardless of context
- **Pokédex completion rewards** — badges, special animations, unlockable themes
- **Battle system** — rock-paper-scissors style type matchup mini-game against wild Pokémon
- **Pokémon cries** — play the classic 8-bit cry sound on encounter/detail view
- **Cloud sync** — export IndexedDB to a backend so you can sync across devices
- **AR mode** — overlay the Pokémon sprite on the camera feed when caught
- **Daily encounters** — special Pokémon available only on certain days
- **Pokémon stats** — randomized IVs/nature per catch for collector depth
- **Shiny variants** — rare chance of shiny sprite on catch
- **Gesture interactions** — swipe/touch gestures on the Pokémon detail view (pet, spin, etc.)

---

## Verification
After each milestone:
1. `yarn dev` — run dev server
2. Open on mobile (or Chrome DevTools mobile emulation, iPhone SE / Pixel 5 size)
3. **M1:** D-pad and buttons respond to touch, menu navigates between placeholder views, PWA installs from browser
4. **M2:** Camera activates in scanner view, scanning a real QR code triggers encounter, catch persists across app refresh
5. **M3:** Pokédex list shows caught/uncaught, detail view loads, online enrichment shows when connected
6. **M4:** Sounds play, animations run, app works fully offline after first load
