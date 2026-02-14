/**
 * Sound service for playing Pokemon cries using Web Audio API.
 */

let audioContext: AudioContext | null = null;
const audioCache = new Map<number, AudioBuffer>();
let isInitialized = false;

/** Initialize audio context (call on user interaction) */
function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    console.log('[Sound] AudioContext created, state:', audioContext.state);
  }
  return audioContext;
}

/** Initialize audio system on first user interaction */
export async function initAudio(): Promise<void> {
  if (isInitialized) return;

  try {
    const context = getAudioContext();
    if (context.state === 'suspended') {
      await context.resume();
      console.log('[Sound] AudioContext resumed');
    }
    isInitialized = true;
    console.log('[Sound] Audio system initialized');
  } catch (error) {
    console.error('[Sound] Failed to initialize audio:', error);
  }
}

/** Load and cache a cry audio file */
async function loadCry(pokemonId: number): Promise<AudioBuffer> {
  // Check cache first
  if (audioCache.has(pokemonId)) {
    console.log('[Sound] Using cached cry for Pokemon', pokemonId);
    return audioCache.get(pokemonId)!;
  }

  try {
    // Use BASE_URL to handle GitHub Pages deployment path
    const basePath = import.meta.env.BASE_URL || '/';
    const url = `${basePath}cries/${pokemonId}.ogg`;
    console.log('[Sound] Fetching cry from:', url);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load cry for Pokemon ${pokemonId}: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    console.log('[Sound] Decoding audio data for Pokemon', pokemonId);
    const audioBuffer = await getAudioContext().decodeAudioData(arrayBuffer);

    // Cache for future use
    audioCache.set(pokemonId, audioBuffer);
    console.log('[Sound] Cached cry for Pokemon', pokemonId);
    return audioBuffer;
  } catch (error) {
    console.error(`[Sound] Error loading cry for Pokemon ${pokemonId}:`, error);
    throw error;
  }
}

/** Play a Pokemon's cry */
export async function playCry(pokemonId: number): Promise<void> {
  try {
    console.log('[Sound] Attempting to play cry for Pokemon', pokemonId);

    // Ensure audio is initialized
    await initAudio();

    const context = getAudioContext();
    console.log('[Sound] AudioContext state:', context.state);

    // Resume context if suspended (required after user interaction)
    if (context.state === 'suspended') {
      console.log('[Sound] Resuming suspended AudioContext');
      await context.resume();
    }

    const audioBuffer = await loadCry(pokemonId);

    // Create source node and connect to output
    const source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(context.destination);

    // Play the sound
    console.log('[Sound] Playing cry for Pokemon', pokemonId);
    source.start(0);
  } catch (error) {
    console.error('[Sound] Error playing cry:', error);
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
