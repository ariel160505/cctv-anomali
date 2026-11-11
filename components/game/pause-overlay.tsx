'use client'

import { useEffect, useRef, type KeyboardEvent } from 'react'
import { ArrowRight, Map, Pause, Play } from 'lucide-react'
import { motion } from 'motion/react'

const FOCUSABLE_SELECTOR = 'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'

type PauseOverlayProps = {
  onResume: () => void
  onOpenMap: () => void
}

export function PauseOverlay({ onResume, onOpenMap }: PauseOverlayProps) {
  const dialogRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const previousElement = document.activeElement instanceof HTMLElement ? document.activeElement : null
    dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus()

    return () => {
      if (previousElement?.isConnected) previousElement.focus()
    }
  }, [])

  function handleDialogKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== 'Tab') return

    const focusableElements = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? [])
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement?.focus()
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement?.focus()
    }
  }

  return (
    <motion.div className="pause-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.section
        ref={dialogRef}
        className="pause-card panel-frame"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pause-title"
        onKeyDown={handleDialogKeyDown}
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <div className="pause-emblem"><Pause aria-hidden="true" /></div>
        <span className="eyebrow">JEDA SEMENTARA / UNIT 07</span>
        <h2 id="pause-title">Tarik napas.<br /><em>Ronda bisa menunggu.</em></h2>
        <p>Waktu dan target siswa dibekukan sampai kamu siap melanjutkan.</p>
        <div className="pause-actions">
          <button className="start-button pause-resume-button" onClick={onResume}>
            <span className="start-icon"><Play aria-hidden="true" /></span>
            <span>LANJUTKAN RONDA<small>AKTIFKAN KAMERA KEMBALI</small></span>
            <ArrowRight className="start-trail" aria-hidden="true" />
          </button>
          <button className="secondary-button" onClick={onOpenMap}><Map aria-hidden="true" /> LIHAT PETA SEKOLAH</button>
        </div>
        <div className="pause-key-hint"><kbd>P</kbd> ATAU <kbd>ESC</kbd> UNTUK MELANJUTKAN</div>
      </motion.section>
    </motion.div>
  )
}
