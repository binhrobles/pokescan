<script lang="ts">
  import { onMount } from 'svelte';
  import PokedexShell from './lib/components/PokedexShell.svelte';
  import MenuView from './lib/components/MenuView.svelte';
  import ScannerView from './lib/components/ScannerView.svelte';
  import CatchAnimationView from './lib/components/CatchAnimationView.svelte';
  import PokemonDetailView from './lib/components/PokemonDetailView.svelte';
  import PokedexView from './lib/components/PokedexView.svelte';
  import AboutView from './lib/components/AboutView.svelte';
  import { dispatch, getView, goToCatchAnimation, setScannerDetectedBarcode, getScannerDetectedBarcode, setGridCursor } from './lib/stores/navigation.svelte';
  import { loadPokedex, recordCatch, getCaughtIds, findPokemonByBarcode } from './lib/stores/pokedex.svelte';
  import { barcodeToPokemon } from './lib/services/heuristic';
  import { initAudio } from './lib/services/sound';
  import type { InputAction } from './lib/types/pokemon';

  // Initialize pokedex store on mount
  onMount(() => {
    loadPokedex();

    // Debug: press 'C' to trigger catch with a random barcode
    window.addEventListener('keydown', handleDebugKey);
    return () => window.removeEventListener('keydown', handleDebugKey);
  });

  async function handleDebugKey(e: KeyboardEvent) {
    if (e.key !== 'c' && e.key !== 'C') return;
    const fakeBarcodeContent = `debug-${Date.now()}-${Math.random()}`;
    const pokemonId = barcodeToPokemon(fakeBarcodeContent);
    const caughtIds = getCaughtIds();
    if (!caughtIds.has(pokemonId)) {
      await recordCatch(pokemonId, fakeBarcodeContent);
    }
    setGridCursor(pokemonId - 1);
    goToCatchAnimation(pokemonId);
  }

  function handleInput(action: InputAction) {
    // Initialize audio on first user interaction
    initAudio();

    dispatch(action);
  }

  function handleDetect(barcodeContent: string) {
    // Store detected barcode (or clear if empty string)
    setScannerDetectedBarcode(barcodeContent || null);
  }

  async function handleCatch() {
    // Get the detected barcode from navigation store
    const barcodeContent = getScannerDetectedBarcode();
    if (!barcodeContent) return;

    // Check if we've seen this barcode before
    let pokemonId = findPokemonByBarcode(barcodeContent);

    // If new barcode, use heuristic to map to a Pokémon
    if (pokemonId === undefined) {
      pokemonId = barcodeToPokemon(barcodeContent);

      // Only record the catch if this Pokémon hasn't been caught yet
      const caughtIds = getCaughtIds();
      if (!caughtIds.has(pokemonId)) {
        await recordCatch(pokemonId, barcodeContent);
      }
    }

    // Clear detected barcode
    setScannerDetectedBarcode(null);

    // Set grid cursor to the caught Pokemon's position (0-indexed)
    setGridCursor(pokemonId - 1);

    // Navigate to catch animation, which will transition to detail view
    goToCatchAnimation(pokemonId);
  }
</script>

<PokedexShell onInput={handleInput}>
  {#if getView() === 'menu'}
    <MenuView />
  {:else if getView() === 'scanner'}
    <ScannerView onDetect={handleDetect} onCatch={handleCatch} />
  {:else if getView() === 'catch-animation'}
    <CatchAnimationView />
  {:else if getView() === 'pokedex'}
    <PokedexView />
  {:else if getView() === 'pokemon-detail'}
    <PokemonDetailView />
  {:else if getView() === 'about'}
    <AboutView />
  {/if}
</PokedexShell>

