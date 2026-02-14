<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="screen-container">
  <div class="screen-bezel">
    <!-- Decorative vent lines (top-left) -->
    <div class="vent-lines top-left">
      <div class="vent-line"></div>
      <div class="vent-line"></div>
      <div class="vent-line"></div>
    </div>

    <!-- Decorative screw holes -->
    <div class="screw top-left"></div>
    <div class="screw top-right"></div>
    <div class="screw bottom-left"></div>
    <div class="screw bottom-right"></div>

    <div class="screen">
      {@render children()}
    </div>
  </div>

  <!-- Indicator LEDs below screen -->
  <div class="bottom-indicators">
    <div class="led red"></div>
    <div class="led blue"></div>
  </div>
</div>

<style>
  .screen-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    width: 100%;
    max-width: 340px;
  }

  .screen-bezel {
    background: linear-gradient(135deg, #f8f8f8 0%, #d8d8d8 100%);
    border-radius: 16px;
    padding: 16px;
    width: 100%;
    position: relative;
    box-shadow:
      /* More pronounced raised bezel */
      0 3px 6px rgba(0, 0, 0, 0.3),
      inset 0 2px 4px rgba(255, 255, 255, 0.9),
      inset 0 -2px 6px rgba(0, 0, 0, 0.15);
    border: 2px solid #c0c0c0;
  }

  /* Decorative vent lines */
  .vent-lines {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .vent-lines.top-left {
    top: 8px;
    left: 8px;
  }

  .vent-line {
    width: 16px;
    height: 1px;
    background: rgba(0, 0, 0, 0.2);
    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  /* Decorative screws in corners */
  .screw {
    position: absolute;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #888, #444);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
  }

  .screw::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 3px;
    height: 0.5px;
    background: rgba(0, 0, 0, 0.4);
  }

  .screw.top-left { top: 6px; left: 6px; }
  .screw.top-right { top: 6px; right: 6px; }
  .screw.bottom-left { bottom: 6px; left: 6px; }
  .screw.bottom-right { bottom: 6px; right: 6px; }

  .screen {
    background: var(--screen-bg);
    border-radius: 8px;
    width: 100%;
    aspect-ratio: 1;
    overflow: hidden;
    position: relative;
    image-rendering: pixelated;
    box-shadow:
      /* Deeper screen inset */
      inset 0 0 24px rgba(15, 56, 15, 0.4),
      inset 0 6px 12px rgba(0, 0, 0, 0.4),
      inset 0 0 0 2px rgba(0, 0, 0, 0.15);
  }

  /* Bottom indicator LEDs */
  .bottom-indicators {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .led {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.3);
    box-shadow:
      inset 0 1px 2px rgba(0, 0, 0, 0.3),
      0 0 4px currentColor;
  }

  .led.red {
    background: radial-gradient(circle at 35% 35%, #ff6b6b, #c92a2a);
    color: rgba(255, 107, 107, 0.6);
  }

  .led.blue {
    background: radial-gradient(circle at 35% 35%, #4dabf7, #1971c2);
    color: rgba(77, 171, 247, 0.6);
  }
</style>
