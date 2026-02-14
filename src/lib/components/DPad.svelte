<script lang="ts">
  import type { InputAction } from '../types/pokemon';

  let { onInput }: { onInput: (action: InputAction) => void } = $props();

  function press(action: InputAction) {
    onInput(action);
  }
</script>

<div class="dpad">
  <button class="dpad-btn up" onclick={() => press('up')} aria-label="Up">
    <span class="arrow">▲</span>
  </button>
  <button class="dpad-btn left" onclick={() => press('left')} aria-label="Left">
    <span class="arrow">◀</span>
  </button>
  <div class="dpad-center"></div>
  <button class="dpad-btn right" onclick={() => press('right')} aria-label="Right">
    <span class="arrow">▶</span>
  </button>
  <button class="dpad-btn down" onclick={() => press('down')} aria-label="Down">
    <span class="arrow">▼</span>
  </button>
</div>

<style>
  .dpad {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    grid-template-areas:
      ".  up   ."
      "left center right"
      ".  down .";
    width: 120px;
    height: 120px;
    gap: 0;
  }

  .dpad-btn {
    background: var(--dpad-color);
    border: none;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 12px;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
  }

  .dpad-btn:active {
    background: #444;
    color: #999;
  }

  .dpad-center {
    grid-area: center;
    background: var(--dpad-color);
  }

  .up { grid-area: up; border-radius: 6px 6px 0 0; }
  .down { grid-area: down; border-radius: 0 0 6px 6px; }
  .left { grid-area: left; border-radius: 6px 0 0 6px; }
  .right { grid-area: right; border-radius: 0 6px 6px 0; }

  .arrow {
    pointer-events: none;
  }
</style>
