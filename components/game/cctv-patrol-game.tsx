'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import {
  AlertOctagon,
  AlertTriangle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock,
  Heart,
  HelpCircle,
  Menu,
  Play,
  Radio,
  RotateCcw,
  Shield,
  ShieldAlert,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  X,
  XCircle,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { LobbyScreen } from '@/components/game/lobby-screen'
import {
  GAME_LOCATIONS,
  ALL_CAMERA_ANGLES,
  ANOMALY_REPORT_OPTIONS,
  formatTime,
  savePlayerScore,
  type ActiveAnomalyState,
  type AnomalyType,
  type GameLocation,
} from '@/lib/game-data'
import { useGameAudio } from '@/hooks/use-game-audio'
import Image from 'next/image'

const GAME_DURATION = 600 // 10 minutes = 600 seconds
const MAX_LIVES = 3

type ScreenState = 'lobby' | 'game' | 'gameover' | 'victory'

export function CctvPatrolGame() {
  const [screen, setScreen] = useState<ScreenState>('lobby')
  const [locationIndex, setLocationIndex] = useState(0)
  const [angleIndex, setAngleIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [lives, setLives] = useState(MAX_LIVES)
  const [score, setScore] = useState(0)
  const [resolvedCount, setResolvedCount] = useState(0)
  const [activeAnomalies, setActiveAnomalies] = useState<ActiveAnomalyState[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const [reportModalOpen, setReportModalOpen] = useState(false)

  // Special effects
  const [isScreenShaking, setIsScreenShaking] = useState(false)
  const [screenGlitch, setScreenGlitch] = useState(false)
  const [jumpscareAlert, setJumpscareAlert] = useState<string | null>(null)
  const [reportFeedback, setReportFeedback] = useState<{ success: boolean; text: string } | null>(null)
  const [reportedAnomalyIds, setReportedAnomalyIds] = useState<string[]>([])

  const { isMuted, toggleMute, startBgm, stopBgm, stopAllAudio, playSfx } = useGameAudio()
  const counterRef = useRef(0)
  const [liveClock, setLiveClock] = useState('--:--:--')

  const currentLocation = GAME_LOCATIONS[locationIndex]
  const currentAngle = currentLocation.angles[angleIndex] || currentLocation.angles[0]

  // Live real-time clock update
  useEffect(() => {
    const update = () => {
      const now = new Date()
      const formatted = new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now)
      setLiveClock(formatted)
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  // Timer Countdown (10 Minutes)
  useEffect(() => {
    if (screen !== 'game' || isPaused) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          stopAllAudio()
          setScreen('victory')
          playSfx('victory')
          savePlayerScore(score)
          try {
            void confetti({ particleCount: 150, spread: 90 })
          } catch {}
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [screen, isPaused, playSfx, score, stopAllAudio])

  // Check Game Over when lives reach 0
  useEffect(() => {
    if (screen === 'game' && lives <= 0) {
      stopAllAudio()
      setScreen('gameover')
      playSfx('gameOver')
      if (score > 0) {
        savePlayerScore(score)
      }
    }
  }, [screen, lives, playSfx, score, stopAllAudio])

  // Periodic Anomaly Spawner across the 6 locations
  // RULES:
  // 1. Grace Period: 2.5 minutes (150 seconds) at the start without any anomalies so player can memorize locations
  // 2. Uniqueness: Each anomaly only spawns ONCE. Once reported, it never appears again.
  useEffect(() => {
    if (screen !== 'game' || isPaused) return

    const spawnAnomaly = () => {
      // Grace period: do not spawn any anomalies during the first 150 seconds (2.5 minutes)
      if (timeLeft > GAME_DURATION - 150) return

      setActiveAnomalies((curr) => {
        if (curr.length >= 3) return curr

        const occupiedLocIds = new Set(curr.map((a) => a.locationId))
        const activeAnomalyIds = new Set(curr.map((a) => a.anomaly.id))

        // Find locations with anomalies that haven't been reported yet and aren't already active
        const eligibleLocations = GAME_LOCATIONS.filter((loc) => {
          if (occupiedLocIds.has(loc.id)) return false
          const available = loc.anomalies.filter(
            (anom) => !reportedAnomalyIds.includes(anom.id) && !activeAnomalyIds.has(anom.id)
          )
          return available.length > 0
        })

        if (eligibleLocations.length === 0) return curr

        const targetLoc = eligibleLocations[Math.floor(Math.random() * eligibleLocations.length)]
        const availableAnoms = targetLoc.anomalies.filter(
          (anom) => !reportedAnomalyIds.includes(anom.id) && !activeAnomalyIds.has(anom.id)
        )
        if (availableAnoms.length === 0) return curr

        const randomAnom = availableAnoms[Math.floor(Math.random() * availableAnoms.length)]

        counterRef.current += 1
        const newActive: ActiveAnomalyState = {
          instanceId: `anomaly-${counterRef.current}-${randomAnom.id}`,
          locationId: targetLoc.id,
          angleIndex: randomAnom.angleIndex,
          anomaly: randomAnom,
          currentStage: 1,
          spawnedAt: Date.now(),
        }

        return [...curr, newActive]
      })
    }

    const intervalTimer = setInterval(spawnAnomaly, 20000)

    return () => {
      clearInterval(intervalTimer)
    }
  }, [screen, isPaused, timeLeft, reportedAnomalyIds])

  // Direct switch to specific room (from bottom cards)
  const switchLocation = useCallback(
    (index: number) => {
      playSfx('camera')
      setScreenGlitch(true)
      setLocationIndex(index)
      setAngleIndex(0)
      setTimeout(() => setScreenGlitch(false), 140)
    },
    [playSfx]
  )

  // Direct switch to specific angle (from header tabs)
  const switchAngle = useCallback(
    (newAngle: number) => {
      playSfx('camera')
      setScreenGlitch(true)
      setAngleIndex(newAngle)
      setTimeout(() => setScreenGlitch(false), 140)
    },
    [playSfx]
  )

  // Sequential navigation through EVERY angle across EVERY room continuously!
  const navigateCctv = useCallback(
    (direction: 'next' | 'prev') => {
      playSfx('camera')
      setScreenGlitch(true)

      const currentIdx = ALL_CAMERA_ANGLES.findIndex(
        (cam) => cam.locationIndex === locationIndex && cam.angleIndex === angleIndex
      )
      const validCurrentIdx = currentIdx >= 0 ? currentIdx : 0

      const nextGlobalIdx =
        direction === 'next'
          ? (validCurrentIdx + 1) % ALL_CAMERA_ANGLES.length
          : (validCurrentIdx - 1 + ALL_CAMERA_ANGLES.length) % ALL_CAMERA_ANGLES.length

      const targetCam = ALL_CAMERA_ANGLES[nextGlobalIdx]
      setLocationIndex(targetCam.locationIndex)
      setAngleIndex(targetCam.angleIndex)

      setTimeout(() => setScreenGlitch(false), 140)
    },
    [locationIndex, angleIndex, playSfx]
  )

  // Keyboard navigation for desktop computers (Arrow Left/Right steps through all angles)
  useEffect(() => {
    if (screen !== 'game') return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        e.preventDefault()
        navigateCctv('prev')
      } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        e.preventDefault()
        navigateCctv('next')
      } else if (e.key.toLowerCase() === 'r' || e.key === ' ') {
        e.preventDefault()
        setReportModalOpen(true)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        if (reportModalOpen) {
          setReportModalOpen(false)
        } else {
          setIsPaused((prev) => !prev)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [screen, navigateCctv, reportModalOpen])

  // Return to Lobby (stops all game audio cleanly)
  const handleReturnToLobby = () => {
    stopAllAudio()
    setIsPaused(false)
    setScreen('lobby')
  }

  // Start new game session
  const handleStartGame = () => {
    stopAllAudio()
    startBgm()
    setTimeLeft(GAME_DURATION)
    setLives(MAX_LIVES)
    setScore(0)
    setResolvedCount(0)
    setActiveAnomalies([])
    setReportedAnomalyIds([])
    setLocationIndex(0)
    setAngleIndex(0)
    setIsPaused(false)
    setReportModalOpen(false)
    setScreen('game')
    playSfx('camera')
  }

  // Handle Anomaly Report
  const handleExecuteReport = (chosenType?: AnomalyType) => {
    setReportModalOpen(false)

    // Check if current room has active anomaly
    const matchIdx = activeAnomalies.findIndex((a) => a.locationId === currentLocation.id)

    if (matchIdx === -1) {
      // FALSE ALARM! No anomaly in this room -> Lose 1 life!
      setLives((prev) => Math.max(0, prev - 1))
      playSfx('buzzer')
      setReportFeedback({
        success: false,
        text: 'ALARM PALSU! Tidak ada anomali di ruangan ini (-1 Nyawa)',
      })
      setTimeout(() => setReportFeedback(null), 1800)
      return
    }

    const targetAnomalyState = activeAnomalies[matchIdx]
    const anom = targetAnomalyState.anomaly

    // Check category match if provided
    if (chosenType && anom.type !== 'anomali' && anom.type !== chosenType) {
      // WRONG CATEGORY GUESS -> Lose 1 life!
      setLives((prev) => Math.max(0, prev - 1))
      playSfx('buzzer')
      setReportFeedback({
        success: false,
        text: 'JENIS ANOMALI SALAH! Kamu keliru menebak (-1 Nyawa)',
      })
      setTimeout(() => setReportFeedback(null), 1800)
      return
    }

    // SPECIAL USER MECHANIC FOR KEBUN ANOMALY:
    if (anom.isSpecialTwoStage && targetAnomalyState.currentStage === 1) {
      playSfx('jumpscare')
      setIsScreenShaking(true)
      setJumpscareAlert('⚠️ SISTEM ERROR! ENTITAS MENOLAK LAPORAN & MENDEKAT!')

      // Transition anomaly to stage 2
      setActiveAnomalies((curr) =>
        curr.map((item, idx) => (idx === matchIdx ? { ...item, currentStage: 2 } : item))
      )

      setTimeout(() => {
        setIsScreenShaking(false)
        setJumpscareAlert(null)
      }, 2500)

      setReportFeedback({
        success: false,
        text: 'LAPORAN DITOLAK! Entitas bertambah agresif!',
      })
      setTimeout(() => setReportFeedback(null), 2000)
      return
    }

    // ANOMALY SUCCESSFULLY RESOLVED!
    // Add to reported anomalies list so this exact anomaly NEVER spawns again!
    setReportedAnomalyIds((prev) => [...prev, anom.id])
    playSfx('verified')
    setActiveAnomalies((curr) => curr.filter((_, idx) => idx !== matchIdx))
    setScore((prev) => prev + 150)
    setResolvedCount((prev) => prev + 1)
    setReportFeedback({
      success: true,
      text: 'ANOMALI TERVERIFIKASI & DIBERSIHKAN! (+150 PTS)',
    })
    setTimeout(() => setReportFeedback(null), 1800)
  }

  // Determine current image to render on CCTV monitor
  const activeRoomAnomaly = activeAnomalies.find((a) => a.locationId === currentLocation.id)
  let activeImage = currentAngle.baseImage

  if (activeRoomAnomaly && activeRoomAnomaly.angleIndex === angleIndex) {
    if (activeRoomAnomaly.currentStage === 2 && activeRoomAnomaly.anomaly.stage2Image) {
      activeImage = activeRoomAnomaly.anomaly.stage2Image
    } else {
      activeImage = activeRoomAnomaly.anomaly.image
    }
  }

  return (
    <div className={`horror-game-shell ${isScreenShaking ? 'screen-earthquake' : ''}`}>
      {/* 1. LOBBY SCREEN */}
      {screen === 'lobby' && (
        <LobbyScreen
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onStart={handleStartGame}
        />
      )}

      {/* 2. SURVEILLANCE GAME SCREEN (FULL SCREEN 100%) */}
      {screen === 'game' && (
        <main className="game-desktop-workspace">
          {/* Top Surveillance Header Bar */}
          <header className="game-top-hud">
            {/* Left: Pause Hamburger Menu Button */}
            <div className="hud-left-controls">
              <button
                type="button"
                className="btn-hamburger-menu"
                onClick={() => {
                  playSfx('beep')
                  setIsPaused(true)
                }}
                title="Jeda Game / Menu (ESC)"
              >
                <Menu className="w-5 h-5" />
                <span className="btn-menu-label">MENU</span>
              </button>
            </div>

            {/* Center: Current Room Location Title & Angle Tabs */}
            <div className="hud-location-header">
              <div className="location-cam-pill">CAM-{currentLocation.camNumber}</div>
              <h1 className="location-title-text">{currentLocation.name}</h1>
              {currentLocation.angles.length > 1 && (
                <div className="location-angle-pills">
                  {currentLocation.angles.map((ang, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`angle-tab-btn ${angleIndex === idx ? 'angle-tab-active' : ''}`}
                      onClick={() => switchAngle(idx)}
                    >
                      SUDUT {idx + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Lives, Timer, & Score */}
            <div className="hud-right-stats">
              {/* 3 Lives / Hearts */}
              <div className="hud-lives-container" title={`${lives} Nyawa Tersisa`}>
                <span className="lives-label">NYAWA:</span>
                <div className="hearts-row">
                  {[1, 2, 3].map((num) => (
                    <Heart
                      key={num}
                      className={`w-6 h-6 transition-all duration-300 ${
                        num <= lives
                          ? 'fill-rose-500 text-rose-500 heart-pulse'
                          : 'fill-neutral-800 text-neutral-700 opacity-40'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* 10-Minute Countdown Clock */}
              <div className="hud-clock-pill">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span className={`clock-digit ${timeLeft < 60 ? 'clock-critical' : ''}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>

              {/* Score */}
              <div className="hud-score-pill">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="score-digit">{score}</span>
                <span className="score-sub">PTS</span>
              </div>
            </div>
          </header>

          {/* Main Workspace Stage: Monitor on Left/Center + Right Sidebar (Bus Seats / Direct Report) */}
          <div className="game-main-content-row">
            {/* Central Surveillance Monitor */}
            <section className="game-monitor-stage-wrap">
              <div
                className={`game-cctv-monitor ${screenGlitch ? 'cctv-glitch-active' : ''}`}
                onClick={() => setReportModalOpen(true)}
                role="group"
                aria-label={`Feed CCTV ${currentLocation.name}`}
              >
                {/* CCTV Feed Photo Image - 100% Full View */}
                <div className="cctv-photo-wrapper">
                  <Image
                    src={activeImage}
                    alt={`Feed CCTV ${currentLocation.name}`}
                    fill
                    priority
                    sizes="100vw"
                    className="cctv-photo"
                  />
                </div>

                {/* Scanlines, Vignette & Noise */}
                <div className="cctv-scanlines-layer" />
                <div className="cctv-vignette-layer" />

                {/* Monitor Overlay Stamps */}
                <div className="monitor-top-left-stamp">
                  <span className="stamp-cam-badge">CAM-{currentLocation.camNumber}</span>
                  <span className="stamp-text-time">{liveClock}</span>
                  <span className="stamp-text-loc">• {currentLocation.name}</span>
                  {currentLocation.angles.length > 1 && (
                    <span className="stamp-text-angle">• {currentAngle.name}</span>
                  )}
                </div>

                <div className="monitor-top-right-stamp">
                  <span className="rec-indicator-dot" />
                  <span className="rec-text">REC • LIVE 30FPS</span>
                </div>

                {/* Left / Right Camera Switch Floating Arrows (Steps through ALL angles sequentially!) */}
                <button
                  type="button"
                  className="cctv-edge-arrow arrow-prev"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateCctv('prev')
                  }}
                  title="Sudut / Kamera Sebelumnya (Panah Kiri / A)"
                >
                  ◀
                </button>

                <button
                  type="button"
                  className="cctv-edge-arrow arrow-next"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateCctv('next')
                  }}
                  title="Sudut / Kamera Berikutnya (Panah Kanan / D)"
                >
                  ▶
                </button>

                {/* Jumpscare / Special Event Alert Banner */}
                {jumpscareAlert && (
                  <div className="jumpscare-terror-banner">
                    <AlertOctagon className="w-8 h-8 text-rose-500 animate-spin" />
                    <span>{jumpscareAlert}</span>
                  </div>
                )}

                {/* Feedback Toast Banner */}
                {reportFeedback && (
                  <div
                    className={`report-toast-banner ${
                      reportFeedback.success ? 'toast-success' : 'toast-error'
                    }`}
                  >
                    {reportFeedback.success ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-300" />
                    )}
                    <span>{reportFeedback.text}</span>
                  </div>
                )}
              </div>
            </section>

            {/* Right Sidebar: Denah Bus-Seat Lokasi ATAU Panel Lapor Anomali Ringkas */}
            <aside className="game-right-sidebar-panel">
              {!reportModalOpen ? (
                /* STATE 1: DENAH CCTV ALA KURSI BUS */
                <div className="bus-plan-card">
                  <div className="bus-plan-header">
                    <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span className="bus-plan-title">DENAH CCTV (6 TITIK)</span>
                  </div>

                  <div className="bus-seats-grid">
                    {GAME_LOCATIONS.map((loc, idx) => {
                      const isCurrent = locationIndex === idx
                      return (
                        <button
                          key={loc.id}
                          type="button"
                          className={`bus-seat-card ${isCurrent ? 'seat-card-active' : ''}`}
                          onClick={() => switchLocation(idx)}
                          title={`Beralih ke CAM-${loc.camNumber} ${loc.name}`}
                        >
                          <div className="seat-top-badge">CAM-{loc.camNumber}</div>
                          <div className="seat-loc-name">{loc.name}</div>
                          <div className="seat-loc-sub">{loc.angles.length} Sudut</div>
                          {isCurrent && <span className="seat-live-dot" />}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    type="button"
                    className="btn-bus-report-action"
                    onClick={() => setReportModalOpen(true)}
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>LAPORKAN ANOMALI (R)</span>
                  </button>
                </div>
              ) : (
                /* STATE 2: PANEL LAPOR ANOMALI RINGKAS (NIMPAH DI KANAN, MONITOR TETAP JERNIH TRANSPARAN!) */
                <motion.div
                  className="report-sidebar-card"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="report-sidebar-top">
                    <div className="report-sidebar-title-row">
                      <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
                      <h2 className="report-sidebar-title">LAPOR ANOMALI</h2>
                    </div>
                    <button
                      type="button"
                      className="btn-sidebar-close"
                      onClick={() => setReportModalOpen(false)}
                      title="Tutup / Batal (ESC)"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="report-target-indicator">
                    <span className="target-label">TARGET:</span>
                    <strong className="target-name">CAM-{currentLocation.camNumber} {currentLocation.name}</strong>
                  </div>

                  {/* Opsi Langsung Tanpa Teks Deskripsi Panjang */}
                  <div className="report-direct-buttons">
                    {ANOMALY_REPORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.type}
                        type="button"
                        className="btn-direct-report-item"
                        onClick={() => handleExecuteReport(opt.type)}
                      >
                        <span className="direct-opt-icon">{opt.icon}</span>
                        <span className="direct-opt-name">{opt.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Tombol Lapor Langsung Cepat */}
                  <button
                    type="button"
                    className="btn-instant-confirm"
                    onClick={() => handleExecuteReport()}
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>⚡ LAPOR LANGSUNG</span>
                  </button>

                  <button
                    type="button"
                    className="btn-sidebar-cancel-action"
                    onClick={() => setReportModalOpen(false)}
                  >
                    Batal (ESC)
                  </button>
                </motion.div>
              )}
            </aside>
          </div>

          {/* Pause Hamburger Menu Modal */}
          <AnimatePresence>
            {isPaused && (
              <div className="centered-modal-overlay">
                <motion.div
                  className="pause-menu-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.18 }}
                >
                  <h2 className="pause-menu-title">PERMAINAN DIJEDA (PAUSED)</h2>
                  <p className="pause-menu-sub">Waktu dan anomali dihentikan sementara.</p>

                  <div className="pause-actions-list">
                    {/* Resume */}
                    <button
                      type="button"
                      className="pause-btn pause-btn-resume"
                      onClick={() => setIsPaused(false)}
                    >
                      <Play className="w-5 h-5 fill-current" />
                      <span>LANJUTKAN (RESUME)</span>
                    </button>

                    {/* Sound Toggle */}
                    <button
                      type="button"
                      className="pause-btn pause-btn-sound"
                      onClick={toggleMute}
                    >
                      {isMuted ? (
                        <>
                          <VolumeX className="w-5 h-5 text-rose-400" />
                          <span>SUARA : MATI (OFF)</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-5 h-5 text-emerald-400" />
                          <span>SUARA : NYALA (ON)</span>
                        </>
                      )}
                    </button>

                    {/* Return to Lobby */}
                    <button
                      type="button"
                      className="pause-btn pause-btn-home"
                      onClick={handleReturnToLobby}
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>KEMBALI KE LOBBY (HOME)</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </main>
      )}

      {/* 3. GAME OVER SCREEN */}
      {screen === 'gameover' && (
        <main className="horror-result-shell result-shell-gameover">
          <motion.div
            className="result-modal-box"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
          >
            <div className="result-skull-badge">💀</div>
            <h1 className="result-title-red">KAMU GAGAL BERTAHAN!</h1>
            <p className="result-desc-text">
              Semua nyawa habis karena kesalahan verifikasi anomali. Sekolah telah dikuasai entitas
              misterius.
            </p>

            <div className="result-score-summary">
              <div className="summary-item">
                <span className="summary-label">ANOMALI DIBERSIHKAN</span>
                <span className="summary-val">{resolvedCount}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">TOTAL SKOR</span>
                <span className="summary-val text-amber-400">{score} PTS</span>
              </div>
            </div>

            <div className="result-buttons-group">
              <button type="button" className="btn-result-action" onClick={handleStartGame}>
                <RotateCcw className="w-5 h-5" />
                <span>COBA LAGI (10 MENIT)</span>
              </button>
              <button
                type="button"
                className="btn-result-secondary"
                onClick={handleReturnToLobby}
              >
                <span>KEMBALI KE MENU UTAMA</span>
              </button>
            </div>
          </motion.div>
        </main>
      )}

      {/* 4. VICTORY SCREEN */}
      {screen === 'victory' && (
        <main className="horror-result-shell result-shell-victory">
          <motion.div
            className="result-modal-box"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
          >
            <div className="result-trophy-badge">🏆</div>
            <h1 className="result-title-green">BERHASIL BERTAHAN 10 MENIT!</h1>
            <p className="result-desc-text">
              Luar biasa! Kamu berhasil memantau CCTV dan mengamankan seluruh area sekolah dari teror
              anomali hingga fajar tiba.
            </p>

            <div className="result-score-summary">
              <div className="summary-item">
                <span className="summary-label">ANOMALI TERSELESAIKAN</span>
                <span className="summary-val">{resolvedCount}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">SISA NYAWA</span>
                <span className="summary-val text-rose-400">{lives} / 3</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">TOTAL SKOR</span>
                <span className="summary-val text-amber-400">{score} PTS</span>
              </div>
            </div>

            <div className="result-buttons-group">
              <button type="button" className="btn-result-action" onClick={handleStartGame}>
                <RotateCcw className="w-5 h-5" />
                <span>PATROLI LAGI (10 MENIT)</span>
              </button>
              <button
                type="button"
                className="btn-result-secondary"
                onClick={handleReturnToLobby}
              >
                <span>KEMBALI KE MENU UTAMA</span>
              </button>
            </div>
          </motion.div>
        </main>
      )}
    </div>
  )
}
