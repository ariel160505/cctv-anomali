'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock,
  Compass,
  Map,
  RotateCcw,
  Shield,
  ShieldAlert,
  Sparkles,
  Trophy,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { CampusMap } from '@/components/game/campus-map'
import { CctvFeed } from '@/components/game/cctv-feed'
import { LobbyScreen } from '@/components/game/lobby-screen'
import {
  LOCATIONS,
  DEFAULT_LEADERBOARD,
  LEADERBOARD_STORAGE_KEY,
  formatTime,
  type ActiveAnomaly,
  type AnomalyType,
  type CampusLocation,
  type LeaderboardEntry,
} from '@/lib/game-data'
import { useGameAudio } from '@/hooks/use-game-audio'

const GAME_LENGTH = 300 // 5 minutes = 300 seconds

type Screen = 'lobby' | 'map' | 'game' | 'results'

export function CctvPatrolGame() {
  const [screen, setScreen] = useState<Screen>('lobby')
  const [mapOpen, setMapOpen] = useState(false)
  const [locationIndex, setLocationIndex] = useState(0)
  const [currentAngleIndex, setCurrentAngleIndex] = useState(0)
  const [playerName, setPlayerName] = useState('')
  const [leaderboard, setLeaderboard] = useState(DEFAULT_LEADERBOARD)
  const [score, setScore] = useState(0)
  const [resolvedCount, setResolvedCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_LENGTH)
  const [activeAnomalies, setActiveAnomalies] = useState<ActiveAnomaly[]>([])

  const saveResultRef = useRef(false)
  const counterRef = useRef(0)
  const { play } = useGameAudio()
  const location = LOCATIONS[locationIndex]

  // Load Leaderboard from localStorage
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LEADERBOARD_STORAGE_KEY)
      if (saved) {
        const parsed: unknown = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter(
            (item): item is LeaderboardEntry =>
              typeof item?.name === 'string' && Number.isFinite(item?.score) && item.score >= 0
          )
          if (valid.length) setLeaderboard(valid.slice(0, 3))
        }
      } else {
        window.localStorage.setItem(
          LEADERBOARD_STORAGE_KEY,
          JSON.stringify(DEFAULT_LEADERBOARD)
        )
      }
    } catch {
      setLeaderboard(DEFAULT_LEADERBOARD)
    }
  }, [])

  // Timer countdown (5 Minutes = 300s)
  useEffect(() => {
    if (screen !== 'game' || mapOpen) return
    const interval = window.setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0))
    }, 1000)
    return () => window.clearInterval(interval)
  }, [screen, mapOpen])

  // End game when timer reaches 0
  useEffect(() => {
    if (screen === 'game' && timeLeft === 0) {
      setScreen('results')
    }
  }, [screen, timeLeft])

  // Anomaly Spawner: observation duty style across the school cameras
  useEffect(() => {
    if (screen !== 'game' || mapOpen) return

    const spawnAnomaly = () => {
      setActiveAnomalies((curr) => {
        if (curr.length >= 4) return curr

        const occupiedLocIds = new Set(curr.map((a) => a.locationId))
        const eligibleLocations = LOCATIONS.filter(
          (loc) => !occupiedLocIds.has(loc.id) && loc.anomalies.length > 0
        )

        if (eligibleLocations.length === 0) return curr

        const targetLoc = eligibleLocations[Math.floor(Math.random() * eligibleLocations.length)]
        const randomAnom = targetLoc.anomalies[Math.floor(Math.random() * targetLoc.anomalies.length)]

        counterRef.current += 1
        const newActive: ActiveAnomaly = {
          id: `active-${counterRef.current}-${randomAnom.id}`,
          locationId: targetLoc.id,
          anomaly: randomAnom,
          spawnedAt: Date.now(),
        }

        return [...curr, newActive]
      })
    }

    const timer = window.setInterval(spawnAnomaly, 18000)
    const initialTimer = window.setTimeout(spawnAnomaly, 4000)

    return () => {
      window.clearInterval(timer)
      window.clearTimeout(initialTimer)
    }
  }, [screen, mapOpen])

  // Audio cue when threat reaches critical
  useEffect(() => {
    if (screen === 'game' && activeAnomalies.length >= 3) {
      play('siren')
    }
  }, [activeAnomalies.length, screen, play])

  // Results Screen: Save High Score and Trigger Confetti
  useEffect(() => {
    if (screen === 'results' && !saveResultRef.current) {
      saveResultRef.current = true
      play('gameOver')

      const finalName = playerName.trim() || 'Petugas Patroli'
      const newEntry: LeaderboardEntry = {
        name: finalName,
        score,
        date: new Date().toLocaleDateString('id-ID'),
      }

      setLeaderboard((prev) => {
        const merged = [...prev, newEntry]
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)

        try {
          window.localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(merged))
        } catch {
          // ignore storage error
        }
        return merged
      })

      if (score >= 450) {
        try {
          void confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
          })
        } catch {
          // confetti fallback
        }
      }
    }
  }, [screen, score, playerName, play])

  // Camera Navigation
  const handlePrevCamera = useCallback(() => {
    play('camera')
    setLocationIndex((prev) => (prev - 1 + LOCATIONS.length) % LOCATIONS.length)
    setCurrentAngleIndex(0)
  }, [play])

  const handleNextCamera = useCallback(() => {
    play('camera')
    setLocationIndex((prev) => (prev + 1) % LOCATIONS.length)
    setCurrentAngleIndex(0)
  }, [play])

  // Keyboard navigation shortcuts
  useEffect(() => {
    if (screen !== 'game') return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        e.preventDefault()
        handlePrevCamera()
      } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        e.preventDefault()
        handleNextCamera()
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault()
        setMapOpen((curr) => !curr)
        play('beep')
      } else if (e.key === 'Escape') {
        setMapOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [screen, handlePrevCamera, handleNextCamera, play])

  // Anomaly Verification Handler
  const handleReportAnomaly = useCallback(
    (type: AnomalyType, clickX: number, clickY: number): boolean => {
      const matchIndex = activeAnomalies.findIndex((a) => a.locationId === location.id)
      if (matchIndex === -1) {
        play('buzzer')
        return false
      }

      const currentTarget = activeAnomalies[matchIndex]
      const anom = currentTarget.anomaly

      if (anom.type !== type) {
        play('buzzer')
        return false
      }

      const dist = Math.hypot(clickX - anom.x, clickY - anom.y)
      const inBox =
        clickX >= anom.x - anom.w &&
        clickX <= anom.x + anom.w &&
        clickY >= anom.y - anom.h &&
        clickY <= anom.y + anom.h

      if (dist > 25 && !inBox && (clickX !== 50 || clickY !== 50)) {
        play('buzzer')
        return false
      }

      // SUCCESS VERIFIED
      play('verified')
      setActiveAnomalies((curr) => curr.filter((_, idx) => idx !== matchIndex))
      setScore((prev) => prev + 150)
      setResolvedCount((prev) => prev + 1)
      return true
    },
    [activeAnomalies, location.id, play]
  )

  // Start new game session
  const handleStartGame = () => {
    saveResultRef.current = false
    setScore(0)
    setResolvedCount(0)
    setTimeLeft(GAME_LENGTH)
    setActiveAnomalies([])
    setMapOpen(false)
    setLocationIndex(0)
    setCurrentAngleIndex(0)
    setScreen('game')
    play('camera')
  }

  const currentRoomAnomaly = activeAnomalies.find((a) => a.locationId === location.id) || null

  return (
    <div className="modern-game-viewport">
      {screen === 'lobby' && (
        <LobbyScreen
          leaderboard={leaderboard}
          playerName={playerName}
          onPlayerNameChange={setPlayerName}
          onStart={handleStartGame}
        />
      )}

      {screen === 'game' && (
        <main className="modern-cctv-workspace">
          {/* Top Surveillance Control Bar */}
          <header className="modern-cctv-header">
            {/* Left: Map Button & Status */}
            <div className="header-left-group">
              <button
                type="button"
                className="hud-map-btn"
                onClick={() => {
                  setMapOpen(true)
                  play('beep')
                }}
                title="Buka Peta Kampus (M)"
              >
                <Map className="w-4 h-4 text-emerald-400" />
                <span>PETA (M)</span>
              </button>

              {/* Status Threat Indicator */}
              <div
                className={`threat-status-badge ${
                  activeAnomalies.length >= 3
                    ? 'threat-danger'
                    : activeAnomalies.length > 0
                    ? 'threat-warning'
                    : 'threat-calm'
                }`}
              >
                {activeAnomalies.length >= 3 ? (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                    <span>KRITIS ({activeAnomalies.length})</span>
                  </>
                ) : activeAnomalies.length > 0 ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>WASPADA ({activeAnomalies.length})</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <span>AMAN</span>
                  </>
                )}
              </div>
            </div>

            {/* Center: Camera Quick Switcher */}
            <div className="header-center-nav">
              <button
                type="button"
                className="header-nav-arrow"
                onClick={handlePrevCamera}
                title="Kamera Sebelumnya (A / Panah Kiri)"
              >
                ◀
              </button>
              <div className="header-cam-title">
                <span className="header-cam-no">CAM-{location.camera}</span>
                <span className="header-cam-name">{location.name}</span>
              </div>
              <button
                type="button"
                className="header-nav-arrow"
                onClick={handleNextCamera}
                title="Kamera Berikutnya (D / Panah Kanan)"
              >
                ▶
              </button>
            </div>

            {/* Right: Clock & Score */}
            <div className="header-right-group">
              <div className="hud-timer-badge">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span className="hud-timer-num">{formatTime(timeLeft)}</span>
              </div>
              <div className="hud-score-badge">
                <Trophy className="w-4 h-4 text-amber-300" />
                <span className="hud-stat-num">{score}</span>
                <span className="hud-stat-label">PTS</span>
              </div>
            </div>
          </header>

          {/* Central Surveillance Feed */}
          <section className="modern-monitor-container">
            <CctvFeed
              location={location}
              playerName={playerName}
              activeAnomaly={currentRoomAnomaly}
              currentAngleIndex={currentAngleIndex}
              onAngleChange={setCurrentAngleIndex}
              onPrevCamera={handlePrevCamera}
              onNextCamera={handleNextCamera}
              onReportAnomaly={handleReportAnomaly}
            />
          </section>

          {/* Fullscreen Campus Map Overlay */}
          <AnimatePresence>
            {mapOpen && (
              <CampusMap
                isOverlay
                currentLocationId={location.id}
                onSelect={(loc) => {
                  const idx = LOCATIONS.findIndex((l) => l.id === loc.id)
                  if (idx !== -1) {
                    setLocationIndex(idx)
                    setCurrentAngleIndex(0)
                  }
                  setMapOpen(false)
                  play('camera')
                }}
                onClose={() => {
                  setMapOpen(false)
                  play('beep')
                }}
              />
            )}
          </AnimatePresence>
        </main>
      )}

      {/* Results / Game Over Screen */}
      {screen === 'results' && (
        <main className="modern-results-screen">
          <motion.div
            className="results-card-container"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="results-header-tag">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>PATROLI 5 MENIT SELESAI</span>
            </div>

            <h1 className="results-hero-title">HASIL PATROLI CCTV</h1>
            <p className="results-hero-sub">
              Terima kasih <strong>{playerName || 'Petugas'}</strong> telah menjaga keamanan sekolah dari anomali dan siswa bolos!
            </p>

            <div className="results-stat-grid">
              <div className="result-metric-card">
                <div className="metric-label">TOTAL SKOR</div>
                <div className="metric-value metric-gold">{score}</div>
              </div>
              <div className="result-metric-card">
                <div className="metric-label">ANOMALI DIBERSIHKAN</div>
                <div className="metric-value metric-emerald">{resolvedCount}</div>
              </div>
            </div>

            {/* Top 3 Hall of Fame */}
            <div className="results-leaderboard-box">
              <div className="box-title">
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>TOP 3 SKOR TERTINGGI</span>
              </div>
              <div className="box-entries">
                {leaderboard.map((entry, index) => (
                  <div key={index} className="leaderboard-entry-row">
                    <span className="entry-rank">#{index + 1}</span>
                    <span className="entry-name">{entry.name}</span>
                    <span className="entry-score">{entry.score} pts</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="results-cta-group">
              <button
                type="button"
                className="btn-play-again"
                onClick={handleStartGame}
              >
                <RotateCcw className="w-5 h-5" />
                <span>PATROLI LAGI (5 MENIT)</span>
              </button>
              <button
                type="button"
                className="btn-back-lobby"
                onClick={() => setScreen('lobby')}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>KEMBALI KE LOBBY</span>
              </button>
            </div>
          </motion.div>
        </main>
      )}
    </div>
  )
}
