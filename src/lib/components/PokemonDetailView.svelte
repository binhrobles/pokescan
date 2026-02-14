<script lang="ts">
  import { onMount } from 'svelte';
  import { getPokemon } from '../stores/pokedex.svelte';
  import { getSelectedPokemonId } from '../stores/navigation.svelte';
  import { fetchPokemonEnrichment, isOnline, type PokemonEnrichment } from '../services/pokeapi';
  import { getSpritePath } from '../utils/paths';

  const pokemonId = getSelectedPokemonId();
  const pokemon = pokemonId ? getPokemon(pokemonId) : undefined;

  let enrichment = $state<PokemonEnrichment | null>(null);
  let loading = $state(false);

  onMount(async () => {
    if (!pokemonId || !pokemon?.caught || !isOnline()) return;

    loading = true;
    enrichment = await fetchPokemonEnrichment(pokemonId);
    loading = false;
  });

  function formatCaughtDate(isoDate: string): string {
    const date = new Date(isoDate);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${month}/${day}/${year}`;
  }
</script>

{#if pokemon}
  <div class="detail-view" class:not-caught={!pokemon.caught}>
    {#if pokemon.caught}
      <!-- Top section: sprite (left) + stats (right) -->
      <div class="top-section">
        <div class="sprite-area">
          <img
            src={getSpritePath(pokemon.sprite)}
            alt={pokemon.name}
            class="sprite"
            on:error={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div class="number">No.{pokemon.id.toString().padStart(3, '0')}</div>
        </div>

        <div class="stats-area">
          <div class="stats-top">
            <div class="name">{pokemon.name.toUpperCase()}</div>
            <div class="type">{pokemon.types[0].toUpperCase()}</div>
          </div>
          <div class="stats-bottom">
            {#if enrichment}
              <div class="stat">HT {(enrichment.height / 10).toFixed(1)}m</div>
              <div class="stat">WT {(enrichment.weight / 10).toFixed(1)}kg</div>
            {/if}
            {#if pokemon.catchRecord?.caughtAt}
              <div class="stat">CT {formatCaughtDate(pokemon.catchRecord.caughtAt)}</div>
            {/if}
          </div>
        </div>
      </div>

      <!-- Divider with ornamental circles -->
      <div class="divider">
        <div class="circle"></div>
        <div class="line"></div>
        <div class="circle"></div>
      </div>

      <!-- Description section -->
      <div class="description-section">
        {#if enrichment}
          <div class="description">{enrichment.flavorText}</div>
        {:else if loading}
          <div class="loading">Loading...</div>
        {/if}
      </div>
    {:else}
      <!-- Not caught: centered sprite -->
      <div class="sprite-area centered">
        <img
          src={getSpritePath(pokemon.sprite)}
          alt={pokemon.name}
          class="sprite silhouette"
          on:error={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div class="number">No.{pokemon.id.toString().padStart(3, '0')}</div>
      </div>
    {/if}
  </div>
{:else}
  <div class="detail-view">
    <div class="error">POKéMON NOT FOUND</div>
  </div>
{/if}

<style>
  .detail-view {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 12px;
    gap: 0;
  }

  /* Not caught view - center everything */
  .detail-view.not-caught {
    justify-content: center;
    align-items: center;
  }

  /* Top Section: Sprite (left) + Stats (right) */
  .top-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding-bottom: 8px;
  }

  /* Sprite Area (left quadrant) */
  .sprite-area {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    padding-right: 4px;
  }

  .sprite-area.centered {
    align-items: center;
    justify-content: center;
  }

  .sprite {
    width: 100%;
    max-width: 96px;
    height: auto;
    image-rendering: pixelated;
  }

  .sprite.silhouette {
    filter: brightness(0);
    opacity: 0.6;
  }

  .number {
    font-size: 9px;
    line-height: 1.2;
    opacity: 0.8;
  }

  /* Stats Area (right quadrant) */
  .stats-area {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-left: 4px;
  }

  .stats-top {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .stats-bottom {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .name {
    font-size: 13px;
    line-height: 1.3;
  }

  .type {
    font-size: 10px;
    line-height: 1.2;
  }

  .stat {
    font-size: 9px;
    line-height: 1.3;
  }

  /* Divider with ornamental circles */
  .divider {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 0;
  }

  .circle {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: transparent;
    flex-shrink: 0;
  }

  .line {
    flex: 1;
    height: 2px;
    background-color: var(--screen-text);
  }

  /* Description Section (bottom half) */
  .description-section {
    flex: 1;
    display: flex;
    align-items: flex-start;
    padding-top: 8px;
  }

  .description {
    font-size: 9px;
    line-height: 1.6;
    text-align: left;
  }

  .loading {
    font-size: 9px;
    opacity: 0.5;
  }

  .error {
    font-size: 12px;
    text-align: center;
    margin: auto;
  }

  /* Responsive: Larger screens (iPhone 13 Mini and similar) */
  @media (min-width: 375px) {
    .detail-view {
      padding: 14px;
    }

    .top-section {
      gap: 10px;
      padding-bottom: 10px;
    }

    .sprite {
      max-width: 110px;
    }

    .number {
      font-size: 10px;
    }

    .name {
      font-size: 15px;
    }

    .type {
      font-size: 11px;
    }

    .stat {
      font-size: 10px;
    }

    .circle {
      width: 7px;
      height: 7px;
    }

    .description {
      font-size: 10px;
      line-height: 1.7;
    }

    .loading {
      font-size: 10px;
    }

    .error {
      font-size: 13px;
    }
  }

  /* Extra space for larger devices */
  @media (min-width: 420px) {
    .detail-view {
      padding: 16px;
    }

    .top-section {
      gap: 12px;
      padding-bottom: 12px;
    }

    .sprite {
      max-width: 120px;
    }

    .number {
      font-size: 11px;
    }

    .name {
      font-size: 17px;
    }

    .type {
      font-size: 12px;
    }

    .stat {
      font-size: 11px;
    }

    .circle {
      width: 8px;
      height: 8px;
    }

    .description {
      font-size: 11px;
    }
  }
</style>
