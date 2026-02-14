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
    background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
    border-radius: 12px;
    padding: 12px;
    margin: 0 auto;
    width: calc(100% - 24px);
    box-shadow:
      inset 0 2px 4px rgba(255, 255, 255, 0.8),
      inset 0 -2px 4px rgba(0, 0, 0, 0.1),
      0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .screen {
    background: var(--screen-bg);
    border-radius: 6px;
    width: 100%;
    aspect-ratio: 1;
    overflow: hidden;
    position: relative;
    image-rendering: pixelated;
    box-shadow:
      inset 0 0 20px rgba(15, 56, 15, 0.3),
      inset 0 4px 8px rgba(0, 0, 0, 0.3);
  }
</style>
