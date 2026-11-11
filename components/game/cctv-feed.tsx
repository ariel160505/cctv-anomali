'use client'

import { useEffect, useState } from 'react'
import { Eye, Maximize2, ScanLine, Volume2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import type { CampusLocation } from '@/lib/game-data'

export type TruantStudent = {
  id: number
  x: number
  y: number
  color: string
}

type CatchBanner = { id: number; x: number; y: number }

type CctvFeedProps = {
  location: CampusLocation
  playerName: string
  student: TruantStudent | null
  catchBanner: CatchBanner | null
  captured: boolean
  noiseEnabled: boolean
  onCatch: (student: TruantStudent) => void
}

const studentColors = ['#e2a44a', '#d77759', '#8eab78', '#78a3a2']

export function createTruantStudent(id: number): TruantStudent {
  return {
    id,
    x: 26 + Math.random() * 48,
    y: 46 + Math.random() * 30,
    color: studentColors[Math.floor(Math.random() * studentColors.length)],
  }
}

export function CctvFeed({ location, playerName, student, catchBanner, captured, noiseEnabled, onCatch }: CctvFeedProps) {
  const [clock, setClock] = useState('--:--:--')

  useEffect(() => {
    const updateClock = () => setClock(new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date()))
    updateClock()
    const interval = window.setInterval(updateClock, 1000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <div
      className={`feed-stage ${captured ? 'feed-stage-captured' : ''} ${noiseEnabled ? 'feed-noise-on' : ''}`}
      style={{ backgroundImage: `linear-gradient(180deg, rgba(11, 19, 15, .11), rgba(11, 19, 15, .07)), url("${location.image}")` }}
      role="group"
      aria-label={`CCTV camera ${location.camera}, ${location.name}`}
    >
      <div className="feed-vignette" aria-hidden="true" />
      <div className="feed-scanlines" aria-hidden="true" />
      <div className="feed-noise" aria-hidden="true" />
      <div className="feed-crosshair" aria-hidden="true"><span /><span /><span /><span /></div>
      <div className="feed-stamp"><span>CAM-{location.camera}</span><i /> <span>{clock}</span><span className="feed-stamp-camera">{location.name}</span></div>
      <div className="feed-location-chip"><Eye aria-hidden="true" /><span>{location.shortName}</span></div>
      <div className="feed-recording"><span className="rec-dot" /> REC</div>

      <AnimatePresence>
        {student ? (
          <motion.button
            className="truant-target"
            style={{ left: `${student.x}%`, top: `${student.y}%`, ['--student-color' as string]: student.color }}
            initial={{ opacity: 0, scale: 0.45, y: 18 }}
            animate={{ opacity: [0, 1, 1], scale: [0.45, 1.04, 1], y: [18, 0, -2] }}
            exit={{ opacity: 0, scale: 1.3, y: -14 }}
            transition={{ duration: 0.3, times: [0, 0.55, 1] }}
            onClick={() => onCatch(student)}
            aria-label={`Tangkap siswa pembolos di ${location.name}`}
            title="Ketuk untuk menangkap"
          >
            <span className="target-alert"><ScanLine aria-hidden="true" /> DETEKSI</span>
            <span className="student-sprite" aria-hidden="true">
              <span className="student-head"><i /><i /><b /></span>
              <span className="student-body"><i /></span>
              <span className="student-arm student-arm-left" />
              <span className="student-arm student-arm-right" />
              <span className="student-leg student-leg-left" />
              <span className="student-leg student-leg-right" />
            </span>
            <span className="target-caption">SISWA TERDETEKSI</span>
          </motion.button>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {catchBanner ? (
          <motion.div
            key={catchBanner.id}
            className="catch-banner"
            style={{ left: `${catchBanner.x}%`, top: `${catchBanner.y}%` }}
            initial={{ opacity: 0, scale: 0.7, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: -34 }}
            exit={{ opacity: 0, y: -64 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            aria-live="polite"
          >
            +100 <small>SKOR</small>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="feed-bottom-info"><span><Maximize2 aria-hidden="true" /> 1920 × 1080</span><span><Volume2 aria-hidden="true" /> PETUGAS: {playerName || '—'}</span><span>SEKTOR 07 / {location.camera}</span></div>
      {noiseEnabled ? <div className="noise-label">SIGNAL INTERFERENCE // 02%</div> : null}
    </div>
  )
}
