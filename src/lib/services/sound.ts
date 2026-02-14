/**
 * Sound service for playing Pokemon cries using Web Audio API.
 */

import { getSetting, setSetting } from './storage';

const DEFAULT_CRY_VOLUME = 0.3;

let audioContext: AudioContext | null = null;
let gainNode: GainNode | null = null;
const audioCache = new Map<number, AudioBuffer>();
let isInitialized = false;
let cryVolume = DEFAULT_CRY_VOLUME;

/** Initialize audio context (call on user interaction) */
function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    console.log('[Sound] AudioContext created, state:', audioContext.state);
  }
  return audioContext;
}

/** Get or create the gain node for volume control */
function getGainNode(): GainNode {
  if (!gainNode) {
    const context = getAudioContext();
    gainNode = context.createGain();
    gainNode.gain.value = cryVolume;
    gainNode.connect(context.destination);
    console.log('[Sound] GainNode created, volume:', cryVolume);
  }
  return gainNode;
}

/** Initialize audio system on first user interaction */
export async function initAudio(): Promise<void> {
  if (isInitialized) return;

  try {
    // Load persisted volume before creating audio nodes
    const saved = await getSetting<number>('cryVolume');
    if (saved !== undefined) {
      cryVolume = saved;
      console.log('[Sound] Loaded saved volume:', cryVolume);
    }

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

    // Create source node and connect through gain node for volume control
    const source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(getGainNode());

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

/** Get the current cry volume (0.0 to 1.0) */
export function getCryVolume(): number {
  return cryVolume;
}

/** Set the cry volume (0.0 to 1.0) and persist to storage */
export async function setCryVolume(volume: number): Promise<void> {
  cryVolume = Math.max(0, Math.min(1, volume));
  if (gainNode) {
    gainNode.gain.value = cryVolume;
  }
  await setSetting('cryVolume', cryVolume);
  console.log('[Sound] Volume set to', cryVolume);
}
