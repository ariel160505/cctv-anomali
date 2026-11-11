'use client'

import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Eye, Layers, Sparkles } from 'lucide-react'
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
  onPrevCamera: () => void
  onNextCamera: () => void
  onCatch: (student: ActiveStudent) => void
  onMiss?: (x: number, y: number) => void
}

export function CctvFeed({
  location,
  playerName,
  activeStudent,
  currentAngleIndex,
  onAngleChange,
  onPrevCamera,
  onNextCamera,
  onCatch,
  onMiss,
}: CctvFeedProps) {
  const [clock, setClock] = useState('--:--:--')
  const [catchEffect, setCatchEffect] = useState<CatchEffect | null>(null)
  const [missEffects, setMissEffects] = useState<MissEffect[]>([])
  const feedRef = useRef<HTMLDivElement>(null)

  // Real-time CCTV clock
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

  // Handle click on the CCTV screen
  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!feedRef.current) return
    const rect = feedRef.current.getBoundingClientRect()
    const clickX = ((e.clientX - rect.left) / rect.width) * 100
    const clickY = ((e.clientY - rect.top) / rect.height) * 100

    // Check direct hit on active student
    if (
      activeStudent &&
      activeStudent.locationId === location.id &&
      activeStudent.spot.angleIndex === currentAngleIndex
    ) {
      const spot = activeStudent.spot
      const hitRadius = 8 * (spot.scale || 0.6) + 3

      const dist = Math.hypot(clickX - spot.x, clickY - spot.y)
      if (dist <= hitRadius) {
        handleCaptureStudent(activeStudent, spot.x, spot.y)
        return
      }
    }

    // Missed click ripple
    const missId = Date.now() + Math.random()
    setMissEffects((prev) => [...prev.slice(-2), { id: missId, x: clickX, y: clickY }])
    window.setTimeout(() => {
      setMissEffects((prev) => prev.filter((m) => m.id !== missId))
    }, 500)

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
    window.setTimeout(() => setCatchEffect(null), 800)
  }

  const currentImage = location.images[currentAngleIndex] || location.images[0]
  const isStudentVisible =
    activeStudent &&
    activeStudent.locationId === location.id &&
    activeStudent.spot.angleIndex === currentAngleIndex

  return (
    <div
      ref={feedRef}
      className="modern-cctv-stage"
      onClick={handleStageClick}
      role="group"
      aria-label={`Feed CCTV Kamera ${location.camera} - ${location.name}`}
    >
      {/* High-Resolution Real Photo Background */}
      <div className="modern-cctv-img-wrap">
        <Image
          src={currentImage}
          alt={`CCTV ${location.name}`}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 85vw"
          className="modern-cctv-img"
        />
      </div>

      {/* Subtle CCTV Monitor Overlays */}
      <div className="modern-cctv-scanlines" />
      <div className="modern-cctv-vignette" />

      {/* Top Left Stamp */}
      <div className="modern-cctv-stamp">
        <span className="cctv-cam-badge">CAM-{location.camera}</span>
        <span className="cctv-clock">{clock}</span>
        <span className="cctv-loc-name">{location.name}</span>
      </div>

      {/* Top Right Recording Badge */}
      <div className="modern-cctv-rec">
        <span className="cctv-rec-dot" /> LIVE REC
      </div>

      {/* Realistic Camouflaged Truant Student */}
      <AnimatePresence>
        {isStudentVisible && activeStudent ? (
          <motion.div
            key={`student-${activeStudent.id}`}
            className="grounded-student-target"
            style={{
              left: `${activeStudent.spot.x}%`,
              top: `${activeStudent.spot.y}%`,
              transform: `translate(-50%, -50%) scale(${activeStudent.spot.scale})`,
            }}
            initial={{ opacity: 0, scale: activeStudent.spot.scale * 0.8 }}
            animate={{ opacity: 1, scale: activeStudent.spot.scale }}
            exit={{ opacity: 0, scale: activeStudent.spot.scale * 1.25 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => {
              e.stopPropagation()
              handleCaptureStudent(activeStudent, activeStudent.spot.x, activeStudent.spot.y)
            }}
            title="Siswa pembolos terdeteksi! Klik untuk menangkap!"
          >
            {/* High quality realistic sprite based on hiding pose */}
            <RealisticStudentSprite pose={activeStudent.spot.pose} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Miss Click Ripple */}
      {missEffects.map((m) => (
        <span
          key={m.id}
          className="modern-miss-ripple"
          style={{ left: `${m.x}%`, top: `${m.y}%` }}
        />
      ))}

      {/* Catch Success Banner */}
      <AnimatePresence>
        {catchEffect ? (
          <motion.div
            key={catchEffect.id}
            className="modern-catch-banner"
            style={{ left: `${catchEffect.x}%`, top: `${catchEffect.y}%` }}
            initial={{ opacity: 0, scale: 0.5, y: 15 }}
            animate={{ opacity: 1, scale: 1.1, y: -25 }}
            exit={{ opacity: 0, y: -45, scale: 0.9 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <div className="catch-target-ring-effect" />
            <span className="catch-badge-text">
              <Sparkles className="w-5 h-5 text-amber-300" /> {catchEffect.scoreText}
            </span>
            <small className="catch-sub-label">TERTANGKAP BASAH!</small>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Floating Left & Right Camera Navigation Arrows (Overlaid directly on CCTV) */}
      <button
        type="button"
        className="cctv-floating-arrow arrow-left"
        onClick={(e) => {
          e.stopPropagation()
          onPrevCamera()
        }}
        title="Kamera Sebelumnya (Panah Kiri ←)"
      >
        <ChevronLeft className="w-7 h-7" />
      </button>

      <button
        type="button"
        className="cctv-floating-arrow arrow-right"
        onClick={(e) => {
          e.stopPropagation()
          onNextCamera()
        }}
        title="Kamera Berikutnya (Panah Kanan →)"
      >
        <ChevronRight className="w-7 h-7" />
      </button>

      {/* Bottom Center: Camera Angle Switcher (if location has multiple photos) */}
      {location.images.length > 1 && (
        <div className="modern-angle-bar" onClick={(e) => e.stopPropagation()}>
          <span className="angle-bar-title">
            <Layers className="w-3.5 h-3.5" /> SUDUT:
          </span>
          {location.images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`modern-angle-btn ${idx === currentAngleIndex ? 'active-angle' : ''}`}
              onClick={() => onAngleChange(idx)}
            >
              #{idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * RealisticStudentSprite:
 * Rendered using authentic SVG student models (seragam putih abu-abu, tas, sneakers, contact shadows)
 * Physically grounded to blend seamlessly with real photography.
 */
function RealisticStudentSprite({ pose }: { pose: HidingSpot['pose'] }) {
  // Pose 1: Peek Left (Mengintip dari balik pilar/tiang/dinding kiri)
  if (pose === 'peek-left') {
    return (
      <motion.div
        className="sprite-realistic sprite-peek-left-box"
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="65" height="90" viewBox="0 0 65 90" fill="none">
          {/* Bayangan di pilar */}
          <ellipse cx="25" cy="88" rx="20" ry="4" fill="#000000" opacity="0.4" />
          {/* Badan Kemeja Putih */}
          <path d="M12 40 L45 40 L48 85 L20 85 Z" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2" />
          {/* Tangan kiri pegang tepi tiang */}
          <rect x="6" y="44" width="8" height="18" rx="4" fill="#FDE3D2" stroke="#0F172A" strokeWidth="1.5" />
          {/* Kepala mengintip miring */}
          <circle cx="28" cy="24" r="16" fill="#FDE3D2" stroke="#0F172A" strokeWidth="2" />
          {/* Rambut hitam keren */}
          <path d="M14 20 C14 8 38 6 42 20 C42 16 38 12 32 12 C24 12 18 16 14 20 Z" fill="#0F172A" />
          <path d="M16 16 Q26 10 36 22 Q40 12 44 24" stroke="#0F172A" strokeWidth="3" fill="#0F172A" />
          {/* Mata mengintip awas */}
          <ellipse cx="32" cy="24" rx="4" ry="4.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="34" cy="24" r="2.5" fill="#0F172A" />
          {/* Alis awas */}
          <path d="M28 17 Q34 14 38 18" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </motion.div>
    )
  }

  // Pose 2: Peek Right (Mengintip dari balik tiang/dinding kanan)
  if (pose === 'peek-right') {
    return (
      <motion.div
        className="sprite-realistic sprite-peek-right-box"
        animate={{ x: [0, -4, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="65" height="90" viewBox="0 0 65 90" fill="none">
          <ellipse cx="40" cy="88" rx="20" ry="4" fill="#000000" opacity="0.4" />
          <path d="M53 40 L20 40 L17 85 L45 85 Z" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2" />
          <rect x="51" y="44" width="8" height="18" rx="4" fill="#FDE3D2" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="37" cy="24" r="16" fill="#FDE3D2" stroke="#0F172A" strokeWidth="2" />
          <path d="M51 20 C51 8 27 6 23 20 C23 16 27 12 33 12 C41 12 47 16 51 20 Z" fill="#0F172A" />
          <path d="M49 16 Q39 10 29 22 Q25 12 21 24" stroke="#0F172A" strokeWidth="3" fill="#0F172A" />
          <ellipse cx="33" cy="24" rx="4" ry="4.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="31" cy="24" r="2.5" fill="#0F172A" />
          <path d="M37 17 Q31 14 27 18" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </motion.div>
    )
  }

  // Pose 3: Crouch (Jongkok bersembunyi di bawah meja, di sela motor, atau di balik tanaman)
  if (pose === 'crouch') {
    return (
      <motion.div
        className="sprite-realistic sprite-crouch-box"
        animate={{ y: [0, 3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="75" height="70" viewBox="0 0 75 70" fill="none">
          {/* Ground Contact Shadow */}
          <ellipse cx="37" cy="67" rx="30" ry="6" fill="#000000" opacity="0.45" />
          {/* Celana Abu-Abu / Posisi Jongkok */}
          <path d="M16 45 C14 38 28 32 37 32 C46 32 60 38 58 45 L54 62 L20 62 Z" fill="#475569" stroke="#0F172A" strokeWidth="2" />
          {/* Kemeja Seragam / Punggung */}
          <path d="M22 28 C22 20 52 20 52 28 L54 44 L20 44 Z" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2" />
          {/* Tas Ransel Sekolah */}
          <rect x="27" y="24" width="20" height="22" rx="4" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
          {/* Sepatu Sneakers di lantai */}
          <rect x="15" y="60" width="16" height="8" rx="3" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
          <rect x="44" y="60" width="16" height="8" rx="3" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
          {/* Kepala Menunduk Mengawasi */}
          <circle cx="37" cy="16" r="13" fill="#FDE3D2" stroke="#0F172A" strokeWidth="2" />
          {/* Rambut */}
          <path d="M24 16 C24 6 50 6 50 16 Z" fill="#0F172A" />
          {/* Mata mengintip */}
          <ellipse cx="33" cy="18" rx="3" ry="2" fill="#0F172A" />
          <ellipse cx="41" cy="18" rx="3" ry="2" fill="#0F172A" />
        </svg>
      </motion.div>
    )
  }

  // Pose 4: Peek Behind (Hanya kepala dan mata mengintip dari balik tirai / meja / motor)
  if (pose === 'peek-behind') {
    return (
      <motion.div
        className="sprite-realistic sprite-peek-behind-box"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="60" height="45" viewBox="0 0 60 45" fill="none">
          {/* Kepala */}
          <circle cx="30" cy="26" r="18" fill="#FDE3D2" stroke="#0F172A" strokeWidth="2" />
          {/* Rambut */}
          <path d="M12 24 C12 10 48 10 48 24 Z" fill="#0F172A" />
          <path d="M14 18 Q30 8 46 18" stroke="#0F172A" strokeWidth="3" fill="#0F172A" />
          {/* Dua mata mengintip awas */}
          <ellipse cx="23" cy="25" rx="4.5" ry="5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="23" cy="24" r="2.5" fill="#0F172A" />
          <ellipse cx="37" cy="25" rx="4.5" ry="5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="37" cy="24" r="2.5" fill="#0F172A" />
          {/* Alis awas */}
          <line x1="18" y1="18" x2="27" y2="19" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
          <line x1="42" y1="18" x2="33" y2="19" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </motion.div>
    )
  }

  // Pose 5: Stand Far (Siluet siswa berdiri di kejauhan koridor/lapangan)
  return (
    <motion.div
      className="sprite-realistic sprite-stand-far-box"
      animate={{ opacity: [0.85, 1, 0.85] }}
      transition={{ duration: 3.2, repeat: Infinity }}
    >
      <svg width="40" height="85" viewBox="0 0 40 85" fill="none">
        <ellipse cx="20" cy="83" rx="14" ry="3" fill="#000000" opacity="0.35" />
        {/* Celana Abu-Abu */}
        <path d="M14 48 L12 80 L18 80 L20 54 L22 54 L24 80 L30 80 L28 48 Z" fill="#475569" stroke="#0F172A" strokeWidth="1.5" />
        {/* Kemeja Seragam */}
        <path d="M10 24 L30 24 L28 50 L12 50 Z" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1.5" />
        {/* Kepala & Rambut */}
        <circle cx="20" cy="14" r="9" fill="#FDE3D2" stroke="#0F172A" strokeWidth="1.5" />
        <path d="M11 14 C11 4 29 4 29 14 Z" fill="#0F172A" />
      </svg>
    </motion.div>
  )
}
