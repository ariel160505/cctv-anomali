'use client'

import { useEffect } from 'react'

export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('[PWA] Service Worker registered:', reg.scope)
          })
          .catch((err) => {
            console.warn('[PWA] Service Worker registration failed:', err)
          })
      })

      // Capture beforeinstallprompt for manual trigger
      window.addEventListener('beforeinstallprompt', (e) => {
        // Stash event on window for custom install buttons
        ;(window as any).__pwaInstallPrompt = e
        window.dispatchEvent(new CustomEvent('pwa-can-install'))
      })

      window.addEventListener('appinstalled', () => {
        ;(window as any).__pwaInstallPrompt = null
        window.dispatchEvent(new CustomEvent('pwa-installed'))
        console.log('[PWA] App successfully installed!')
      })
    }
  }, [])

  return null
}
