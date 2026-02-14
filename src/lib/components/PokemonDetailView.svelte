<script lang="ts">
  import { getPokemon } from '../stores/pokedex.svelte';
  import { getSelectedPokemonId } from '../stores/navigation.svelte';

  const pokemonId = getSelectedPokemonId();
  const pokemon = pokemonId ? getPokemon(pokemonId) : undefined;
</script>

{#if pokemon}
  <div class="detail-view">
    <div class="header">
      <div class="id">#{pokemon.id.toString().padStart(3, '0')}</div>
      <div class="name">{pokemon.name.toUpperCase()}</div>
    </div>

    <div class="sprite-container">
      <img
        src="/sprites/{pokemon.sprite}"
        alt={pokemon.name}
        class="sprite"
        on:error={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>

    <div class="types">
      {#each pokemon.types as type}
        <span class="type-badge">{type.toUpperCase()}</span>
      {/each}
    </div>

    {#if pokemon.caught && pokemon.catchRecord}
      <div class="catch-info">
        <div class="caught-label">CAUGHT!</div>
        <div class="caught-date">
          {new Date(pokemon.catchRecord.caughtAt).toLocaleDateString()}
        </div>
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
