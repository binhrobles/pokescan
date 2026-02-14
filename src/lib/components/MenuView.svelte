<script lang="ts">
  import { getMenuCursor, getMenuItems, selectMenuItem } from '../stores/navigation.svelte';

  const labels: Record<string, string> = {
    'scanner': 'SCAN',
    'pokedex': 'POKéDEX',
    'about': 'ABOUT',
  };

  function handleMenuItemClick(index: number) {
    selectMenuItem(index);
  }
</script>

<div class="menu">
  <h1 class="title">POKéSCAN</h1>
  <div class="menu-list">
    {#each getMenuItems() as item, i}
      <button
        type="button"
        class="menu-item"
        class:active={getMenuCursor() === i}
        onclick={() => handleMenuItemClick(i)}
      >
        <span class="cursor">{getMenuCursor() === i ? '▶' : ' '}</span>
        {labels[item] ?? item}
      </button>
    {/each}
  </div>
</div>

<style>
  .menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 16px;
  }

  .title {
    font-size: 18px;
    color: var(--screen-text);
    text-shadow: 2px 2px 0 rgba(15, 56, 15, 0.2);
  }

  .menu-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .menu-item {
    font-size: 14px;
    color: var(--screen-text);
    white-space: nowrap;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    font-family: inherit;
  }

  .menu-item.active {
    color: var(--screen-bg-dark);
  }

  .cursor {
    display: inline-block;
    width: 1.5em;
  }

</style>
