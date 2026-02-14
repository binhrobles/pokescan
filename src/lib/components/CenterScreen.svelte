<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="screen-bezel">
  <div class="screen">
    {@render children()}
  </div>
</div>

<style>
  .screen-bezel {
    background: var(--screen-border);
    border-radius: 8px;
    padding: 8px;
    margin: 0 auto;
    width: calc(100% - 16px);
    box-shadow:
      inset 0 2px 4px rgba(0, 0, 0, 0.4),
      0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .screen {
    background: var(--screen-bg);
    border-radius: 4px;
    width: 100%;
    aspect-ratio: 1;
    overflow: hidden;
    padding: 8px;
    position: relative;
    image-rendering: pixelated;
    box-shadow: inset 0 0 20px rgba(15, 56, 15, 0.3);
  }
</style>
