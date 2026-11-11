'use client'

import { FormEvent, useState } from 'react'
import { Camera, Play, Sparkles, Trophy, Users } from 'lucide-react'
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
      setNameError('Tulis nama kamu dulu ya!')
      return
    }
    if (playerName.trim().length < 2) {
      setNameError('Nama minimal 2 huruf!')
      return
    }
    setNameError('')
    onStart()
  }

  return (
    <main className="arcade-lobby-shell">
      {/* Top Simple Brand Badge */}
      <header className="arcade-top-header">
        <div className="arcade-logo-badge">
          <Camera className="w-5 h-5 text-emerald-400" />
          <span>CCTV PATROL SEKOLAH</span>
        </div>
        <div className="arcade-live-badge">
          <span className="live-dot" /> 7 CCTV ONLINE
        </div>
      </header>

      {/* Main Hero Card */}
      <div className="arcade-main-container">
        {/* Left Side: Game Title, Form, & Top 3 */}
        <motion.div
          className="arcade-card arcade-left-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Badge */}
          <div className="game-category-tag">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>GAME KETELITIAN MATA</span>
          </div>

          {/* Big Fun Title */}
          <h1 className="arcade-title">
            RAZIA <span className="title-highlight">PEMBOLOS!</span>
          </h1>
          <p className="arcade-subtitle">
            Cari dan tangkap anak-anak yang suka bolos dan ngumpet di CCTV sekolah sebelum waktu 3 menit habis!
          </p>

          {/* Player Name Form */}
          <form className="arcade-form" onSubmit={handleSubmit}>
            <label htmlFor="playerName" className="arcade-label">
              SIAPA NAMA KAMU?
            </label>
            <div className="arcade-input-wrapper">
              <input
                id="playerName"
                type="text"
                value={playerName}
                onChange={(e) => {
                  onPlayerNameChange(e.target.value.slice(0, 20))
                  if (nameError) setNameError('')
                }}
                placeholder="Ketik namamu di sini..."
                maxLength={20}
                className={nameError ? 'input-error' : ''}
                autoFocus
              />
              <span className="char-count">{playerName.length}/20</span>
            </div>

            {nameError && <p className="error-text">{nameError}</p>}

            {/* Big Action Button */}
            <button type="submit" className="arcade-play-btn">
              <Play className="w-6 h-6 fill-current" />
              <span>MULAI MAIN!</span>
            </button>
          </form>

          {/* Top 3 High Scores Card (Clean & Simple) */}
          <div className="arcade-leaderboard-card">
            <div className="leaderboard-header">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>3 SKOR TERTINGGI (TOP SCORE)</span>
            </div>
            <div className="leaderboard-slots">
              {leaderboard.slice(0, 3).map((entry, idx) => {
                const medals = ['🥇', '🥈', '🥉']
                return (
                  <div key={idx} className={`leaderboard-slot slot-${idx + 1}`}>
                    <span className="slot-medal">{medals[idx]}</span>
                    <span className="slot-name">{entry.name}</span>
                    <span className="slot-score">{entry.score} <small>PTS</small></span>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Right Side: The Arrogant Truant Mascot */}
        <motion.div
          className="arcade-card arcade-mascot-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <div className="mascot-card-header">
            <span className="mascot-tag">TARGET UTAMA</span>
            <h2 className="mascot-title">SI RAJA BOLOS</h2>
          </div>

          <div className="mascot-visual-stage">
            <PatrolMascot />
          </div>

          <div className="mascot-card-footer">
            <p>Dia suka ngumpet di tempat tersembunyi. Pasang matamu baik-baik!</p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
