'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Clock3,
  Crosshair,
  Layers,
  Map,
  MapPin,
  Radio,
  RotateCcw,
  ShieldCheck,
  Trophy,
  Volume2,
  VolumeX,
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

function getRank(score: number) {
  if (score >= 1200)
    return {
      title: 'Guru BK Legendaris',
      subline: 'Semua sudut sekolah aman dan pembolos kapok total!',
      icon: 'S+',
    }
  if (score >= 800)
    return {
      title: 'Satpam Teladan',
      subline: 'Mata elang, tidak ada satu pun gerak-gerik yang luput.',
      icon: 'A',
    }
  if (score >= 400)
    return {
      title: 'Pengawas Sigap',
      subline: 'Insting ketelitian sudah mulai terasah dengan baik.',
      icon: 'B',
    }
  return {
    title: 'Petugas Magang',
    subline: 'Perhatikan detail celah sembunyi lebih teliti lagi!',
    icon: 'C',
  }
}

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
  const [soundEnabled, setSoundEnabled] = useState(true)

  const saveResultRef = useRef(false)
  const studentCounterRef = useRef(0)
  const { play } = useGameAudio()
  const location = LOCATIONS[locationIndex]
  const rank = getRank(score)

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

  // Timer Countdown (3 Minutes)
  useEffect(() => {
    if (screen !== 'game' || mapOpen) return
    const interval = window.setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0))
    }, 1000)
    return () => window.clearInterval(interval)
  }, [screen, mapOpen])

  // End Game when timer hits 0
  useEffect(() => {
    if (screen === 'game' && timeLeft === 0) {
      setScreen('results')
    }
  }, [screen, timeLeft])

  // Spawn sneaky students across the 7 locations
  useEffect(() => {
    if (screen !== 'game' || mapOpen) return

    const spawnStudent = () => {
      // Pick a random location
      const randomLoc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)]
      // Pick one of its curated hiding spots
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

      // Student stays hidden for 7-12 seconds before sneaking to another spot
      const hideDuration = 7000 + Math.random() * 5000
      window.setTimeout(() => {
        setActiveStudent((curr) => (curr?.id === student.id ? null : curr))
      }, hideDuration)
    }

    // Initial spawn if none
    if (!activeStudent) {
      const initialTimer = window.setTimeout(spawnStudent, 1200)
      return () => window.clearTimeout(initialTimer)
    }

    // Periodic check to keep game active
    const loopInterval = window.setInterval(() => {
      if (!activeStudent) {
        spawnStudent()
      }
    }, 3000)

    return () => window.clearInterval(loopInterval)
  }, [screen, mapOpen, activeStudent])

  // Save score and show celebration when game ends
  useEffect(() => {
    if (screen !== 'results' || saveResultRef.current) return
    saveResultRef.current = true
    play('gameOver')

    const newEntry: LeaderboardEntry = {
      name: playerName.trim() || 'Guru Piket',
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
      // storage unavailable fallback
    }

    // Celebrate if player made Top 3
    if (score > 0 && updated.some((e) => e.name === newEntry.name && e.score === score)) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#c8e58e', '#f3cf8c', '#60a5fa', '#f87171'],
      })
    }
  }, [screen, leaderboard, playerName, score, play])

  // Keyboard navigation (Arrow keys & 'M' for Map)
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

  // Game Handlers
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

  const handleMissClick = useCallback(
    (x: number, y: number) => {
      // gentle click feedback
      play('beep')
    },
    [play]
  )

  const returnToLobby = useCallback(() => {
    setScreen('lobby')
    setMapOpen(false)
    setActiveStudent(null)
  }, [])

  // Screens
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

  if (screen === 'map') {
    return <CampusMap onSelect={handleSelectLocation} />
  }

  if (screen === 'results') {
    return (
      <main className="result-shell">
        <motion.section
          className="result-card panel-frame"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="result-overline">
            <span className="result-icon">
              <Trophy aria-hidden="true" />
            </span>
            <span className="eyebrow">LAPORAN RAZIA SELESAI</span>
          </div>

          <div className="result-copy">
            <h1>
              Shift Berakhir,<br />
              <em>{playerName.trim() || 'Guru Piket'}.</em>
            </h1>
            <p>{rank.subline}</p>
          </div>

          <div className="rank-badge">
            <ShieldCheck aria-hidden="true" />
            <span>
              <small>PREDIKAT KETELITIAN</small>
              <strong>{rank.title}</strong>
            </span>
            <span className="rank-star">{rank.icon}</span>
          </div>

          <div className="result-stats">
            <div>
              <span>TOTAL SKOR</span>
              <strong>
                {score.toLocaleString('id-ID')}
                <small>PTS</small>
              </strong>
            </div>
            <div>
              <span>PEMBOLOS TERCIDUK</span>
              <strong>
                {caught}
                <small> SISWA</small>
              </strong>
            </div>
            <div>
              <span>TITIK DIPANTAU</span>
              <strong>
                {LOCATIONS.length}
                <small> LOKASI</small>
              </strong>
            </div>
          </div>

          <div className="result-actions">
            <button className="start-button result-restart" onClick={handleStart}>
              <span className="start-icon">
                <RotateCcw aria-hidden="true" />
              </span>
              <span>
                MAIN LAGI
                <small>MULAI RONDA BARU</small>
              </span>
              <ArrowRight aria-hidden="true" />
            </button>
            <button className="secondary-button" onClick={returnToLobby}>
              <ArrowLeft aria-hidden="true" /> KEMBALI KE MENU UTAMA
            </button>
          </div>
        </motion.section>
      </main>
    )
  }

  // Active CCTV Game Screen
  return (
    <main className="game-shell">
      {/* Game Header Bar */}
      <header className="game-topbar">
        {/* Top-Left: MAP Button */}
        <button
          className="map-open-button"
          onClick={() => setMapOpen(true)}
          title="Buka Denah Peta (Tekan M)"
        >
          <Map aria-hidden="true" />
          <span>BUKA PETA</span>
          <kbd>M</kbd>
        </button>

        {/* Center: Live Camera Status */}
        <div className="game-live-title">
          <div className="brand-symbol game-brand-symbol">
            <Camera aria-hidden="true" />
          </div>
          <div>
            <span className="eyebrow">KAMERA PENGAWAS</span>
            <strong>
              CAM {location.camera} • {location.name}
            </strong>
          </div>
          <span className="live-pill">
            <span className="rec-dot" /> LIVE
          </span>
        </div>

        {/* Top-Right: Score & 3-Minute Timer */}
        <div className="game-stats-top">
          <div className="top-stat score-stat">
            <span>SKOR</span>
            <strong>{String(score).padStart(4, '0')}</strong>
            <small>PTS</small>
          </div>
          <div className={`timer-stat ${timeLeft <= 30 ? 'timer-urgent' : ''}`}>
            <span>
              <Clock3 aria-hidden="true" /> SISA WAKTU
            </span>
            <strong>{formatTime(timeLeft)}</strong>
          </div>
        </div>
      </header>

      {/* Surveillance CCTV Screen */}
      <section className="surveillance-panel panel-frame" aria-label="Pemantauan CCTV">
        <div className="surveillance-toolbar">
          <span>
            <span className="signal-bars">
              <i />
              <i />
              <i />
            </span>{' '}
            CCTV AKTIF <i className="toolbar-divider" /> PETUGAS:{' '}
            {playerName.trim().toUpperCase() || 'GURU PIKET'}
          </span>
          <span className="toolbar-right">
            <span className="privacy-label">
              <Crosshair aria-hidden="true" /> GAME KETELITIAN MATA
            </span>
          </span>
        </div>

        {/* Camera Viewport with Left/Right navigation */}
        <div className="camera-layout">
          <button
            className="feed-arrow feed-arrow-left"
            onClick={() => switchCamera(-1)}
            aria-label="Kamera sebelumnya"
            title="Kamera sebelumnya (Panah Kiri)"
          >
            <ArrowLeft aria-hidden="true" />
            <span>SEBELUMNYA</span>
          </button>

          <CctvFeed
            location={location}
            playerName={playerName.trim()}
            activeStudent={activeStudent}
            currentAngleIndex={currentAngleIndex}
            onAngleChange={setCurrentAngleIndex}
            onCatch={handleCatchStudent}
            onMiss={handleMissClick}
          />

          <button
            className="feed-arrow feed-arrow-right"
            onClick={() => switchCamera(1)}
            aria-label="Kamera berikutnya"
            title="Kamera berikutnya (Panah Kanan)"
          >
            <span>BERIKUTNYA</span>
            <ArrowRight aria-hidden="true" />
          </button>
        </div>

        {/* CCTV Bottom Bar */}
        <div className="surveillance-footer">
          <span>
            <MapPin aria-hidden="true" /> TITIK {location.pinNumber} / {location.shortName}
          </span>
          <span>
            <span className="status-dot" /> CARI ANAK BOLOS DI GAMBAR &amp; KLIK!
          </span>
          <span>
            <Radio aria-hidden="true" /> {caught} SISWA TERCIDUK
          </span>
        </div>
      </section>

      {/* Keyboard guide footer */}
      <footer className="game-footer">
        <span>
          <kbd>←</kbd> <kbd>→</kbd> PINDAH KAMERA
        </span>
        <span>🔍 KLIK PEMBOLOS DI GAMBAR</span>
        <span>
          <kbd>M</kbd> BUKA PETA
        </span>
      </footer>

      {/* Fullscreen Interactive Map Overlay */}
      <AnimatePresence>
        {mapOpen ? (
          <CampusMap
            isOverlay
            currentLocationId={location.id}
            onClose={() => setMapOpen(false)}
            onSelect={handleSelectLocation}
          />
        ) : null}
      </AnimatePresence>
    </main>
  )
}
