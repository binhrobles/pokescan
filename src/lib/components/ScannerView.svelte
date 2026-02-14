<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import QrScanner from 'qr-scanner';

  interface ScannerViewProps {
    onScan: (barcodeContent: string) => void;
  }

  let { onScan }: ScannerViewProps = $props();

  let videoElement: HTMLVideoElement | undefined = $state();
  let scanner: QrScanner | undefined = $state();
  let detected = $state(false);

  onMount(() => {
    if (!videoElement) return;

    scanner = new QrScanner(
      videoElement,
      (result) => {
        // QR code detected — trigger red flash
        detected = true;

        // Auto-capture after brief visual feedback
        setTimeout(() => {
          onScan(result.data);
        }, 300);
      },
      {
        returnDetailedScanResult: true,
        highlightScanRegion: false,
        highlightCodeOutline: false,
      }
    );

    scanner.start();
  });

  onDestroy(() => {
    scanner?.stop();
    scanner?.destroy();
  });
</script>

<div class="scanner-container">
  <video bind:this={videoElement} class="video-feed"></video>
  <div class="pokeball-overlay" class:detected></div>
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
  }

  .pokeball-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    height: 120px;
    border: 4px solid rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    box-shadow:
      0 0 0 2px rgba(0, 0, 0, 0.3),
      inset 0 0 20px rgba(255, 255, 255, 0.3);
    pointer-events: none;
    transition: all 0.2s ease-out;
  }

  /* Horizontal divider line through center (Pokéball style) */
  .pokeball-overlay::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 4px;
    background: rgba(255, 255, 255, 0.8);
    transform: translateY(-50%);
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.3);
  }

  /* Center button */
  .pokeball-overlay::after {
    content: '';
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
  }

  /* Red flash on QR detection */
  .pokeball-overlay.detected {
    border-color: #dc2626;
    box-shadow:
      0 0 0 2px rgba(0, 0, 0, 0.5),
      0 0 30px rgba(220, 38, 38, 0.8),
      inset 0 0 20px rgba(220, 38, 38, 0.5);
    animation: pulse 0.3s ease-out;
  }

  .pokeball-overlay.detected::before {
    background: #dc2626;
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
</style>
