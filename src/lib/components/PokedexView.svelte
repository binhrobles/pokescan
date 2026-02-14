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
    gap: 4px;
    padding: 6px 8px;
    border-bottom: 2px solid var(--screen-text);
  }

  .tab {
    flex: 1;
    padding: 4px 8px;
    font-size: 10px;
    text-align: center;
    opacity: 0.5;
    transition: all 0.1s;
  }

  .tab.active {
    opacity: 1;
  }

  .tab.active.focused {
    background: rgba(15, 56, 15, 0.4);
  }

  .tab-content {
    flex: 1;
    overflow: hidden;
  }
</style>
