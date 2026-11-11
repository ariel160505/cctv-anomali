'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { ArrowLeft, ArrowRight, AudioLines, Camera, Clock3, Crosshair, Map, MapPin, Pause, Radio, ShieldCheck, Trophy, Volume2, VolumeX } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { CampusMap } from '@/components/game/campus-map'
import { CctvFeed, createTruantStudent, type TruantStudent } from '@/components/game/cctv-feed'
import { LobbyScreen } from '@/components/game/lobby-screen'
import { PauseOverlay } from '@/components/game/pause-overlay'
import { LOCATIONS, DEFAULT_LEADERBOARD, LEADERBOARD_STORAGE_KEY, formatTime, type CampusLocation, type LeaderboardEntry } from '@/lib/game-data'
import { useGameAudio } from '@/hooks/use-game-audio'

const GAME_LENGTH = 180

type Screen = 'lobby' | 'map' | 'game' | 'results'
type CatchBanner = { id: number; x: number; y: number }

function getRank(score: number) {
  if (score >= 1000) return { title: 'Guru BK Legendaris', subline: 'Satu sekolah aman berkat kamu.', icon: 'elite' }
  if (score >= 700) return { title: 'Satpam Teladan', subline: 'Refleks dan patroli yang mantap.', icon: 'pro' }
  if (score >= 300) return { title: 'Penjaga Kelas', subline: 'Makin dekat jadi legenda sekolah.', icon: 'steady' }
  return { title: 'Petugas Magang', subline: 'Ronda lagi, tingkatkan instingmu.', icon: 'new' }
}

export function CctvPatrolGame() {
  const [screen, setScreen] = useState<Screen>('lobby')
  const [mapOpen, setMapOpen] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [locationIndex, setLocationIndex] = useState(0)
  const [playerName, setPlayerName] = useState('')
  const [leaderboard, setLeaderboard] = useState(DEFAULT_LEADERBOARD)
  const [score, setScore] = useState(0)
  const [caught, setCaught] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_LENGTH)
  const [student, setStudent] = useState<TruantStudent | null>(null)
  const [catchBanner, setCatchBanner] = useState<CatchBanner | null>(null)
  const [noiseEnabled, setNoiseEnabled] = useState(false)
  const saveResultRef = useRef(false)
  const nextStudentRef = useRef(0)
  const { play } = useGameAudio()
  const location = LOCATIONS[locationIndex]
  const rank = getRank(score)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LEADERBOARD_STORAGE_KEY)
      if (!saved) {
        window.localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(DEFAULT_LEADERBOARD))
        return
      }
      const parsed: unknown = JSON.parse(saved)
      if (Array.isArray(parsed)) {
        const validEntries = parsed.filter((item): item is LeaderboardEntry =>
          typeof item?.name === 'string' && Number.isFinite(item?.score) && item.score >= 0,
        )
        if (validEntries.length) setLeaderboard(validEntries.slice(0, 3))
      }
    } catch {
      setLeaderboard(DEFAULT_LEADERBOARD)
    }
  }, [])

  useEffect(() => {
    if (screen !== 'game' || mapOpen || isPaused) return
    const interval = window.setInterval(() => {
      setTimeLeft((remaining) => Math.max(remaining - 1, 0))
    }, 1000)
    return () => window.clearInterval(interval)
  }, [screen, mapOpen, isPaused])

  useEffect(() => {
    if (screen === 'game' && timeLeft === 0) setScreen('results')
  }, [screen, timeLeft])

  useEffect(() => {
    if (screen !== 'game' || mapOpen || isPaused || student) return
    const spawnDelay = 1400 + Math.random() * 1700
    const spawnTimeout = window.setTimeout(() => {
      nextStudentRef.current += 1
      setStudent(createTruantStudent(nextStudentRef.current))
    }, spawnDelay)
    return () => window.clearTimeout(spawnTimeout)
  }, [screen, mapOpen, isPaused, locationIndex, student])

  useEffect(() => {
    if (screen !== 'game' || mapOpen || isPaused || !student) return
    const despawnTimeout = window.setTimeout(() => {
      setStudent((current) => current?.id === student.id ? null : current)
    }, 2500 + Math.random() * 1300)
    return () => window.clearTimeout(despawnTimeout)
  }, [screen, mapOpen, isPaused, student])

  useEffect(() => {
    if (screen !== 'results' || saveResultRef.current) return
    saveResultRef.current = true
    play('gameOver')
    const nextBoard = [...leaderboard, { name: playerName.trim() || 'Petugas', score }]
      .sort((first, second) => second.score - first.score)
      .slice(0, 3)

    if (score > 0 && nextBoard.some((entry) => entry.name === (playerName.trim() || 'Petugas') && entry.score === score)) {
      setLeaderboard(nextBoard)
      try {
        window.localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(nextBoard))
      } catch {
        // A full or unavailable storage bucket should not interrupt the result screen.
      }
      if (score > (leaderboard[2]?.score ?? 0)) {
        confetti({ particleCount: 110, spread: 72, startVelocity: 32, origin: { y: 0.72 }, colors: ['#c7e88b', '#f2bc67', '#f4eee0', '#81a99b'] })
      }
    }
  }, [screen, leaderboard, playerName, score, play])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return
      if (screen !== 'game') return

      const key = event.key.toLowerCase()
      if (isPaused) {
        if (key === 'p' || event.key === 'Escape') setIsPaused(false)
        if (key === 'm') {
          setIsPaused(false)
          setMapOpen(true)
        }
        return
      }
      if (mapOpen) {
        if (event.key === 'Escape') setMapOpen(false)
        return
      }
      if (key === 'p') {
        event.preventDefault()
        setIsPaused(true)
        return
      }
      if (key === 'm') {
        event.preventDefault()
        setMapOpen(true)
        return
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setLocationIndex((index) => (index + LOCATIONS.length - 1) % LOCATIONS.length)
        setStudent(null)
        play('camera')
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        setLocationIndex((index) => (index + 1) % LOCATIONS.length)
        setStudent(null)
        play('camera')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [screen, mapOpen, isPaused, play])

  const handleStart = useCallback(() => {
    saveResultRef.current = false
    setScore(0)
    setCaught(0)
    setTimeLeft(GAME_LENGTH)
    setStudent(null)
    setCatchBanner(null)
    setNoiseEnabled(false)
    setIsPaused(false)
    play('camera')
    setScreen('map')
  }, [play])

  const handleSelectLocation = useCallback((selectedLocation: CampusLocation) => {
    setLocationIndex(LOCATIONS.findIndex((item) => item.id === selectedLocation.id))
    setStudent(null)
    play('camera')
    setScreen('game')
    setMapOpen(false)
  }, [play])

  const switchCamera = useCallback((step: number) => {
    setLocationIndex((index) => (index + step + LOCATIONS.length) % LOCATIONS.length)
    setStudent(null)
    play('camera')
  }, [play])

  const handleCatch = useCallback((target: TruantStudent) => {
    if (isPaused || mapOpen) return
    setScore((current) => current + 100)
    setCaught((current) => current + 1)
    setStudent((current) => current?.id === target.id ? null : current)
    setCatchBanner({ id: target.id, x: target.x, y: target.y })
    play('catch')
    window.setTimeout(() => setCatchBanner((current) => current?.id === target.id ? null : current), 800)
  }, [play, isPaused, mapOpen])

  const returnToLobby = useCallback(() => {
    setScreen('lobby')
    setMapOpen(false)
    setIsPaused(false)
    setStudent(null)
    setCatchBanner(null)
  }, [])

  const restart = useCallback(() => {
    handleStart()
  }, [handleStart])

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
        <motion.section className="result-card panel-frame" initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.4 }}>
          <div className="result-overline"><span className="result-icon"><Trophy aria-hidden="true" /></span><span className="eyebrow">LAPORAN RONDA / SELESAI</span></div>
          <div className="result-copy"><h1>Shift selesai,<br /><em>{playerName.trim() || 'Petugas'}.</em></h1><p>{rank.subline}</p></div>
          <div className="rank-badge"><ShieldCheck aria-hidden="true" /><span><small>PANGKAT KEAMANAN</small><strong>{rank.title}</strong></span><span className="rank-star">{rank.icon === 'elite' ? 'S+' : rank.icon === 'pro' ? 'A' : rank.icon === 'steady' ? 'B' : 'C'}</span></div>
          <div className="result-stats">
            <div><span>TOTAL SKOR</span><strong>{score.toLocaleString('id-ID')}<small>PTS</small></strong></div>
            <div><span>SISWA DIAMANKAN</span><strong>{caught}<small> ORANG</small></strong></div>
            <div><span>AREA DIPANTAU</span><strong>{LOCATIONS.length}<small> TITIK</small></strong></div>
          </div>
          <div className="result-note"><span className="status-dot" /><span>{score > (leaderboard[2]?.score ?? 0) ? 'Skor masuk papan peringkat. Kerja bagus, petugas!' : 'Laporan patroli tersimpan. Siap bertugas lagi?'}</span></div>
          <div className="result-actions"><button className="start-button result-restart" onClick={restart}><span className="start-icon"><Camera aria-hidden="true" /></span><span>MAIN LAGI<small>RONDA BERIKUTNYA</small></span><ArrowRight aria-hidden="true" /></button><button className="secondary-button" onClick={returnToLobby}><ArrowLeft aria-hidden="true" /> MENU UTAMA</button></div>
          <div className="result-foot"><span><AudioLines aria-hidden="true" /> REKAMAN BERAKHIR</span><span>SEKOLAH NUSANTARA / UNIT 07</span></div>
        </motion.section>
      </main>
    )
  }

  return (
    <main className="game-shell">
      <header className="game-topbar">
        <button className="map-open-button" onClick={() => setMapOpen(true)}><Map aria-hidden="true" /><span>BUKA PETA</span><kbd>M</kbd></button>
        <div className="game-live-title"><div className="brand-symbol game-brand-symbol"><Camera aria-hidden="true" /></div><div><span className="eyebrow">UNIT CCTV / LANGSUNG</span><strong>CAM {location.camera} <i /> {location.name}</strong></div><span className="live-pill"><span className="rec-dot" /> REC</span></div>
        <div className="game-stats-top">
          <div className="top-stat score-stat"><span>SKOR</span><strong>{String(score).padStart(4, '0')}</strong><small>PTS</small></div>
          <div className={`timer-stat ${isPaused ? 'timer-paused' : timeLeft <= 30 ? 'timer-urgent' : ''}`}><span><Clock3 aria-hidden="true" /> {isPaused ? 'JEDA' : 'SISA WAKTU'}</span><strong>{formatTime(timeLeft)}</strong></div>
        </div>
      </header>

      <section className="surveillance-panel panel-frame" aria-label="Pemantauan kamera CCTV">
        <div className="surveillance-toolbar"><span><span className="signal-bars"><i /><i /><i /></span> MONITORING AKTIF <i className="toolbar-divider" /> PETUGAS: {playerName.trim().toUpperCase()}</span><span className="toolbar-right"><button className="pause-toggle" onClick={() => setIsPaused(true)} aria-label="Jeda patroli"><Pause aria-hidden="true" /><span>JEDA</span><kbd>P</kbd></button><button className="noise-toggle" onClick={() => setNoiseEnabled((enabled) => !enabled)} aria-pressed={noiseEnabled} title={noiseEnabled ? 'Matikan noise' : 'Nyalakan noise'}>{noiseEnabled ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}<span>NOISE {noiseEnabled ? 'ON' : 'OFF'}</span></button><span className="privacy-label"><Crosshair aria-hidden="true" /> 2× DIGITAL</span></span></div>
        <div className="camera-layout">
          <button className="feed-arrow feed-arrow-left" onClick={() => switchCamera(-1)} aria-label="Kamera sebelumnya"><ArrowLeft aria-hidden="true" /><span>SEBELUMNYA</span></button>
          <CctvFeed location={location} playerName={playerName.trim()} student={student} catchBanner={catchBanner} captured={Boolean(catchBanner)} noiseEnabled={noiseEnabled} onCatch={handleCatch} />
          <button className="feed-arrow feed-arrow-right" onClick={() => switchCamera(1)} aria-label="Kamera berikutnya"><span>BERIKUTNYA</span><ArrowRight aria-hidden="true" /></button>
        </div>
        <div className="surveillance-footer"><span><MapPin aria-hidden="true" /> TITIK {location.camera} <b>/</b> {location.shortName}</span><span><span className="status-dot" /> <span className="detect-label">SISTEM DETEKSI AKTIF</span></span><span><Radio aria-hidden="true" /> {caught} SISWA DIAMANKAN</span></div>
      </section>

      <footer className="game-footer"><span><kbd>←</kbd><kbd>→</kbd> PINDAH KAMERA</span><span>KLIK SISWA UNTUK MENANGKAP</span><span><kbd>P</kbd> JEDA RONDA</span><span><kbd>M</kbd> BUKA PETA</span></footer>

      <AnimatePresence>
        {mapOpen ? <CampusMap isOverlay onClose={() => setMapOpen(false)} onSelect={handleSelectLocation} /> : null}
        {isPaused ? <PauseOverlay onResume={() => setIsPaused(false)} onOpenMap={() => { setIsPaused(false); setMapOpen(true) }} /> : null}
      </AnimatePresence>
    </main>
  )
}
