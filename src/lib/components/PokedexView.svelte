<script lang="ts">
  import PokedexListView from './PokedexListView.svelte';
  import PokedexGridView from './PokedexGridView.svelte';
  import { getPokedexTab, getTabCursor, isInTabBar } from '../stores/navigation.svelte';

  const activeTab = $derived(getPokedexTab());
  const tabCursor = $derived(getTabCursor());
  const inTabBar = $derived(isInTabBar());

  const tabs = ['LIST', 'GRID'];
</script>

<div class="pokedex-view">
  <div class="tab-bar">
    {#each tabs as tab, index}
      <div
        class="tab"
        class:active={index === tabCursor}
        class:focused={inTabBar}
      >
        {tab}
      </div>
    {/each}
  </div>

  <div class="tab-content">
    {#if activeTab === 'list'}
      <PokedexListView />
    {:else}
      <PokedexGridView />
    {/if}
  </div>
</div>

<style>
  .pokedex-view {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .tab-bar {
    display: flex;
    gap: 16px;
    padding: 6px 12px 4px 12px;
  }

  .tab {
    padding: 4px 0;
    font-size: 10px;
    text-align: left;
    opacity: 0.5;
    transition: all 0.1s;
    border-bottom: 2px solid transparent;
  }

  .tab.active {
    opacity: 1;
    border-bottom-color: var(--screen-text);
  }

  .tab.active.focused {
    opacity: 1;
    color: var(--screen-bg-dark);
  }

  .tab-content {
    flex: 1;
    overflow: hidden;
  }
</style>
