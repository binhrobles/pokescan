<script lang="ts">
  import { onMount } from 'svelte';
  import PokedexShell from './lib/components/PokedexShell.svelte';
  import MenuView from './lib/components/MenuView.svelte';
  import ScannerView from './lib/components/ScannerView.svelte';
  import PokemonDetailView from './lib/components/PokemonDetailView.svelte';
  import { dispatch, getView, goToDetail } from './lib/stores/navigation.svelte';
  import { loadPokedex, recordCatch, getCaughtIds } from './lib/stores/pokedex.svelte';
  import { barcodeToPokemon } from './lib/services/heuristic';
  import type { InputAction } from './lib/types/pokemon';

  // Initialize pokedex store on mount
  onMount(async () => {
    await loadPokedex();
  });

  function handleInput(action: InputAction) {
    dispatch(action);
  }

  async function handleScan(barcodeContent: string) {
    // Map barcode to Pokémon ID
    const caughtIds = getCaughtIds();
    const pokemonId = barcodeToPokemon(barcodeContent, caughtIds);

    // Record the catch
    await recordCatch(pokemonId, barcodeContent);

    // Navigate to detail view
    goToDetail(pokemonId, 'scanner');
  }
</script>

<PokedexShell onInput={handleInput}>
  {#if getView() === 'menu'}
    <MenuView />
  {:else if getView() === 'scanner'}
    <ScannerView onScan={handleScan} />
  {:else if getView() === 'pokedex-list'}
    <div class="placeholder">POKéDEX</div>
  {:else if getView() === 'pokemon-detail'}
    <PokemonDetailView />
  {:else if getView() === 'about'}
    <div class="placeholder">ABOUT<br/>Press B to go back</div>
  {/if}
</PokedexShell>

<style>
  .placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 12px;
    color: var(--screen-text);
    text-align: center;
  }
</style>
