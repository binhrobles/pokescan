<script lang="ts">
  import { getAllPokemon } from '../stores/pokedex.svelte';
  import { getGridCursor, setGridColumns, selectGridPokemon } from '../stores/navigation.svelte';
  import { getSpritePath } from '../utils/paths';

  const pokemon = $derived(getAllPokemon());
  const cursor = $derived(getGridCursor());

  function handleGridItemClick(index: number) {
    selectGridPokemon(index);
  }

  function handleGridItemKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectGridPokemon(index);
    }
  }

  let gridContainer: HTMLDivElement | undefined = $state();
  let gridElement: HTMLDivElement | undefined = $state();

  // Calculate actual grid columns based on rendered layout
  $effect(() => {
    if (!gridElement) return;

    const element = gridElement;
    const updateColumns = () => {
      const computedStyle = window.getComputedStyle(element);
      const columns = computedStyle.getPropertyValue('grid-template-columns').split(' ').length;
      setGridColumns(columns);
    };

    updateColumns();
    const resizeObserver = new ResizeObserver(updateColumns);
    resizeObserver.observe(element);

    return () => resizeObserver.disconnect();
  });

  // Scroll to cursor without animation when returning from detail view
  $effect(() => {
    if (!gridContainer) return;
    const cursorElement = gridContainer.querySelector(`[data-index="${cursor}"]`);
    if (cursorElement) {
      cursorElement.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    }
  });
</script>

<div class="grid-container" bind:this={gridContainer}>
  <div class="grid" bind:this={gridElement}>
    {#each pokemon as mon, index (mon.id)}
      <div
        class="grid-item"
        class:selected={index === cursor}
        data-index={index}
        role="button"
        tabindex="0"
        onclick={() => handleGridItemClick(index)}
        onkeydown={(e) => handleGridItemKeydown(e, index)}
      >
        <img
          src={getSpritePath(mon.sprite)}
          alt={mon.caught ? mon.name : '???'}
          class="sprite"
          class:silhouette={!mon.caught}
          onerror={(e) => {
            if (e.currentTarget instanceof HTMLImageElement) {
              e.currentTarget.style.display = 'none';
            }
          }}
        />
      </div>
    {/each}
  </div>
</div>

<div class="footer">
  <div class="caught-count">
    {pokemon.filter((p) => p.caught).length} / 151 CAUGHT
  </div>
</div>

<style>
  .grid-container {
    width: 100%;
    height: calc(100% - 28px);
    overflow-y: auto;
    overflow-x: hidden;
    padding: 8px;

    /* Hide scrollbar but keep functionality */
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .grid-container::-webkit-scrollbar {
    display: none;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
    gap: 10px;
    padding: 8px;
  }

  .grid-item {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(15, 56, 15, 0.1);
    border-radius: 4px;
    overflow: hidden;
    transition: background-color 0.1s;
    cursor: pointer;
  }

  .grid-item.selected {
    background: rgba(15, 56, 15, 0.4);
  }

  .sprite {
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
    object-fit: contain;
  }

  .sprite.silhouette {
    filter: brightness(0);
    opacity: 0.4;
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
