'use client'

import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Layers,
  Radio,
  Sparkles,
  XCircle,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import {
  ANOMALY_CATEGORIES,
  type ActiveAnomaly,
  type AnomalyType,
  type CampusLocation,
} from '@/lib/game-data'

type FeedbackEffect = {
  id: number
  x: number
  y: number
  success: boolean
  title: string
  sub: string
}

type CctvFeedProps = {
  location: CampusLocation
  playerName: string
  activeAnomaly: ActiveAnomaly | null
  currentAngleIndex: number
  onAngleChange: (newAngle: number) => void
  onPrevCamera: () => void
  onNextCamera: () => void
  onReportAnomaly: (type: AnomalyType, clickX: number, clickY: number) => boolean
}

export function CctvFeed({
  location,
  playerName,
  activeAnomaly,
  currentAngleIndex,
  onAngleChange,
  onPrevCamera,
  onNextCamera,
  onReportAnomaly,
}: CctvFeedProps) {
  const [clock, setClock] = useState('--:--:--')
  const [reportModal, setReportModal] = useState<{ open: boolean; x: number; y: number } | null>(null)
  const [feedbacks, setFeedbacks] = useState<FeedbackEffect[]>([])
  const [isGlitching, setIsGlitching] = useState(false)
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

  // CCTV Glitch effect when changing cameras or when anomaly changes
  useEffect(() => {
    setIsGlitching(true)
    const t = window.setTimeout(() => setIsGlitching(false), 220)
    return () => window.clearTimeout(t)
  }, [location.id, activeAnomaly?.anomaly.id])

  // Handle click on feed to open report menu at coordinates
  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent if clicking on buttons or modal
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('.report-dialog-box')) {
      return
    }
    if (!feedRef.current) return
    const rect = feedRef.current.getBoundingClientRect()
    const clickX = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    const clickY = Math.round(((e.clientY - rect.top) / rect.height) * 100)

    setReportModal({
      open: true,
      x: clickX,
      y: clickY,
    })
  }

  // Submit report choice
  const handleSelectReport = (type: AnomalyType) => {
    if (!reportModal) return
    const { x, y } = reportModal
    setReportModal(null)

    const isSuccess = onReportAnomaly(type, x, y)
    const effectId = Date.now()

    if (isSuccess) {
      setFeedbacks((prev) => [
        ...prev,
        {
          id: effectId,
          x,
          y,
          success: true,
          title: '+150 SKOR!',
          sub: 'ANOMALI DIBERSIHKAN',
        },
      ])
    } else {
      setFeedbacks((prev) => [
        ...prev,
        {
          id: effectId,
          x,
          y,
          success: false,
          title: 'LAPORAN GAGAL!',
          sub: 'Titik / jenis anomali tidak sesuai',
        },
      ])
    }

    window.setTimeout(() => {
      setFeedbacks((prev) => prev.filter((f) => f.id !== effectId))
    }, 1200)
  }

  // Display anomaly image if active in this room, else base image
  const isAnomalyHere = activeAnomaly && activeAnomaly.locationId === location.id
  const displayImage = isAnomalyHere ? activeAnomaly.anomaly.image : (location.baseImage || location.images[0])

  return (
    <div
      ref={feedRef}
      className={`modern-cctv-stage ${isGlitching ? 'cctv-static-glitch' : ''}`}
      onClick={handleStageClick}
      role="group"
      aria-label={`Feed CCTV Kamera ${location.camera} - ${location.name}`}
    >
      {/* Real CCTV Photo Background (Base or Anomaly) */}
      <div className="modern-cctv-img-wrap">
        <Image
          src={displayImage}
          alt={`CCTV ${location.name}`}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 85vw"
          className="modern-cctv-img"
        />
      </div>

      {/* CCTV Overlays: Scanlines & Vignette */}
      <div className="modern-cctv-scanlines" />
      <div className="modern-cctv-vignette" />

      {/* Top Left Stamp */}
      <div className="modern-cctv-stamp">
        <div className="stamp-primary">
          <span className="stamp-cam">CAM-{location.camera}</span>
          <span className="stamp-divider">•</span>
          <span className="stamp-time">{clock}</span>
          <span className="stamp-divider">•</span>
          <span className="stamp-loc">{location.name}</span>
        </div>
        <div className="stamp-sub">
          <span>PETUGAS: {playerName || 'GURU PIKET'}</span>
          <span className="stamp-divider">•</span>
          <span className="stamp-fps">30 FPS</span>
        </div>
      </div>

      {/* Top Right Live & Status */}
      <div className="modern-cctv-status-badge">
        <div className="live-pill">
          <span className="rec-dot" />
          <span className="rec-label">REC</span>
        </div>
        <div className="room-name-pill">
          <Eye className="w-3.5 h-3.5 text-emerald-400" />
          <span>{location.shortName}</span>
        </div>
      </div>

      {/* Floating Interactive Report Dialog at Click Position */}
      <AnimatePresence>
        {reportModal?.open && (
          <motion.div
            className="report-dialog-box"
            style={{
              left: `${Math.min(Math.max(reportModal.x, 22), 78)}%`,
              top: `${Math.min(Math.max(reportModal.y, 24), 76)}%`,
            }}
            initial={{ opacity: 0, scale: 0.85, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            <div className="report-dialog-header">
              <span className="report-pin-tag">📍 TITIK: {reportModal.x}%, {reportModal.y}%</span>
              <button
                type="button"
                className="report-btn-close"
                onClick={() => setReportModal(null)}
                title="Tutup (ESC)"
              >
                ✕
              </button>
            </div>
            <p className="report-dialog-title">PILIH JENIS KEJADIAN:</p>
            <div className="report-options-grid">
              {ANOMALY_CATEGORIES.map((cat) => (
                <button
                  key={cat.type}
                  type="button"
                  className="report-option-btn"
                  onClick={() => handleSelectReport(cat.type)}
                >
                  <span className="option-icon">{cat.icon}</span>
                  <div className="option-text">
                    <span className="option-label">{cat.label}</span>
                    <span className="option-sub">{cat.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback popups (Success / Miss) */}
      <AnimatePresence>
        {feedbacks.map((f) => (
          <motion.div
            key={f.id}
            className={`feedback-toast ${f.success ? 'feedback-toast-success' : 'feedback-toast-fail'}`}
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
            initial={{ opacity: 0, scale: 0.7, y: 0 }}
            animate={{ opacity: 1, scale: 1.05, y: -24 }}
            exit={{ opacity: 0, scale: 0.9, y: -40 }}
            transition={{ duration: 0.35 }}
          >
            {f.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-300" />
            )}
            <div>
              <div className="feedback-title">{f.title}</div>
              <div className="feedback-sub">{f.sub}</div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Left / Right Camera Switch Buttons */}
      <button
        type="button"
        className="modern-cctv-nav-btn nav-btn-left"
        onClick={(e) => {
          e.stopPropagation()
          onPrevCamera()
        }}
        title="Kamera Sebelumnya (Panah Kiri / A)"
      >
        <ChevronLeft className="w-6 h-6" />
        <span className="nav-btn-text">SEBELUMNYA</span>
      </button>

      <button
        type="button"
        className="modern-cctv-nav-btn nav-btn-right"
        onClick={(e) => {
          e.stopPropagation()
          onNextCamera()
        }}
        title="Kamera Berikutnya (Panah Kanan / D)"
      >
        <span className="nav-btn-text">BERIKUTNYA</span>
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Bottom Center Prompt Bar */}
      <div className="modern-cctv-bottom-bar">
        <button
          type="button"
          className="report-trigger-btn"
          onClick={(e) => {
            e.stopPropagation()
            setReportModal({ open: true, x: 50, y: 50 })
          }}
        >
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>KLIK DI GAMBAR ATAU KLIK DISINI UNTUK LAPORKAN ANOMALI</span>
        </button>
      </div>
    </div>
  )
}
