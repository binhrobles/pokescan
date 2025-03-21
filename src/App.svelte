<script lang="ts">
  import QrScanner from 'qr-scanner';

  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'

  /** @type {HTMLVideoElement} */
  let scannerVideo;
  let qrScanner;

  // use $effect so we can wait until scanner-video is created
	$effect(() => {
    // To enforce the use of the new api with detailed scan results, call the constructor with an options object, see below.
    qrScanner = new QrScanner(
        scannerVideo,
        result => console.log('decoded qr code:', result),
        {
          maxScansPerSecond: 1,

          highlightScanRegion: true,
          highlightCodeOutline: true,
          // TODO: custom pokedex css
          // overlay: someDivReference
        },
    );
	});

  let scannerEnabled: boolean = $state(false)
  const toggleScanner = () => {
    if (!qrScanner) {
      console.error('qr scanner not ready!');
      return;
    }

    scannerEnabled = !scannerEnabled;
    if (scannerEnabled) {
      qrScanner.start();
    } else {
      qrScanner.stop();
    }
  };

</script>

<main>
  <div>
    <a href="https://vite.dev" target="_blank" rel="noreferrer">
      <img src={viteLogo} class="logo" alt="Vite Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>Vite + Svelte</h1>

  <div class="card">
    <video bind:this={scannerVideo}></video>
    <button onclick={toggleScanner}>
      {scannerEnabled ? 'scan off' : 'scan on!'}
    </button>
  </div>

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer">SvelteKit</a>, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">
    Click on the Vite and Svelte logos to learn more
  </p>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
