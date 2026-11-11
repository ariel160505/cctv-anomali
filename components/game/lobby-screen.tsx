'use client'

import { FormEvent, useState } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  Camera,
  CheckCircle2,
  Eye,
  Radio,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
} from 'lucide-react'
import { motion } from 'motion/react'
import type { LeaderboardEntry } from '@/lib/game-data'
import { PatrolMascot } from './mascot'

type LobbyScreenProps = {
  leaderboard: LeaderboardEntry[]
  playerName: string
  onPlayerNameChange: (value: string) => void
  onStart: () => void
}

export function LobbyScreen({
  leaderboard,
  playerName,
  onPlayerNameChange,
  onStart,
}: LobbyScreenProps) {
  const [nameError, setNameError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!playerName.trim()) {
      setNameError('Ketik nama kamu sebelum mulai ronda.')
      return
    }
    if (playerName.trim().length < 2) {
      setNameError('Nama minimal 2 karakter.')
      return
    }
    setNameError('')
    onStart()
  }

  return (
    <main className="lobby-shell">
      {/* Brand Header */}
      <header className="brand-row">
        <div className="brand-lockup">
          <div className="brand-symbol">
            <Camera aria-hidden="true" />
          </div>
          <div>
            <p className="brand-name">
              CCTV<span>://</span>PATROL
            </p>
            <p className="brand-subtitle">OPERASI RAZIA PEMBOLOS SEKOLAH</p>
          </div>
        </div>
        <div className="system-status">
          <span className="status-dot" /> 7 TITIK CCTV AKTIF{' '}
          <span className="status-divider" /> GAME KETELITIAN MATA <Radio aria-hidden="true" />
        </div>
      </header>

      {/* Main Lobby Grid */}
      <section className="lobby-grid">
        {/* Left Hero Panel */}
        <motion.div
          className="hero-panel panel-frame"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="hero-topline">
            <span>
              <span className="signal-bars">
                <i />
                <i />
                <i />
              </span>{' '}
              CCTV SURVEILLANCE SYSTEM
            </span>
            <span>
              REC <span className="rec-dot" />
            </span>
          </div>
          <div className="hero-grid-lines" aria-hidden="true" />

          {/* Copy & Play Form */}
          <div className="hero-copy">
            <span className="eyebrow">
              <Eye aria-hidden="true" /> GAME UJI KETELITIAN CCTV
            </span>
            <h1>
              Yang bolos,<br />
              <em>pasti ketahuan!</em>
            </h1>
            <p className="hero-lede">
              Anak-anak pembolos bersembunyi dan menyamar di kantin, parkiran, kebun, hingga koridor kelas. Pasang matamu baik-baik dan tangkap mereka sebelum bel berbunyi!
            </p>

            <form className="start-form" onSubmit={handleSubmit} noValidate>
              <label htmlFor="player-name">
                NAMA PETUGAS <span>/ GURU PIKET</span>
              </label>
              <div className={`name-input-wrap ${nameError ? 'name-input-error' : ''}`}>
                <input
                  id="player-name"
                  type="text"
                  value={playerName}
                  onChange={(event) => {
                    onPlayerNameChange(event.target.value.slice(0, 24))
                    if (nameError) setNameError('')
                  }}
                  placeholder="Contoh: Pak Bambang / Bu Rina"
                  autoComplete="nickname"
                  maxLength={24}
                  aria-invalid={Boolean(nameError)}
                />
                <span className="input-counter">{playerName.length}/24</span>
              </div>
              {nameError ? (
                <p className="form-error" role="alert">
                  {nameError}
                </p>
              ) : (
                <p className="input-hint">Ketik namamu lalu klik Mulai Ronda untuk memilih titik di peta.</p>
              )}

              <button className="start-button" type="submit">
                <span className="start-icon">
                  <ArrowRight aria-hidden="true" />
                </span>
                <span>
                  MULAI RONDA
                  <small>BUKA PETA &amp; TANGKAP PEMBOLOS</small>
                </span>
                <ArrowDownRight className="start-trail" aria-hidden="true" />
              </button>
            </form>
          </div>

          {/* Truant Mascot Stage (Karakter Sombong Tangan Berpangku) */}
          <div className="mascot-stage">
            <div className="mascot-orbit orbit-one" />
            <div className="mascot-orbit orbit-two" />
            <div className="mascot-stage-label">
              <Sparkles aria-hidden="true" /> TARGET UTAMA
            </div>
            <PatrolMascot />
            <div className="mascot-nameplate">
              <span>SI RAJA BOLOS</span>
              <b>BURON NO. 1</b>
            </div>
          </div>

          <div className="hero-footer">
            <span>
              <Search aria-hidden="true" /> FOKUS &amp; KETELITIAN MATA
            </span>
            <span>DURASI RONDA: 3 MENIT</span>
            <span>VERSI RESMI</span>
          </div>
        </motion.div>

        {/* Right Aside Column */}
        <motion.aside
          className="side-column"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        >
          {/* Top 3 High Scores */}
          <section className="leaderboard-panel panel-frame" aria-labelledby="leaderboard-title">
            <div className="section-heading">
              <div className="heading-icon">
                <Trophy aria-hidden="true" />
              </div>
              <div>
                <span className="eyebrow">HALL OF FAME</span>
                <h2 id="leaderboard-title">Top 3 Skor Tertinggi</h2>
              </div>
            </div>
            <ol className="leaderboard-list">
              {leaderboard.slice(0, 3).map((entry, index) => (
                <li
                  className={`leaderboard-row leaderboard-row-${index + 1}`}
                  key={`${entry.name}-${index}`}
                >
                  <span className="leader-rank">{String(index + 1).padStart(2, '0')}</span>
                  <span className="leader-avatar">
                    {entry.name.trim().charAt(0).toUpperCase() || 'P'}
                  </span>
                  <span className="leader-name">{entry.name}</span>
                  <span className="leader-score">
                    {entry.score.toLocaleString('id-ID')}
                    <small>PTS</small>
                  </span>
                </li>
              ))}
            </ol>
            <div className="leaderboard-foot">
              <span>REKOR GURU PIKET TERBAIK</span>
              <span>
                <span className="status-dot" /> TERSIMPAN
              </span>
            </div>
          </section>

          {/* Quick How to Play Briefing */}
          <section className="briefing-panel panel-frame" aria-labelledby="briefing-title">
            <div className="briefing-header">
              <span className="eyebrow">PANDUAN PETUGAS</span>
              <span className="briefing-code">ATURAN MAIN</span>
            </div>
            <h2 id="briefing-title">Cara Menangkap Pembolos</h2>
            <div className="briefing-steps">
              <div className="step-item">
                <span className="step-num">1</span>
                <p><strong>Pilih Lokasi di Peta</strong>: Buka denah dan pilih salah satu dari 7 titik CCTV.</p>
              </div>
              <div className="step-item">
                <span className="step-num">2</span>
                <p><strong>Ganti Kamera</strong>: Gunakan tombol panah kiri / kanan (atau tombol keyboard) untuk berpindah kamera.</p>
              </div>
              <div className="step-item">
                <span className="step-num">3</span>
                <p><strong>Perhatikan Baik-baik</strong>: Anak pembolos menyamar di balik pilar, meja, atau tanaman. Klik anak tersebut untuk mendapatkan <strong>+100 poin</strong>!</p>
              </div>
            </div>

            <div className="briefing-note">
              <CheckCircle2 className="note-icon" aria-hidden="true" />
              <span>Durasi 3 menit. Temukan sebanyak mungkin pembolos sebelum waktu habis!</span>
            </div>
          </section>
        </motion.aside>
      </section>

      {/* Page Footer */}
      <footer className="page-footer">
        <span>© 2026 SEKOLAH — CCTV PATROL: RAZIA PEMBOLOS</span>
        <span>SEMUA ASET FOTO SEKOLAH ASLI</span>
      </footer>
    </main>
  )
}
