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
    <div class="header">
      <div class="id">#{pokemon.id.toString().padStart(3, '0')}</div>
      {#if pokemon.caught}
        <div class="name">{pokemon.name.toUpperCase()}</div>
      {:else}
        <div class="name unknown">???</div>
      {/if}
    </div>

    <div class="sprite-container">
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
      <div class="types">
        {#each pokemon.types as type}
          <span class="type-badge">{type.toUpperCase()}</span>
        {/each}
      </div>
    {/if}

    {#if enrichment}
      <div class="enrichment">
        <div class="genus">{enrichment.genus}</div>
        <div class="flavor-text">"{enrichment.flavorText}"</div>
        <div class="stats">
          HT: {(enrichment.height / 10).toFixed(1)}m · WT: {(enrichment.weight / 10).toFixed(1)}kg
        </div>
      </div>
    {:else if loading}
      <div class="enrichment">
        <div class="loading">Loading...</div>
      </div>
    {/if}

    {#if pokemon.caught && pokemon.catchRecord}
      <div class="catch-info">
        <div class="caught-label">CAUGHT!</div>
        <div class="caught-date">
          {new Date(pokemon.catchRecord.caughtAt).toLocaleDateString()}
          {' '}
          {new Date(pokemon.catchRecord.caughtAt).toLocaleTimeString()}
        </div>
        {#if pokemon.catchRecord.barcodeContent}
          <div class="barcode">
            BARCODE: {pokemon.catchRecord.barcodeContent.substring(0, 20)}{pokemon.catchRecord.barcodeContent.length > 20 ? '...' : ''}
          </div>
        {/if}
        {#if pokemon.catchRecord.location}
          <div class="location">
            LOC: {pokemon.catchRecord.location.lat.toFixed(4)}, {pokemon.catchRecord.location.lng.toFixed(4)}
          </div>
        {/if}
      </div>
    {:else}
      <div class="catch-info">
        <div class="not-caught">NOT CAUGHT</div>
      </div>
    {/if}

    <div class="hint">Press B to go back</div>
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
    align-items: center;
    padding: 12px;
    gap: 8px;
  }

  .header {
    text-align: center;
  }

  .id {
    font-size: 10px;
    opacity: 0.7;
  }

  .name {
    font-size: 12px;
    margin-top: 4px;
  }

  .name.unknown {
    opacity: 0.5;
  }

  .sprite-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 96px;
  }

  .sprite {
    width: 96px;
    height: 96px;
    image-rendering: pixelated;
  }

  .sprite.silhouette {
    filter: brightness(0);
    opacity: 0.6;
  }

  .types {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .type-badge {
    font-size: 8px;
    padding: 4px 8px;
    background: rgba(15, 56, 15, 0.3);
    border-radius: 4px;
  }

  .enrichment {
    text-align: center;
    margin-top: 8px;
    max-width: 100%;
  }

  .genus {
    font-size: 8px;
    opacity: 0.7;
    margin-bottom: 4px;
  }

  .flavor-text {
    font-size: 6px;
    line-height: 1.4;
    opacity: 0.8;
    margin-bottom: 4px;
    padding: 0 4px;
  }

  .stats {
    font-size: 6px;
    opacity: 0.6;
  }

  .loading {
    font-size: 6px;
    opacity: 0.5;
  }

  .catch-info {
    text-align: center;
    margin-top: 8px;
  }

  .caught-label {
    font-size: 10px;
  }

  .caught-date {
    font-size: 8px;
    margin-top: 4px;
    opacity: 0.7;
  }

  .barcode {
    font-size: 6px;
    margin-top: 4px;
    opacity: 0.6;
    word-break: break-all;
  }

  .location {
    font-size: 6px;
    margin-top: 4px;
    opacity: 0.6;
  }

  .not-caught {
    font-size: 10px;
    opacity: 0.5;
  }

  .hint {
    font-size: 6px;
    opacity: 0.5;
    margin-top: auto;
  }

  .error {
    font-size: 10px;
    text-align: center;
    margin: auto;
  }
</style>
