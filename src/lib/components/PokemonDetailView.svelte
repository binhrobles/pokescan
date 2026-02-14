<script lang="ts">
  import { onMount } from 'svelte';
  import { getPokemon } from '../stores/pokedex.svelte';
  import { getSelectedPokemonId } from '../stores/navigation.svelte';
  import { fetchPokemonEnrichment, isOnline, type PokemonEnrichment } from '../services/pokeapi';

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
</script>

{#if pokemon}
  <div class="detail-view">
    <!-- Top Header: Number and Name -->
    <div class="header">
      <div class="id">#{pokemon.id.toString().padStart(3, '0')}</div>
      {#if pokemon.caught}
        <div class="name">{pokemon.name.toUpperCase()}</div>
      {:else}
        <div class="name unknown">???</div>
      {/if}
    </div>

    <!-- Middle Section: Sprite (left) | Details Screen (right) -->
    <div class="middle-section">
      <div class="sprite-column">
        <img
          src="/sprites/{pokemon.sprite}"
          alt={pokemon.name}
          class="sprite"
          class:silhouette={!pokemon.caught}
          on:error={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      {#if pokemon.caught}
        <div class="details-screen">
          <!-- Types -->
          <div class="detail-row">
            <div class="detail-label">TYPE</div>
            <div class="detail-value">
              {pokemon.types.join(' / ').toUpperCase()}
            </div>
          </div>

          <!-- Stats from enrichment -->
          {#if enrichment}
            <div class="detail-row">
              <div class="detail-label">HT</div>
              <div class="detail-value">{(enrichment.height / 10).toFixed(1)}m</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">WT</div>
              <div class="detail-value">{(enrichment.weight / 10).toFixed(1)}kg</div>
            </div>
          {/if}

          <!-- Catch time -->
          {#if pokemon.catchRecord}
            <div class="detail-row">
              <div class="detail-label">CAUGHT</div>
              <div class="detail-value">
                {new Date(pokemon.catchRecord.caughtAt).toLocaleDateString()}
              </div>
            </div>
          {/if}
        </div>
      {:else}
        <div class="details-screen not-caught-screen">
          <div class="not-caught">NOT CAUGHT</div>
        </div>
      {/if}
    </div>

    <!-- Bottom Section: Description -->
    <div class="description-section">
      {#if pokemon.caught && enrichment}
        <div class="description">{enrichment.flavorText}</div>
      {:else if loading}
        <div class="loading">Loading...</div>
      {:else if !pokemon.caught}
        <div class="placeholder-description">Catch this Pokémon to view details.</div>
      {/if}
    </div>
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
    display: grid;
    grid-template-rows: auto 1fr auto;
    padding: 12px;
    gap: 12px;
  }

  /* Top Header */
  .header {
    text-align: center;
  }

  .id {
    font-size: 10px;
    opacity: 0.7;
  }

  .name {
    font-size: 14px;
    margin-top: 4px;
  }

  .name.unknown {
    opacity: 0.5;
  }

  /* Middle Section: Sprite + Details */
  .middle-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    align-items: center;
  }

  .sprite-column {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sprite {
    width: 100%;
    max-width: 120px;
    height: auto;
    image-rendering: pixelated;
  }

  .sprite.silhouette {
    filter: brightness(0);
    opacity: 0.6;
  }

  /* Details Screen - Pixel Beveled */
  .details-screen {
    background: rgba(15, 56, 15, 0.2);
    border: 2px solid var(--screen-text);
    border-radius: 4px;
    padding: 8px;
    box-shadow:
      inset 2px 2px 0 rgba(255, 255, 255, 0.2),
      inset -2px -2px 0 rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-height: 100px;
  }

  .details-screen.not-caught-screen {
    align-items: center;
    justify-content: center;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 8px;
  }

  .detail-label {
    opacity: 0.7;
    font-weight: bold;
  }

  .detail-value {
    text-align: right;
  }

  .not-caught {
    font-size: 10px;
    opacity: 0.5;
  }

  /* Bottom Section: Description */
  .description-section {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
  }

  .description {
    font-size: 9px;
    line-height: 1.5;
    text-align: center;
  }

  .placeholder-description {
    font-size: 8px;
    opacity: 0.5;
    text-align: center;
  }

  .loading {
    font-size: 8px;
    opacity: 0.5;
  }

  .error {
    font-size: 10px;
    text-align: center;
    margin: auto;
  }
</style>
