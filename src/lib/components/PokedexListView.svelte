<script lang="ts">
  import { getAllPokemon } from '../stores/pokedex.svelte';
  import { getListCursor } from '../stores/navigation.svelte';

  const pokemon = $derived(getAllPokemon());
  const cursor = $derived(getListCursor());

  // Scroll the cursor into view when it changes
  let listContainer: HTMLDivElement | undefined = $state();

  $effect(() => {
    if (!listContainer) return;
    const cursorElement = listContainer.querySelector(`[data-index="${cursor}"]`);
    if (cursorElement) {
      cursorElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  });
</script>

<div class="pokedex-list" bind:this={listContainer}>
  {#each pokemon as mon, index (mon.id)}
    <div
      class="list-item"
      class:selected={index === cursor}
      data-index={index}
    >
      <div class="pokemon-id">#{mon.id.toString().padStart(3, '0')}</div>

      {#if mon.caught}
        <div class="pokemon-sprite">
          <img
            src="/sprites/{mon.sprite}"
            alt={mon.name}
            on:error={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        <div class="pokemon-name">{mon.name.toUpperCase()}</div>
      {:else}
        <div class="pokemon-sprite unknown">???</div>
        <div class="pokemon-name unknown">???</div>
      {/if}
    </div>
  {/each}
</div>

<div class="footer">
  <div class="caught-count">
    {pokemon.filter((p) => p.caught).length} / 151 CAUGHT
  </div>
  <div class="hint">A: VIEW · B: BACK</div>
</div>

<style>
  .pokedex-list {
    width: 100%;
    height: calc(100% - 32px);
    overflow-y: auto;
    overflow-x: hidden;
    padding: 4px;

    /* Hide scrollbar but keep functionality */
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .pokedex-list::-webkit-scrollbar {
    display: none;
  }

  .list-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px;
    margin-bottom: 2px;
    border: 2px solid transparent;
    transition: background-color 0.1s;
  }

  .list-item.selected {
    background: rgba(15, 56, 15, 0.3);
    border-color: var(--screen-text);
  }

  .pokemon-id {
    font-size: 8px;
    width: 32px;
    flex-shrink: 0;
  }

  .pokemon-sprite {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }

  .pokemon-sprite img {
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
  }

  .pokemon-sprite.unknown {
    opacity: 0.5;
  }

  .pokemon-name {
    font-size: 10px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .pokemon-name.unknown {
    opacity: 0.5;
  }

  .footer {
    height: 32px;
    border-top: 2px solid var(--screen-text);
    padding: 4px 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .caught-count {
    font-size: 8px;
  }

  .hint {
    font-size: 6px;
    opacity: 0.5;
  }
</style>
