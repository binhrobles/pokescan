<script lang="ts">
  import { onMount } from 'svelte';
  import PokedexShell from './lib/components/PokedexShell.svelte';
  import MenuView from './lib/components/MenuView.svelte';
  import ScannerView from './lib/components/ScannerView.svelte';
  import PokemonDetailView from './lib/components/PokemonDetailView.svelte';
  import PokedexView from './lib/components/PokedexView.svelte';
  import AboutView from './lib/components/AboutView.svelte';
  import { dispatch, getView, goToDetail, setScannerDetectedBarcode, getScannerDetectedBarcode, getScannerTriggerCatch, resetScannerTriggerCatch } from './lib/stores/navigation.svelte';
  import { loadPokedex, recordCatch, getCaughtIds, findPokemonByBarcode } from './lib/stores/pokedex.svelte';
  import { barcodeToPokemon } from './lib/services/heuristic';
  import type { InputAction } from './lib/types/pokemon';

  // Initialize pokedex store on mount
  onMount(async () => {
    await loadPokedex();
  });

  function handleInput(action: InputAction) {
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
      const caughtIds = getCaughtIds();
      pokemonId = barcodeToPokemon(barcodeContent, caughtIds);

      // Record the catch
      await recordCatch(pokemonId, barcodeContent);
    }

    // Reset catch trigger and clear detected barcode
    resetScannerTriggerCatch();
    setScannerDetectedBarcode(null);

    // Navigate to detail view
    goToDetail(pokemonId, 'scanner');
  }
</script>

<PokedexShell onInput={handleInput}>
  {#if getView() === 'menu'}
    <MenuView />
  {:else if getView() === 'scanner'}
    <ScannerView onDetect={handleDetect} onCatch={handleCatch} shouldCatch={getScannerTriggerCatch()} />
  {:else if getView() === 'pokedex'}
    <PokedexView />
  {:else if getView() === 'pokemon-detail'}
    <PokemonDetailView />
  {:else if getView() === 'about'}
    <AboutView />
  {/if}
</PokedexShell>

