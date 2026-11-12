'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type SoundCue =
  | 'camera'
  | 'verified'
  | 'buzzer'
  | 'jumpscare'
  | 'heartbeat'
  | 'beep'
  | 'gameOver'
  | 'victory'

export function useGameAudio() {
  const [isMuted, setIsMuted] = useState(false)
  const bgmRef = useRef<HTMLAudioElement | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)

  // Initialize BGM
  useEffect(() => {
    if (typeof window === 'undefined') return

    const bgm = new Audio('/audio/backsound.mp3')
    bgm.loop = true
    bgm.volume = 0.4
    bgmRef.current = bgm

    // Check localStorage preference
    const saved = window.localStorage.getItem('cctv-aqis-muted')
    if (saved === 'true') {
      setIsMuted(true)
      bgm.muted = true
    }

    return () => {
      bgm.pause()
      bgm.src = ''
    }
  }, [])

  const startBgm = useCallback(() => {
    if (!bgmRef.current) return
    bgmRef.current.muted = isMuted
    bgmRef.current.play().catch(() => {
      // User gesture required in some browsers
    })
  }, [isMuted])

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev
      if (bgmRef.current) {
        bgmRef.current.muted = next
        if (!next) {
          bgmRef.current.play().catch(() => {})
        }
      }
      try {
        window.localStorage.setItem('cctv-aqis-muted', String(next))
      } catch {}
      return next
    })
  }, [])

  // Web Audio synthesizer for immediate, lag-free sound effects
  const playSfx = useCallback(
    (cue: SoundCue) => {
      if (isMuted || typeof window === 'undefined') return

      try {
        const ctx = audioCtxRef.current ?? new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
        audioCtxRef.current = ctx
        if (ctx.state === 'suspended') void ctx.resume()

        const t = ctx.currentTime

        if (cue === 'camera') {
          // Sharp CCTV mechanical switch click
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'square'
          osc.frequency.setValueAtTime(800, t)
          osc.frequency.exponentialRampToValueAtTime(300, t + 0.05)
          gain.gain.setValueAtTime(0.06, t)
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(t)
          osc.stop(t + 0.06)
        } else if (cue === 'verified') {
          // High-tech radio success chime
          const freqs = [587, 880, 1174]
          freqs.forEach((freq, idx) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.type = 'sine'
            osc.frequency.setValueAtTime(freq, t + idx * 0.08)
            gain.gain.setValueAtTime(0.08, t + idx * 0.08)
            gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.22)
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.start(t + idx * 0.08)
            osc.stop(t + idx * 0.08 + 0.25)
          })
        } else if (cue === 'buzzer') {
          // Deep harsh error buzzer (Heart lost!)
          const osc1 = ctx.createOscillator()
          const osc2 = ctx.createOscillator()
          const gain = ctx.createGain()
          osc1.type = 'sawtooth'
          osc2.type = 'sawtooth'
          osc1.frequency.setValueAtTime(140, t)
          osc2.frequency.setValueAtTime(146, t)
          gain.gain.setValueAtTime(0.12, t)
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35)
          osc1.connect(gain)
          osc2.connect(gain)
          gain.connect(ctx.destination)
          osc1.start(t)
          osc2.start(t)
          osc1.stop(t + 0.36)
          osc2.stop(t + 0.36)
        } else if (cue === 'jumpscare') {
          // Intense noise burst + distorted dissonant drop
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sawtooth'
          osc.frequency.setValueAtTime(320, t)
          osc.frequency.exponentialRampToValueAtTime(40, t + 0.6)
          gain.gain.setValueAtTime(0.25, t)
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.65)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(t)
          osc.stop(t + 0.7)
        } else if (cue === 'heartbeat') {
          // Heavy double thud
          [0, 0.18].forEach((offset) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.type = 'sine'
            osc.frequency.setValueAtTime(75, t + offset)
            osc.frequency.exponentialRampToValueAtTime(35, t + offset + 0.12)
            gain.gain.setValueAtTime(0.14, t + offset)
            gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.12)
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.start(t + offset)
            osc.stop(t + offset + 0.14)
          })
        } else if (cue === 'beep') {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(440, t)
          gain.gain.setValueAtTime(0.04, t)
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(t)
          osc.stop(t + 0.06)
        } else if (cue === 'gameOver') {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sawtooth'
          osc.frequency.setValueAtTime(180, t)
          osc.frequency.exponentialRampToValueAtTime(45, t + 0.8)
          gain.gain.setValueAtTime(0.15, t)
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(t)
          osc.stop(t + 0.95)
        } else if (cue === 'victory') {
          [523, 659, 784, 1046].forEach((f, i) => {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.type = 'triangle'
            osc.frequency.setValueAtTime(f, t + i * 0.12)
            gain.gain.setValueAtTime(0.1, t + i * 0.12)
            gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.3)
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.start(t + i * 0.12)
            osc.stop(t + i * 0.12 + 0.35)
          })
        }
      } catch {
        // Fallback
      }
    },
    [isMuted]
  )

  return { isMuted, toggleMute, startBgm, playSfx }
}
