<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { getPokemon } from '../stores/pokedex.svelte';
  import {
    getSelectedPokemonId,
    getCatchAnimConfirmed,
    resetCatchAnimConfirmed,
    goToDetail,
  } from '../stores/navigation.svelte';
  import { getSpritePath } from '../utils/paths';

  type Phase =
    | 'pokeball'
    | 'flash'
    | 'shrink'
    | 'green'
    | 'silhouette'
    | 'reveal'
    | 'waiting'
    | 'drop';

  let phase = $state<Phase>('pokeball');
  const timeouts: number[] = [];

  const pokemonId = getSelectedPokemonId();
  const pokemon = pokemonId ? getPokemon(pokemonId) : undefined;

  const showPokeball = $derived(
    phase === 'pokeball' || phase === 'flash' || phase === 'shrink',
  );
  const isGreen = $derived(
    phase === 'green' ||
      phase === 'silhouette' ||
      phase === 'reveal' ||
      phase === 'waiting' ||
      phase === 'drop',
  );
  const showSprite = $derived(
    phase === 'silhouette' ||
      phase === 'reveal' ||
      phase === 'waiting' ||
      phase === 'drop',
  );
  const spriteRevealed = $derived(
    phase === 'reveal' || phase === 'waiting' || phase === 'drop',
  );
  const showText = $derived(phase === 'waiting' || phase === 'drop');

  function schedule(fn: () => void, delay: number) {
    timeouts.push(setTimeout(fn, delay) as unknown as number);
  }

  onMount(() => {
    let elapsed = 400;

    // Flash: pokeball flashes 3 times
    schedule(() => {
      phase = 'flash';
    }, elapsed);
    elapsed += 1500;

    // Shrink: pokeball shrinks away
    schedule(() => {
      phase = 'shrink';
    }, elapsed);
    elapsed += 700;

    // Green: background transitions to green
    schedule(() => {
      phase = 'green';
    }, elapsed);
    elapsed += 600;

    // Silhouette: black sprite fades in
    schedule(() => {
      phase = 'silhouette';
    }, elapsed);
    elapsed += 800;

    // Reveal: sprite gains color
    schedule(() => {
      phase = 'reveal';
    }, elapsed);
    elapsed += 2000;

    // Waiting: ready for A press
    schedule(() => {
      phase = 'waiting';
    }, elapsed);
  });

  // Watch for A button press
  $effect(() => {
    const confirmed = getCatchAnimConfirmed();
    if (confirmed) {
      resetCatchAnimConfirmed();
      if (phase === 'waiting') {
        phase = 'drop';
        schedule(() => {
          if (pokemonId) {
            goToDetail(pokemonId, 'pokedex');
          }
        }, 600);
      }
    }
  });

  onDestroy(() => {
    for (const t of timeouts) clearTimeout(t);
    resetCatchAnimConfirmed();
  });
</script>

<div class="catch-container" class:green={isGreen}>
  {#if showPokeball}
    <div
      class="pokeball"
      class:flash={phase === 'flash'}
      class:shrink={phase === 'shrink'}
    >
      <div class="top-half"></div>
      <div class="divider-line"></div>
      <div class="center-button"></div>
    </div>
  {/if}

  {#if showSprite && pokemon}
    <div
      class="sprite-wrap"
      class:revealed={spriteRevealed}
      class:drop={phase === 'drop'}
    >
      {#if showText}
        <div class="banner">You caught</div>
      {/if}
      <img
        src={getSpritePath(pokemon.sprite)}
        alt={pokemon.name}
        class="sprite"
      />
      {#if showText}
        <div class="pokemon-name">{pokemon.name.toUpperCase()}</div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .catch-container {
    width: 100%;
    height: 100%;
    background: black;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: background-color 0.6s ease;
  }

  .catch-container.green {
    background: var(--screen-bg);
  }

  /* Pokeball — matches scanner overlay in detected state */
  .pokeball {
    width: 120px;
    height: 120px;
    border: 4px solid #dc2626;
    border-radius: 50%;
    position: relative;
    overflow: hidden;
    box-shadow:
      0 0 30px rgba(220, 38, 38, 0.8),
      inset 0 0 20px rgba(220, 38, 38, 0.5);
  }

  .pokeball.flash {
    animation: pokeballFlash 1.5s ease-in-out;
  }

  .pokeball.shrink {
    animation: pokeballShrink 0.6s ease-in forwards;
  }

  .top-half {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: #dc2626;
    z-index: 1;
  }

  .divider-line {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 4px;
    background: #dc2626;
    transform: translateY(-50%);
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.3);
    z-index: 2;
  }

  .center-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 24px;
    background: #dc2626;
    border: 4px solid rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    box-shadow:
      inset 0 0 8px rgba(0, 0, 0, 0.3),
      0 0 15px rgba(220, 38, 38, 0.6);
    z-index: 3;
  }

  @keyframes pokeballFlash {
    0%,
    100% {
      opacity: 1;
    }
    10% {
      opacity: 0.1;
    }
    20% {
      opacity: 1;
    }
    43% {
      opacity: 0.1;
    }
    56% {
      opacity: 1;
    }
    76% {
      opacity: 0.1;
    }
    90% {
      opacity: 1;
    }
  }

  @keyframes pokeballShrink {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(0);
      opacity: 0;
    }
  }

  /* Sprite */
  .sprite-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    animation: spriteAppear 0.8s ease-in forwards;
    transition: transform 0.5s ease-in;
  }

  .sprite-wrap.drop {
    transform: translateY(200%);
  }

  .sprite {
    width: 96px;
    height: 96px;
    image-rendering: pixelated;
    filter: brightness(0);
    transition: filter 2s ease-out;
  }

  .sprite-wrap.revealed .sprite {
    filter: brightness(1);
  }

  .banner {
    font-size: 10px;
    color: var(--screen-text);
    animation: textFadeIn 0.6s ease-out forwards;
  }

  .pokemon-name {
    font-size: 13px;
    color: var(--screen-text);
    animation: textFadeIn 0.6s ease-out forwards;
  }

  @keyframes spriteAppear {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes textFadeIn {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
