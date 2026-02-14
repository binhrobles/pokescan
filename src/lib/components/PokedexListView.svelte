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
      {/if}
    </div>
  {/each}
</div>

<div class="footer">
  <div class="caught-count">
    {pokemon.filter((p) => p.caught).length} / 151 CAUGHT
  </div>
</div>

<style>
  .pokedex-list {
    width: 100%;
    height: calc(100% - 28px);
    overflow-y: auto;
    overflow-x: hidden;
    padding: 6px;

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
    gap: 12px;
    padding: 12px 20px;
    margin-bottom: 6px;
    transition: background-color 0.1s;
    position: relative;
    min-height: 72px;
  }

  .list-item.selected {
    background: rgba(15, 56, 15, 0.4);
  }

  .pokemon-id {
    font-size: 12px;
    width: 40px;
    flex-shrink: 0;
    position: absolute;
    left: 20px;
  }

  .pokemon-sprite {
    width: 64px;
    height: 64px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
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
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: absolute;
    right: 20px;
  }

  .pokemon-name.unknown {
    opacity: 0.5;
  }

  .footer {
    height: 28px;
    padding: 6px 8px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .caught-count {
    font-size: 10px;
  }
</style>
