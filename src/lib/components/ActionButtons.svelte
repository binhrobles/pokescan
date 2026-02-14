<script lang="ts">
  import type { InputAction } from '../types/pokemon';

  let { onInput }: { onInput: (action: InputAction) => void } = $props();
</script>

<div class="action-buttons">
  <button class="btn btn-b" onclick={() => onInput('b-button')} aria-label="B Button">
    B
  </button>
  <button class="btn btn-a" onclick={() => onInput('a-button')} aria-label="A Button">
    A
  </button>
</div>

<style>
  .action-buttons {
    display: flex;
    gap: 16px;
    align-items: center;
    /* Flat horizontal layout */
  }

  .btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: none;
    font-family: inherit;
    font-size: 10px;
    font-weight: bold;
    cursor: pointer;
    box-shadow:
      0 3px 0 rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    -webkit-tap-highlight-color: transparent;
    transition: box-shadow 0.05s, transform 0.05s;
  }

  .btn:active {
    box-shadow:
      0 1px 0 rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    transform: translateY(2px);
  }

  .btn-a {
    background: var(--dpad-color);
    color: #666;
  }

  .btn-b {
    background: var(--dpad-color);
    color: #666;
  }
</style>
