import { mount } from 'svelte'
import { registerSW } from 'virtual:pwa-register'

import './app.css'
import App from './App.svelte'

// Register service worker with auto-update
const updateSW = registerSW({
  onNeedRefresh() {
    // New content available, reload to update
    if (confirm('New content available! Reload to update?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  },
  onRegistered(registration: ServiceWorkerRegistration | undefined) {
    // Check for updates every hour
    if (registration) {
      setInterval(() => {
        registration.update()
      }, 60 * 60 * 1000) // 1 hour
    }
  },
})

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
