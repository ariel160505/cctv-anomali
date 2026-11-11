'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import {
  ArrowLeft,
  Camera,
  Clock,
  Compass,
  Map,
  RotateCcw,
  Sparkles,
  Trophy,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { CampusMap } from '@/components/game/campus-map'
import { CctvFeed, type ActiveStudent } from '@/components/game/cctv-feed'
import { LobbyScreen } from '@/components/game/lobby-screen'
import {
  LOCATIONS,
  DEFAULT_LEADERBOARD,
  LEADERBOARD_STORAGE_KEY,
  formatTime,
  type CampusLocation,
  type LeaderboardEntry,
} from '@/lib/game-data'
import { useGameAudio } from '@/hooks/use-game-audio'

const GAME_LENGTH = 180 // 3 minutes = 180 seconds

type Screen = 'lobby' | 'map' | 'game' | 'results'

export function CctvPatrolGame() {
  const [screen, setScreen] = useState<Screen>('lobby')
  const [mapOpen, setMapOpen] = useState(false)
  const [locationIndex, setLocationIndex] = useState(0)
  const [currentAngleIndex, setCurrentAngleIndex] = useState(0)
  const [playerName, setPlayerName] = useState('')
  const [leaderboard, setLeaderboard] = useState(DEFAULT_LEADERBOARD)
  const [score, setScore] = useState(0)
  const [caught, setCaught] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_LENGTH)
  const [activeStudent, setActiveStudent] = useState<ActiveStudent | null>(null)

  const saveResultRef = useRef(false)
  const studentCounterRef = useRef(0)
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

  // Timer countdown (3 Minutes)
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

  // Spawn sneaky students realistically across the 7 locations
  useEffect(() => {
    if (screen !== 'game' || mapOpen) return

    const spawnStudent = () => {
      const randomLoc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)]
      const randomSpot =
        randomLoc.hidingSpots[Math.floor(Math.random() * randomLoc.hidingSpots.length)]

      studentCounterRef.current += 1
      const student: ActiveStudent = {
        id: studentCounterRef.current,
        locationId: randomLoc.id,
        spot: randomSpot,
        spawnTime: Date.now(),
      }

      setActiveStudent(student)

      // Student hides for 7-12 seconds before sneaking to another spot
      const hideDuration = 7000 + Math.random() * 5000
      window.setTimeout(() => {
        setActiveStudent((curr) => (curr?.id === student.id ? null : curr))
      }, hideDuration)
    }

    if (!activeStudent) {
      const initialTimer = window.setTimeout(spawnStudent, 1000)
      return () => window.clearTimeout(initialTimer)
    }

    const loopInterval = window.setInterval(() => {
      if (!activeStudent) {
        spawnStudent()
      }
    }, 3000)

    return () => window.clearInterval(loopInterval)
  }, [screen, mapOpen, activeStudent])

  // Save score and trigger celebration
  useEffect(() => {
    if (screen !== 'results' || saveResultRef.current) return
    saveResultRef.current = true
    play('gameOver')

    const newEntry: LeaderboardEntry = {
      name: playerName.trim() || 'Petugas',
      score,
      date: new Date().toLocaleDateString('id-ID'),
    }

    const updated = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)

    setLeaderboard(updated)
    try {
      window.localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // storage fallback
    }

    if (score > 0) {
      confetti({
        particleCount: 130,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#4ade80', '#facc15', '#38bdf8', '#f87171'],
      })
    }
  }, [screen, leaderboard, playerName, score, play])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLElement &&
        ['INPUT', 'TEXTAREA', 'BUTTON'].includes(e.target.tagName)
      ) {
        return
      }

      if (screen === 'game') {
        if (e.key.toLowerCase() === 'm') {
          e.preventDefault()
          setMapOpen((open) => !open)
          return
        }
        if (mapOpen && e.key === 'Escape') {
          setMapOpen(false)
          return
        }
        if (!mapOpen) {
          if (e.key === 'ArrowLeft') {
            e.preventDefault()
            switchCamera(-1)
          } else if (e.key === 'ArrowRight') {
            e.preventDefault()
            switchCamera(1)
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [screen, mapOpen])

  // Actions
  const handleStart = useCallback(() => {
    saveResultRef.current = false
    setScore(0)
    setCaught(0)
    setTimeLeft(GAME_LENGTH)
    setActiveStudent(null)
    setCurrentAngleIndex(0)
    play('camera')
    setScreen('map')
  }, [play])

  const handleSelectLocation = useCallback(
    (selectedLocation: CampusLocation) => {
      const idx = LOCATIONS.findIndex((loc) => loc.id === selectedLocation.id)
      if (idx !== -1) {
        setLocationIndex(idx)
        setCurrentAngleIndex(0)
      }
      play('camera')
      setScreen('game')
      setMapOpen(false)
    },
    [play]
  )

  const switchCamera = useCallback(
    (delta: number) => {
      setLocationIndex((curr) => {
        const next = (curr + delta + LOCATIONS.length) % LOCATIONS.length
        return next
      })
      setCurrentAngleIndex(0)
      play('camera')
    },
    [play]
  )

  const handleCatchStudent = useCallback(
    (student: ActiveStudent) => {
      setScore((s) => s + 100)
      setCaught((c) => c + 1)
      setActiveStudent(null)
      play('catch')
    },
    [play]
  )

  const handleMissClick = useCallback(() => {
    play('beep')
  }, [play])

  const returnToLobby = useCallback(() => {
    setScreen('lobby')
    setMapOpen(false)
    setActiveStudent(null)
  }, [])

  // 1. Lobby Screen
  if (screen === 'lobby') {
    return (
      <LobbyScreen
        leaderboard={leaderboard}
        playerName={playerName}
        onPlayerNameChange={setPlayerName}
        onStart={handleStart}
      />
    )
  }

  // 2. Initial Map Spawn Selection
  if (screen === 'map') {
    return <CampusMap onSelect={handleSelectLocation} />
  }

  // 3. Results Screen
  if (screen === 'results') {
    return (
      <main className="modern-result-shell">
        <motion.div
          className="modern-result-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
        >
          <div className="result-header-badge">
            <Trophy className="w-8 h-8 text-amber-400" />
            <span>WAKTU HABIS!</span>
          </div>

          <h1 className="result-player-title">
            Hebat, {playerName.trim() || 'Pemain'}!
          </h1>
          <p className="result-desc">
            Kamu telah menjaga CCTV sekolah selama 3 menit penuh.
          </p>

          <div className="result-score-box">
            <div className="score-stat-box">
              <span className="box-label">TOTAL SKOR</span>
              <strong className="box-val text-emerald-400">{score} PTS</strong>
            </div>
            <div className="score-stat-box">
              <span className="box-label">SISWA TERTANGKAP</span>
              <strong className="box-val text-amber-400">{caught} ORANG</strong>
            </div>
          </div>

          <div className="result-actions-row">
            <button className="result-btn-playagain" onClick={handleStart}>
              <RotateCcw className="w-5 h-5" />
              <span>MAIN LAGI</span>
            </button>
            <button className="result-btn-home" onClick={returnToLobby}>
              <ArrowLeft className="w-5 h-5" />
              <span>MENU UTAMA</span>
            </button>
          </div>
        </motion.div>
      </main>
    )
  }

  // 4. CCTV Patrol Game View
  return (
    <main className="modern-game-layout">
      {/* Top HUD Bar */}
      <header className="modern-game-hud">
        {/* Left: Open Map Button */}
        <button
          className="hud-map-btn"
          onClick={() => setMapOpen(true)}
          title="Buka Denah Peta (Tekan M)"
        >
          <Map className="w-5 h-5 text-emerald-400" />
          <span>LIHAT PETA</span>
          <kbd className="hud-kbd">M</kbd>
        </button>

        {/* Center: Camera Name & Location */}
        <div className="hud-center-title">
          <Camera className="w-5 h-5 text-emerald-400" />
          <span className="hud-cam-title">
            CAM {location.camera} • {location.name}
          </span>
        </div>

        {/* Right: Score & 3-Minute Countdown Timer */}
        <div className="hud-right-stats">
          <div className="hud-score-badge">
            <span className="hud-stat-label">SKOR:</span>
            <strong className="hud-stat-num">{score}</strong>
          </div>
          <div className={`hud-timer-badge ${timeLeft <= 30 ? 'hud-timer-urgent' : ''}`}>
            <Clock className="w-4 h-4 text-emerald-400" />
            <strong className="hud-timer-num">{formatTime(timeLeft)}</strong>
          </div>
        </div>
      </header>

      {/* Main CCTV Monitor Area */}
      <section className="modern-monitor-container">
        <CctvFeed
          location={location}
          playerName={playerName.trim()}
          activeStudent={activeStudent}
          currentAngleIndex={currentAngleIndex}
          onAngleChange={setCurrentAngleIndex}
          onPrevCamera={() => switchCamera(-1)}
          onNextCamera={() => switchCamera(1)}
          onCatch={handleCatchStudent}
          onMiss={handleMissClick}
        />
      </section>

      {/* Simple Bottom Guide */}
      <footer className="modern-bottom-bar">
        <span>⌨️ Tekan <b>←</b> dan <b>→</b> di keyboard untuk ganti kamera</span>
        <span>🔍 Perhatikan sudut gambar dan klik pembolos untuk menangkap!</span>
      </footer>

      {/* Map Overlay Modal */}
      <AnimatePresence>
        {mapOpen && (
          <CampusMap
            isOverlay
            currentLocationId={location.id}
            onClose={() => setMapOpen(false)}
            onSelect={handleSelectLocation}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
