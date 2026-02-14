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
    <div class="indicator-cluster">
      <div class="indicator-big">
        <div class="indicator-shine"></div>
      </div>
      <div class="indicator-small red"></div>
      <div class="indicator-small yellow"></div>
      <div class="indicator-small green"></div>
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
    background: var(--pokedex-red);
    border-radius: 0;
    width: 100%;
    max-width: 380px;
    height: 100%;
    max-height: 100dvh;
    display: flex;
    flex-direction: column;
    padding: 16px;
    gap: 12px;
    box-shadow:
      inset 0 1px 0 var(--pokedex-red-light),
      0 4px 12px rgba(0, 0, 0, 0.5);
    overflow: hidden;
  }

  /* Top indicator lights */
  .shell-top {
    padding: 8px 4px;
    flex-shrink: 0;
  }

  .indicator-cluster {
    display: flex;
    align-items: center;
    gap: 8px;
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
