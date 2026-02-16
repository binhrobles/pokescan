<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { BarcodeDetector } from 'barcode-detector/pure';

  interface ScannerViewProps {
    onDetect: (barcodeContent: string) => void;
    onCatch: () => void;
  }

  let { onDetect, onCatch }: ScannerViewProps = $props();

  let videoElement: HTMLVideoElement | undefined = $state();
  let detected = $state(false);
  let catching = $state(false);
  let catchInProgress = $state(false);
  let error = $state<string | null>(null);
  let hasCamera = $state(false);
  let cameraReady = $state(false);
  let autoCatchTimeout: number | undefined;
  let scanInterval: number | undefined;
  let mediaStream: MediaStream | undefined;

  onMount(async () => {
    if (!videoElement) {
      error = 'Video element not ready';
      return;
    }

    try {
      // Request camera access
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      videoElement.srcObject = mediaStream;
      await videoElement.play();
      hasCamera = true;

      // Wait for the video stream to fully initialize to prevent visual glitches
      setTimeout(() => {
        cameraReady = true;
      }, 200);

      // Create barcode detector with all formats supported
      const detector = new BarcodeDetector();

      // Scan for barcodes every 200ms
      scanInterval = setInterval(async () => {
        if (!videoElement || videoElement.readyState < 2) return;

        try {
          const barcodes = await detector.detect(videoElement);
          if (barcodes.length > 0) {
            const result = barcodes[0];

            // Barcode is in focus - set detected state
            detected = true;
            onDetect(result.rawValue);

            // Only start catch process once per detection
            if (catchInProgress) return;
            catchInProgress = true;

            // Auto-catch after delay (enough time to see the red pokeball animation)
            autoCatchTimeout = setTimeout(() => {
              // Start catch animation
              catching = true;

              // After animation completes (600ms), call onCatch
              setTimeout(() => {
                catching = false;
                detected = false;
                catchInProgress = false;
                onCatch();
              }, 600);
            }, 800) as unknown as number;
          }
        } catch {
          // Detection can fail on individual frames; ignore and retry
        }
      }, 200) as unknown as number;
    } catch (err) {
      console.error('Scanner error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to start scanner';

      // Check specific error types
      if (errorMsg.includes('Permission') || errorMsg.includes('NotAllowedError')) {
        error = 'Camera permission denied. Please allow camera access and reload.';
      } else if (errorMsg.includes('NotFoundError') || errorMsg.includes('no camera')) {
        error = 'No camera found. Please check your device has a camera.';
      } else {
        error = errorMsg;
      }
    }
  });

  onDestroy(() => {
    if (autoCatchTimeout) {
      clearTimeout(autoCatchTimeout);
    }
    if (scanInterval) {
      clearInterval(scanInterval);
    }
    // Stop all camera tracks
    if (mediaStream) {
      for (const track of mediaStream.getTracks()) {
        track.stop();
      }
    }
  });
</script>

<div class="scanner-container">
  {#if error}
    <div class="error-message">
      <div class="error-title">SCANNER ERROR</div>
      <div class="error-text">{error}</div>
      {#if !hasCamera}
        <div class="error-hint">Please enable camera access</div>
      {/if}
    </div>
  {:else if !cameraReady}
    <div class="loading-message">
      <div class="loading-text">BOOTING...</div>
    </div>
  {/if}
  <video bind:this={videoElement} class="video-feed" class:ready={cameraReady} playsinline></video>
  <div class="pokeball-overlay" class:detected class:catching class:ready={cameraReady}>
    <div class="top-half"></div>
    <div class="divider-line"></div>
    <div class="center-button"></div>
  </div>
</div>

<style>
  .scanner-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  .video-feed {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: contrast(1.1) saturate(0.9);
    opacity: 0;
    transition: opacity 0.3s ease-in;
  }

  .video-feed.ready {
    opacity: 1;
  }

  .pokeball-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    height: 120px;
    border: 4px solid rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.3);
    pointer-events: none;
    transition: all 0.2s ease-out;
    overflow: hidden;
    opacity: 0;
  }

  .pokeball-overlay.ready {
    opacity: 1;
    transition: opacity 0.3s ease-in 0.1s;
  }

  /* Top semicircle (pokeball top half) */
  .top-half {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: transparent;
    transition: background 0.2s ease-out;
    z-index: 1;
  }

  /* Horizontal divider line through center (Pokéball style) */
  .divider-line {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 4px;
    background: rgba(255, 255, 255, 0.8);
    transform: translateY(-50%);
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.3);
    z-index: 2;
  }

  /* Center button */
  .center-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 24px;
    background: white;
    border: 4px solid rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.2);
    z-index: 3;
    transition: all 0.2s ease-out;
  }

  /* Red flash on barcode detection */
  .pokeball-overlay.detected {
    border-color: #dc2626;
    box-shadow:
      0 0 30px rgba(220, 38, 38, 0.8),
      inset 0 0 20px rgba(220, 38, 38, 0.5);
    animation: pulse 0.3s ease-out;
  }

  .pokeball-overlay.detected .top-half {
    background: #dc2626;
  }

  .pokeball-overlay.detected .divider-line {
    background: #dc2626;
  }

  /* Catching animation */
  .pokeball-overlay.catching .center-button {
    animation: catchPulse 0.6s ease-out;
  }

  @keyframes pulse {
    0%,
    100% {
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      transform: translate(-50%, -50%) scale(1.1);
    }
  }

  @keyframes catchPulse {
    0% {
      transform: translate(-50%, -50%) scale(1);
      background: white;
      box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.2);
    }
    30% {
      transform: translate(-50%, -50%) scale(1.3);
      background: white;
    }
    60% {
      transform: translate(-50%, -50%) scale(1.1);
      background: #dc2626;
      box-shadow:
        inset 0 0 8px rgba(0, 0, 0, 0.3),
        0 0 20px rgba(220, 38, 38, 0.8);
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      background: #dc2626;
      box-shadow:
        inset 0 0 8px rgba(0, 0, 0, 0.3),
        0 0 15px rgba(220, 38, 38, 0.6);
    }
  }

  .error-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    text-align: center;
    background: var(--screen-bg);
    padding: 16px;
    border: 2px solid var(--screen-text);
    max-width: 80%;
  }

  .error-title {
    font-size: 12px;
    margin-bottom: 8px;
    color: var(--screen-text);
  }

  .error-text {
    font-size: 8px;
    margin-bottom: 8px;
    color: var(--screen-text);
  }

  .error-hint {
    font-size: 7px;
    color: var(--screen-text);
    opacity: 0.7;
  }

  .loading-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    text-align: center;
  }

  .loading-text {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
    animation: blink 1s ease-in-out infinite;
  }

  @keyframes blink {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }
</style>
