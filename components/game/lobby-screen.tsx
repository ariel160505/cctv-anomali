'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  AlertTriangle,
  BookOpen,
  Camera,
  Heart,
  HelpCircle,
  Monitor,
  Play,
  Radio,
  Trophy,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { getLeaderboard, type LeaderboardEntry } from '@/lib/game-data'

const PREVIEW_IMAGES = [
  '/images/game/gedung-smk/GSMK1-asli.jpg',
  '/images/game/gedung-smp/GSMP1-asli.jpg',
  '/images/game/kantin/K1-asli.jpg',
  '/images/game/kebun/KBN1-asli.jpg',
  '/images/game/lapangan/LP-asli.jpg',
  '/images/game/parkiran/P1-Asli.jpg',
  '/images/game/gedung-smk/GSMK2-asli.jpg',
  '/images/game/kantin/K2-asli.jpg',
]

type LobbyScreenProps = {
  isMuted: boolean
  onToggleMute: () => void
  onStart: () => void
}

export function LobbyScreen({ isMuted, onToggleMute, onStart }: LobbyScreenProps) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [showGuide, setShowGuide] = useState(false)
  const [flicker, setFlicker] = useState(false)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    setLeaderboard(getLeaderboard())
  }, [])

  // Automatic CCTV camera feed cycle in the monitor
  useEffect(() => {
    const timer = setInterval(() => {
      setFlicker(true)
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % PREVIEW_IMAGES.length)
        setFlicker(false)
      }, 120)
    }, 1800)

    return () => clearInterval(timer)
  }, [])

  return (
    <main className="horror-lobby-shell">
      {/* Background Ambience Grid */}
      <div className="horror-grid-bg" />

      {/* Header Bar */}
      <header className="lobby-top-bar">
        <div className="brand-terminal-badge">
          <Camera className="w-4 h-4 text-emerald-400" />
          <span>SECURITY SURVEILLANCE UNIT</span>
        </div>
        <button
          type="button"
          className="btn-sound-toggle"
          onClick={onToggleMute}
          title={isMuted ? 'Nyalakan Musik' : 'Matikan Musik'}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-rose-400" />
              <span>MUSIK : OFF</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>MUSIK : ON</span>
            </>
          )}
        </button>
      </header>

      {/* Main Lobby Content (Monitor & Right Leaderboard Sidebar) */}
      <div className="lobby-stage-layout">
        {/* Main Center Container */}
        <div className="lobby-center-container">
          {/* Game Title */}
          <div className="lobby-title-wrap">
            <span className="game-sys-tag">CLASSIFIED ANOMALY MONITOR</span>
            <h1 className="horror-main-title">
              CCTV : <span className="title-red">AQIS</span>
            </h1>
            <p className="horror-tagline">
              Protokol Pengawasan Keamanan & Deteksi Anomali Sekolah
            </p>
          </div>

          {/* Central Animated CCTV CRT Monitor */}
          <div className="cctv-crt-monitor-case">
            <div className="crt-monitor-bezel">
              <div className={`crt-screen-viewport ${flicker ? 'crt-flicker-active' : ''}`}>
                {/* Cycling CCTV camera image */}
                <div className="crt-image-layer">
                  <Image
                    src={PREVIEW_IMAGES[currentIdx]}
                    alt="CCTV Feed Live Preview"
                    fill
                    priority
                    sizes="(max-width: 900px) 100vw, 750px"
                    className="crt-img"
                  />
                </div>

                {/* CRT Scanlines, Curve & Glitch */}
                <div className="crt-scanlines" />
                <div className="crt-glow-overlay" />

                {/* Monitor Overlay Stamps */}
                <div className="crt-stamp-top">
                  <span className="crt-rec-dot" />
                  <span>REC • LIVE CAM-0{currentIdx + 1}</span>
                </div>
                <div className="crt-stamp-bottom">
                  <span>SIGNAL: 100% • 30 FPS • AQIS PROTOCOL</span>
                </div>
              </div>
            </div>
            <div className="crt-monitor-stand" />
          </div>

          {/* Action Controls */}
          <div className="lobby-action-box">
            <button
              type="button"
              className="btn-play-game"
              onClick={onStart}
            >
              <Play className="w-6 h-6 fill-current text-emerald-950" />
              <span>MULAI TUGAS (PLAY)</span>
            </button>

            <button
              type="button"
              className="btn-game-guide"
              onClick={() => setShowGuide(true)}
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>PANDUAN PETUGAS (GAME GUIDE)</span>
            </button>
          </div>

          <footer className="lobby-device-notice">
            <span>🖥️ GAME INI KHUSUS UNTUK PERANGKAT KOMPUTER / LAPTOP</span>
          </footer>
        </div>

        {/* Right Sidebar: Top 5 Hall of Fame */}
        <aside className="lobby-leaderboard-sidebar">
          <div className="leaderboard-card-header">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="leaderboard-title">PAPAN SKOR TERTINGGI</h2>
              <span className="leaderboard-subtitle">Top 5 Skor Pengawas</span>
            </div>
          </div>

          <div className="leaderboard-list">
            {leaderboard.map((item, idx) => {
              const rank = idx + 1
              return (
                <div key={item.id} className={`leaderboard-item rank-${rank}`}>
                  <div className="item-rank-badge">0{rank}</div>
                  <div className="item-info">
                    <span className="item-rank-label">PERINGKAT 0{rank}</span>
                    <span className="item-role">{item.date}</span>
                  </div>
                  <div className="item-score">
                    <span className="score-num">{item.score}</span>
                    <span className="score-pts">PTS</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="leaderboard-card-footer">
            <span className="footer-status-dot" />
            <span>REKOR TERSIMPAN SECARA LOKAL</span>
          </div>
        </aside>
      </div>

      {/* Game Guide Popup Modal */}
      <AnimatePresence>
        {showGuide && (
          <div className="guide-modal-overlay" onClick={() => setShowGuide(false)}>
            <motion.div
              className="guide-modal-card"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ duration: 0.2 }}
            >
              <div className="guide-header">
                <div className="guide-title-left">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  <h2>PANDUAN OPERASIONAL CCTV : AQIS</h2>
                </div>
                <button
                  type="button"
                  className="guide-close-btn"
                  onClick={() => setShowGuide(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="guide-body-content">
                <div className="guide-rule-item">
                  <div className="rule-badge">1</div>
                  <div className="rule-desc">
                    <strong>⏱️ Durasi Bertahan 13 Menit</strong>
                    <p>Tugasmu adalah memantau 6 kamera CCTV sekolah selama 13 menit penuh. 2 menit awal aman untuk menghafal lokasi, setelah itu deteksi seluruh anomali hingga fajar tiba.</p>
                  </div>
                </div>

                <div className="guide-rule-item">
                  <div className="rule-badge">2</div>
                  <div className="rule-desc">
                    <strong>❤️ Sistem 3 Nyawa (Tiga Hati)</strong>
                    <p>Kamu hanya memiliki 3 nyawa. Jika kamu melaporkan anomali yang salah (alarm palsu), kamu kehilangan 1 nyawa. Kehabisan 3 nyawa berarti GAME OVER!</p>
                  </div>
                </div>

                <div className="guide-rule-item">
                  <div className="rule-badge">3</div>
                  <div className="rule-desc">
                    <strong>👁️ 6 Titik Lokasi Kamera</strong>
                    <p>Kamera meliputi: GEDUNG SMK, GEDUNG SMP, KANTIN, KEBUN, LAPANGAN, dan PARKIRAN. Klik kotak lokasi di bawah layar atau gunakan tombol panah kiri-kanan pada keyboard.</p>
                  </div>
                </div>

                <div className="guide-rule-item">
                  <div className="rule-badge">4</div>
                  <div className="rule-desc">
                    <strong>🚨 Cara Melaporkan Anomali</strong>
                    <p>Jika kamu melihat kejanggalan (benda hilang, sosok misterius, siswa mengendap-endap, atau perubahan aneh), segera klik tombol <strong>LAPORKAN ANOMALI</strong>.</p>
                  </div>
                </div>

                <div className="guide-rule-item">
                  <div className="rule-badge">5</div>
                  <div className="rule-desc">
                    <strong>⚠️ Peringatan Entitas Khusus</strong>
                    <p>Beberapa anomali bersikap agresif dan dapat mengganggu sinyal monitor saat dilaporkan. Tetap tenang dan waspada!</p>
                  </div>
                </div>
              </div>

              <div className="guide-footer">
                <button
                  type="button"
                  className="btn-guide-gotit"
                  onClick={() => setShowGuide(false)}
                >
                  SAYA MENGERTI, SIAP BERTUGAS
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}
