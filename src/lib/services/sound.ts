/**
 * Sound service for playing Pokemon cries using Web Audio API.
 */

let audioContext: AudioContext | null = null;
const audioCache = new Map<number, AudioBuffer>();

/** Initialize audio context (call on user interaction) */
function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

/** Load and cache a cry audio file */
async function loadCry(pokemonId: number): Promise<AudioBuffer> {
  // Check cache first
  if (audioCache.has(pokemonId)) {
    return audioCache.get(pokemonId)!;
  }

  try {
    const response = await fetch(`/cries/${pokemonId}.ogg`);
    if (!response.ok) {
      throw new Error(`Failed to load cry for Pokemon ${pokemonId}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await getAudioContext().decodeAudioData(arrayBuffer);

    // Cache for future use
    audioCache.set(pokemonId, audioBuffer);
    return audioBuffer;
  } catch (error) {
    console.error(`Error loading cry for Pokemon ${pokemonId}:`, error);
    throw error;
  }
}

/** Play a Pokemon's cry */
export async function playCry(pokemonId: number): Promise<void> {
  try {
    const context = getAudioContext();

    // Resume context if suspended (required after user interaction)
    if (context.state === 'suspended') {
      await context.resume();
    }

    const audioBuffer = await loadCry(pokemonId);

    // Create source node and connect to output
    const source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(context.destination);

    // Play the sound
    source.start(0);
  } catch (error) {
    console.error('Error playing cry:', error);
    // Don't throw - we don't want sound errors to break the app
  }
}

/** Preload a cry into the cache (optional optimization) */
export async function preloadCry(pokemonId: number): Promise<void> {
  try {
    await loadCry(pokemonId);
  } catch (error) {
    // Silently fail - preloading is optional
  }
}
