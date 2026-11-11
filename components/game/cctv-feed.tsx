'use client'

import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { Eye, Layers, Maximize2, Radio, Volume2, Sparkles, AlertCircle } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import type { CampusLocation, HidingSpot } from '@/lib/game-data'

export type ActiveStudent = {
  id: number
  locationId: string
  spot: HidingSpot
  spawnTime: number
}

type CatchEffect = {
  id: number
  x: number
  y: number
  scoreText: string
}

type MissEffect = {
  id: number
  x: number
  y: number
}

type CctvFeedProps = {
  location: CampusLocation
  playerName: string
  activeStudent: ActiveStudent | null
  currentAngleIndex: number
  onAngleChange: (newAngle: number) => void
  onCatch: (student: ActiveStudent) => void
  onMiss?: (x: number, y: number) => void
}

export function CctvFeed({
  location,
  playerName,
  activeStudent,
  currentAngleIndex,
  onAngleChange,
  onCatch,
  onMiss,
}: CctvFeedProps) {
  const [clock, setClock] = useState('--:--:--')
  const [catchEffect, setCatchEffect] = useState<CatchEffect | null>(null)
  const [missEffects, setMissEffects] = useState<MissEffect[]>([])
  const feedRef = useRef<HTMLDivElement>(null)

  // Real-time CCTV timestamp clock
  useEffect(() => {
    const update = () => {
      const now = new Date()
      setClock(
        new Intl.DateTimeFormat('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(now)
      )
    }
    update()
    const interval = window.setInterval(update, 1000)
    return () => window.clearInterval(interval)
  }, [])

  // Handle click on the CCTV stage
  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!feedRef.current) return
    const rect = feedRef.current.getBoundingClientRect()
    const clickX = ((e.clientX - rect.left) / rect.width) * 100
    const clickY = ((e.clientY - rect.top) / rect.height) * 100

    // If active student is in this location and same angle
    if (activeStudent && activeStudent.locationId === location.id && activeStudent.spot.angleIndex === currentAngleIndex) {
      const spot = activeStudent.spot
      const hitRadius = 7 * (spot.scale || 0.5) + 3.5

      const dist = Math.hypot(clickX - spot.x, clickY - spot.y)
      if (dist <= hitRadius) {
        // Direct Hit!
        handleCaptureStudent(activeStudent, spot.x, spot.y)
        return
      }
    }

    // Missed click
    const missId = Date.now() + Math.random()
    setMissEffects((prev) => [...prev.slice(-3), { id: missId, x: clickX, y: clickY }])
    window.setTimeout(() => {
      setMissEffects((prev) => prev.filter((m) => m.id !== missId))
    }, 600)

    if (onMiss) onMiss(clickX, clickY)
  }

  const handleCaptureStudent = (student: ActiveStudent, x: number, y: number) => {
    setCatchEffect({
      id: student.id,
      x,
      y,
      scoreText: '+100 SKOR!',
    })
    onCatch(student)
    window.setTimeout(() => setCatchEffect(null), 900)
  }

  const currentImage = location.images[currentAngleIndex] || location.images[0]
  const isStudentVisibleHere =
    activeStudent &&
    activeStudent.locationId === location.id &&
    activeStudent.spot.angleIndex === currentAngleIndex

  return (
    <div
      ref={feedRef}
      className="feed-stage"
      onClick={handleStageClick}
      role="group"
      aria-label={`Feed CCTV Kamera ${location.camera} - ${location.name}`}
    >
      {/* Real School Photo Feed */}
      <div className="feed-image-container">
        <Image
          src={currentImage}
          alt={`CCTV ${location.name}`}
          fill
          priority
          sizes="(max-width: 900px) 100vw, 80vw"
          className="feed-background-image"
        />
      </div>

      {/* Subtle CCTV overlays (realistic security monitor) */}
      <div className="feed-vignette" aria-hidden="true" />
      <div className="feed-scanlines" aria-hidden="true" />
      <div className="feed-crosshair" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      {/* CCTV HUD Elements */}
      <div className="feed-stamp">
        <span>CAM-{location.camera}</span>
        <i />
        <span>{clock}</span>
        <span className="feed-stamp-camera">{location.name}</span>
      </div>

      <div className="feed-location-chip">
        <Eye aria-hidden="true" />
        <span>{location.shortName}</span>
      </div>

      <div className="feed-recording">
        <span className="rec-dot" /> REC
      </div>

      {/* Camouflaged Truant Student (Game Ketelitian) */}
      <AnimatePresence>
        {isStudentVisibleHere && activeStudent ? (
          <motion.div
            key={`student-${activeStudent.id}`}
            className="sneaky-truant-wrapper"
            style={{
              left: `${activeStudent.spot.x}%`,
              top: `${activeStudent.spot.y}%`,
              transform: `translate(-50%, -50%) scale(${activeStudent.spot.scale})`,
            }}
            initial={{ opacity: 0, scale: activeStudent.spot.scale * 0.8 }}
            animate={{ opacity: 1, scale: activeStudent.spot.scale }}
            exit={{ opacity: 0, scale: activeStudent.spot.scale * 1.2 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => {
              e.stopPropagation()
              handleCaptureStudent(activeStudent, activeStudent.spot.x, activeStudent.spot.y)
            }}
          >
            {/* Camouflaged Student Graphic according to pose */}
            <SneakyStudentSprite pose={activeStudent.spot.pose} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Miss Click Ripple */}
      {missEffects.map((m) => (
        <span
          key={m.id}
          className="miss-click-ripple"
          style={{ left: `${m.x}%`, top: `${m.y}%` }}
        />
      ))}

      {/* Catch Success Effect */}
      <AnimatePresence>
        {catchEffect ? (
          <motion.div
            key={catchEffect.id}
            className="catch-success-banner"
            style={{ left: `${catchEffect.x}%`, top: `${catchEffect.y}%` }}
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1.1, y: -25 }}
            exit={{ opacity: 0, y: -45, scale: 0.9 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="catch-target-ring" />
            <span className="catch-score-text">
              <Sparkles className="catch-sparkle" /> {catchEffect.scoreText}
            </span>
            <small className="catch-subtext">PEMBOLOS TERCIDUK!</small>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Bottom CCTV Status Bar */}
      <div className="feed-bottom-info">
        <span>
          <Maximize2 aria-hidden="true" /> CCTV ULTRA-HD / FPS: 30
        </span>
        <span>
          <Volume2 aria-hidden="true" /> PETUGAS: {playerName || 'GURU PIKET'}
        </span>
        <span>
          SUDUT {currentAngleIndex + 1}/{location.images.length}
        </span>
      </div>

      {/* Multiple Angles Switcher Pills (if location has multiple photos) */}
      {location.images.length > 1 ? (
        <div className="angle-switcher-bar" onClick={(e) => e.stopPropagation()}>
          <span className="angle-label">
            <Layers aria-hidden="true" /> SUDUT:
          </span>
          {location.images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`angle-btn ${idx === currentAngleIndex ? 'angle-btn-active' : ''}`}
              onClick={() => onAngleChange(idx)}
              title={`Ganti ke Sudut Kamera ${idx + 1}`}
            >
              #{idx + 1}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

/**
 * SneakyStudentSprite: Realistic camouflaged student that blends with environment.
 * Features subtle natural idle movements (peeking, crouching, looking around)
 * WITHOUT bright neon borders or obvious game markers.
 */
function SneakyStudentSprite({ pose }: { pose: HidingSpot['pose'] }) {
  if (pose === 'peek-left') {
    return (
      <motion.div
        className="sneaky-sprite sprite-peek-left"
        animate={{ x: [0, 3, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        title="Ada yang ngintip?"
      >
        {/* Head peeking from right side of a pillar */}
        <div className="sneaky-head">
          <div className="sneaky-hair" />
          <div className="sneaky-face">
            <div className="sneaky-eye" />
            <div className="sneaky-mask" />
          </div>
        </div>
        {/* Arm holding the edge of wall */}
        <div className="sneaky-hand-grip" />
        <div className="sneaky-shoulder" />
      </motion.div>
    )
  }

  if (pose === 'peek-right') {
    return (
      <motion.div
        className="sneaky-sprite sprite-peek-right"
        animate={{ x: [0, -3, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        title="Ada yang ngintip?"
      >
        <div className="sneaky-head">
          <div className="sneaky-hair" />
          <div className="sneaky-face">
            <div className="sneaky-eye" />
            <div className="sneaky-mask" />
          </div>
        </div>
        <div className="sneaky-hand-grip hand-right" />
        <div className="sneaky-shoulder shoulder-right" />
      </motion.div>
    )
  }

  if (pose === 'crouch') {
    return (
      <motion.div
        className="sneaky-sprite sprite-crouch"
        animate={{ y: [0, 2, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        title="Seseorang jongkok bersembunyi"
      >
        {/* Crouched student with backpack and uniform */}
        <div className="sneaky-head head-crouch">
          <div className="sneaky-hair" />
          <div className="sneaky-face">
            <div className="sneaky-eyes-down" />
          </div>
        </div>
        <div className="sneaky-back-torso" />
        <div className="sneaky-knees" />
      </motion.div>
    )
  }

  if (pose === 'peek-behind') {
    return (
      <motion.div
        className="sneaky-sprite sprite-peek-behind"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        title="Kepala mengintip dari belakang"
      >
        <div className="sneaky-head head-behind">
          <div className="sneaky-hair" />
          <div className="sneaky-face">
            <div className="sneaky-eyes-peek" />
          </div>
        </div>
      </motion.div>
    )
  }

  // stand-far: distant student silhouette
  return (
    <motion.div
      className="sneaky-sprite sprite-stand-far"
      animate={{ opacity: [0.85, 1, 0.85] }}
      transition={{ duration: 3.5, repeat: Infinity }}
      title="Siswa di kejauhan"
    >
      <div className="sneaky-distant-body">
        <div className="distant-head" />
        <div className="distant-torso" />
        <div className="distant-legs" />
      </div>
    </motion.div>
  )
}
