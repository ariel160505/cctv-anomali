'use client'

import { FormEvent, useState } from 'react'
import { ArrowDownRight, ArrowRight, AudioLines, BadgeCheck, Camera, Radio, ShieldCheck, Sparkles, Trophy } from 'lucide-react'
import { motion } from 'motion/react'
import type { LeaderboardEntry } from '@/lib/game-data'
import { PatrolMascot } from './mascot'

type LobbyScreenProps = {
  leaderboard: LeaderboardEntry[]
  playerName: string
  onPlayerNameChange: (value: string) => void
  onStart: () => void
}

const rankLabels = ['PETUGAS TERBAIK', 'PENGAWAS TELADAN', 'SATPAM SIGAP']

export function LobbyScreen({ leaderboard, playerName, onPlayerNameChange, onStart }: LobbyScreenProps) {
  const [nameError, setNameError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!playerName.trim()) {
      setNameError('Isi nama petugas sebelum mulai ronda.')
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
      <header className="brand-row">
        <div className="brand-lockup">
          <div className="brand-symbol"><Camera aria-hidden="true" /></div>
          <div>
            <p className="brand-name">CCTV<span>://</span>PATROL</p>
            <p className="brand-subtitle">UNIT KEAMANAN SEKOLAH NUSANTARA</p>
          </div>
        </div>
        <div className="system-status"><span className="status-dot" /> SEMUA SISTEM NORMAL <span className="status-divider" /> SHIFT MALAM <Radio aria-hidden="true" /></div>
      </header>

      <section className="lobby-grid">
        <motion.div
          className="hero-panel panel-frame"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <div className="hero-topline"><span><span className="signal-bars"><i /><i /><i /></span> LIVE FEED: STANDBY</span><span>REC <span className="rec-dot" /></span></div>
          <div className="hero-grid-lines" aria-hidden="true" />
          <div className="hero-copy">
            <span className="eyebrow"><ShieldCheck aria-hidden="true" /> SIMULASI KEAMANAN SEKOLAH</span>
            <h1>Yang bolos,<br /><em>ketahuan.</em></h1>
            <p className="hero-lede">Tujuh kamera. Satu sekolah. Jangan biarkan satu pun pembolos lolos dari pantauanmu.</p>
            <form className="start-form" onSubmit={handleSubmit} noValidate>
              <label htmlFor="player-name">NAMA PEMAIN <span>/ GURU PIKET</span></label>
              <div className={`name-input-wrap ${nameError ? 'name-input-error' : ''}`}>
                <input
                  id="player-name"
                  type="text"
                  value={playerName}
                  onChange={(event) => {
                    onPlayerNameChange(event.target.value.slice(0, 24))
                    if (nameError) setNameError('')
                  }}
                  placeholder="Contoh: Bu Rina"
                  autoComplete="nickname"
                  maxLength={24}
                  aria-invalid={Boolean(nameError)}
                  aria-describedby={nameError ? 'name-error' : 'name-hint'}
                />
                <span className="input-counter">{playerName.length}/24</span>
              </div>
              {nameError ? <p className="form-error" id="name-error" role="alert">{nameError}</p> : <p className="input-hint" id="name-hint">Nama ini akan muncul di papan skor tertinggi.</p>}
              <button className="start-button" type="submit">
                <span className="start-icon"><ArrowRight aria-hidden="true" /></span>
                <span>MULAI RONDA<small>SIAPKAN SENTER &amp; INSTING</small></span>
                <ArrowDownRight className="start-trail" aria-hidden="true" />
              </button>
            </form>
          </div>
          <div className="mascot-stage">
            <div className="mascot-orbit orbit-one" />
            <div className="mascot-orbit orbit-two" />
            <div className="mascot-stage-label"><Sparkles aria-hidden="true" /> PENJAGA GAWAT DARURAT</div>
            <PatrolMascot />
            <div className="mascot-nameplate"><span>PAK SATPAM</span><b>LEVEL 01</b></div>
          </div>
          <div className="hero-footer"><span><AudioLines aria-hidden="true" /> AUDIO AKTIF</span><span>07.00 PM — 10.00 PM</span><span>V. 1.07.04</span></div>
        </motion.div>

        <motion.aside
          className="side-column"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12, ease: 'easeOut' }}
        >
          <section className="leaderboard-panel panel-frame" aria-labelledby="leaderboard-title">
            <div className="section-heading">
              <div className="heading-icon"><Trophy aria-hidden="true" /></div>
              <div><span className="eyebrow">HALL OF FAME</span><h2 id="leaderboard-title">Top 3 skor tertinggi</h2></div>
              <BadgeCheck className="heading-mark" aria-hidden="true" />
            </div>
            <ol className="leaderboard-list">
              {leaderboard.slice(0, 3).map((entry, index) => (
                <li className={`leaderboard-row leaderboard-row-${index + 1}`} key={`${entry.name}-${index}`}>
                  <span className="leader-rank">{String(index + 1).padStart(2, '0')}</span>
                  <span className="leader-avatar">{entry.name.trim().charAt(0).toUpperCase() || 'P'}</span>
                  <span className="leader-name">{entry.name}</span>
                  <span className="leader-score">{entry.score.toLocaleString('id-ID')}<small>PTS</small></span>
                </li>
              ))}
            </ol>
            <div className="leaderboard-foot"><span>REKOR SEPANJANG MASA</span><span><span className="status-dot" /> TERSINKRON</span></div>
          </section>

          <section className="briefing-panel panel-frame" aria-labelledby="briefing-title">
            <div className="briefing-header"><span className="eyebrow">BRIEFING PETUGAS</span><span className="briefing-code">MEMO #07-23</span></div>
            <h2 id="briefing-title">Laporan malam ini.</h2>
            <p>Sejumlah siswa terdeteksi berkeliaran di luar kelas. Amankan mereka sebelum sempat kabur.</p>
            <div className="briefing-stats">
              <div><span>WAKTU RONDA</span><strong>03<span>:00</span></strong></div>
              <div><span>TIAP TANGKAPAN</span><strong>+100<small> PTS</small></strong></div>
              <div><span>AREA PANTAU</span><strong>07<small> TITIK</small></strong></div>
            </div>
            <div className="briefing-note"><span className="note-dot" /><span>Ketuk siswa yang muncul di kamera untuk menangkapnya.</span></div>
          </section>

          <div className="safety-note"><ShieldCheck aria-hidden="true" /><span>SIMULASI EDUKATIF <i /> TIDAK ADA SISWA YANG DIRUGIKAN</span></div>
        </motion.aside>
      </section>
      <footer className="page-footer"><span>© 2025 SEKOLAH NUSANTARA — UNIT KEAMANAN DIGITAL</span><span>PERANGKAT KERAS CCTV <b>ONLINE</b></span></footer>
    </main>
  )
}
