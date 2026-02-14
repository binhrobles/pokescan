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
    color: #555;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 12px;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
    position: relative;

    /* Physical depth and dimension */
    box-shadow:
      0 3px 0 rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      inset 0 -1px 0 rgba(0, 0, 0, 0.2);

    transition: all 0.05s ease;
  }

  .dpad-btn:active {
    background: #1a1a1a;
    color: #777;
    box-shadow:
      0 1px 0 rgba(0, 0, 0, 0.4),
      inset 0 1px 2px rgba(0, 0, 0, 0.3);
    transform: translateY(2px);
  }

  .dpad-center {
    grid-area: center;
    background: var(--dpad-color);

    /* Center hub - match directional buttons (raised, not recessed) */
    box-shadow:
      0 3px 0 rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      inset 0 -1px 0 rgba(0, 0, 0, 0.2);

    border-radius: 4px;
  }

  .up { grid-area: up; border-radius: 6px 6px 0 0; }
  .down { grid-area: down; border-radius: 0 0 6px 6px; }
  .left { grid-area: left; border-radius: 6px 0 0 6px; }
  .right { grid-area: right; border-radius: 0 6px 6px 0; }

  .arrow {
    pointer-events: none;
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);
  }
</style>
