<script lang="ts">
  import PokedexShell from './lib/components/PokedexShell.svelte';
  import MenuView from './lib/components/MenuView.svelte';
  import { dispatch, getView } from './lib/stores/navigation.svelte';
  import type { InputAction } from './lib/types/pokemon';

  function handleInput(action: InputAction) {
    dispatch(action);
  }
</script>

<PokedexShell onInput={handleInput}>
  {#if getView() === 'menu'}
    <MenuView />
  {:else if getView() === 'scanner'}
    <div class="placeholder">SCANNER</div>
  {:else if getView() === 'pokedex-list'}
    <div class="placeholder">POKéDEX</div>
  {:else if getView() === 'pokemon-detail'}
    <div class="placeholder">DETAIL</div>
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
