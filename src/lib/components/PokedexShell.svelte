<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { InputAction } from '../types/pokemon';
  import DPad from './DPad.svelte';
  import ActionButtons from './ActionButtons.svelte';
  import CenterScreen from './CenterScreen.svelte';

  let {
    children,
    onInput,
  }: {
    children: Snippet;
    onInput: (action: InputAction) => void;
  } = $props();
</script>

<div class="shell">
  <!-- Top section: indicator light + decoration -->
  <div class="shell-top">
    <div class="indicator-bezel">
      <!-- Big blue light - centered vertically -->
      <div class="indicator-big">
        <div class="indicator-shine"></div>
      </div>

      <!-- Small colored indicators - positioned at top -->
      <div class="indicator-small-cluster">
        <div class="indicator-small red"></div>
        <div class="indicator-small yellow"></div>
        <div class="indicator-small green"></div>
      </div>
    </div>
  </div>

  <!-- Center: the screen -->
  <div class="screen-area">
    <CenterScreen>
      {@render children()}
    </CenterScreen>
  </div>

  <!-- Bottom: controls -->
  <div class="controls">
    <div class="controls-left">
      <DPad {onInput} />
    </div>
    <div class="controls-right">
      <ActionButtons {onInput} />
    </div>
  </div>
</div>

<style>
  .shell {
    /* Textured plastic background with subtle grain and depth */
    background:
      /* Subtle noise texture for plastic grain */
      repeating-linear-gradient(
        0deg,
        transparent 0px,
        rgba(0, 0, 0, 0.03) 1px,
        transparent 2px
      ),
      repeating-linear-gradient(
        90deg,
        transparent 0px,
        rgba(0, 0, 0, 0.03) 1px,
        transparent 2px
      ),
      /* Subtle radial gradient for dimensional depth */
      radial-gradient(
        ellipse at 40% 30%,
        var(--pokedex-red-light) 0%,
        var(--pokedex-red) 40%,
        var(--pokedex-red-dark) 100%
      );

    border-radius: 0;
    width: 100%;
    max-width: 380px;
    height: 100%;
    max-height: 100dvh;
    display: flex;
    flex-direction: column;
    padding: 0 16px 16px;
    gap: 12px;
    box-shadow:
      /* Top highlight - molded plastic edge catch light */
      inset 0 2px 1px rgba(255, 255, 255, 0.15),
      inset 0 -1px 1px rgba(0, 0, 0, 0.2),
      /* Outer shadow for depth */
      0 4px 12px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    position: relative;
  }

  /* Optional: Add a subtle texture overlay for more pronounced grain */
  .shell::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      repeating-linear-gradient(
        45deg,
        transparent 0px,
        rgba(255, 255, 255, 0.01) 1px,
        transparent 2px
      );
    pointer-events: none;
    mix-blend-mode: overlay;
  }

  /* Top indicator lights */
  .shell-top {
    margin: 0 -16px 16px;
    flex-shrink: 0;
  }

  /* Raised bezel panel for indicators - full width, flush with edges */
  .indicator-bezel {
    background: linear-gradient(135deg,
      rgba(220, 38, 38, 0.15) 0%,
      rgba(220, 38, 38, 0.05) 50%,
      rgba(0, 0, 0, 0.1) 100%
    );
    border-radius: 0;
    padding: 8px 16px;
    width: 100%;
    box-shadow:
      /* Raised appearance */
      0 3px 6px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.15),
      inset 0 -1px 0 rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
  }

  /* Small colored indicators - positioned to the right of big blue indicator */
  .indicator-small-cluster {
    display: flex;
    align-items: center;
    gap: 8px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 72px; /* 48px (big indicator width) + 12px (gap) + 12px (spacing) */
  }

  .indicator-big {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #60a5fa, #2563eb, #1e3a5f);
    border: 4px solid #e5e7eb;
    box-shadow:
      0 0 8px rgba(96, 165, 250, 0.5),
      inset 0 -2px 4px rgba(0, 0, 0, 0.3);
    position: relative;
  }

  .indicator-shine {
    position: absolute;
    top: 8px;
    left: 10px;
    width: 14px;
    height: 10px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
  }

  .indicator-small {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }

  .indicator-small.red { background: #ef4444; box-shadow: 0 0 4px rgba(239, 68, 68, 0.5); }
  .indicator-small.yellow { background: #eab308; box-shadow: 0 0 4px rgba(234, 179, 8, 0.5); }
  .indicator-small.green { background: #22c55e; box-shadow: 0 0 4px rgba(34, 197, 94, 0.5); }

  /* Screen area — centered, not flex-growing */
  .screen-area {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  /* Controls */
  .controls {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 4px 24px;
  }

  .controls-left,
  .controls-right {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
