'use client'

import { useCallback, useRef } from 'react'

export type SoundCue = 'camera' | 'catch' | 'gameOver' | 'beep' | 'buzzer' | 'siren' | 'verified'

const NOTES: Record<SoundCue, { frequency: number; duration: number; wave: OscillatorType; volume: number }[]> = {
  camera: [
    { frequency: 880, duration: 0.055, wave: 'square', volume: 0.035 },
    { frequency: 560, duration: 0.08, wave: 'triangle', volume: 0.035 },
  ],
  catch: [
    { frequency: 520, duration: 0.07, wave: 'triangle', volume: 0.07 },
    { frequency: 784, duration: 0.09, wave: 'sine', volume: 0.08 },
    { frequency: 1046, duration: 0.18, wave: 'sine', volume: 0.09 },
  ],
  verified: [
    { frequency: 659, duration: 0.08, wave: 'sine', volume: 0.08 },
    { frequency: 880, duration: 0.1, wave: 'sine', volume: 0.09 },
    { frequency: 1318, duration: 0.22, wave: 'triangle', volume: 0.1 },
  ],
  buzzer: [
    { frequency: 160, duration: 0.18, wave: 'sawtooth', volume: 0.08 },
    { frequency: 130, duration: 0.24, wave: 'sawtooth', volume: 0.08 },
  ],
  siren: [
    { frequency: 440, duration: 0.12, wave: 'sawtooth', volume: 0.06 },
    { frequency: 880, duration: 0.12, wave: 'sawtooth', volume: 0.06 },
  ],
  gameOver: [
    { frequency: 523, duration: 0.16, wave: 'triangle', volume: 0.05 },
    { frequency: 440, duration: 0.2, wave: 'triangle', volume: 0.045 },
    { frequency: 330, duration: 0.28, wave: 'sine', volume: 0.04 },
  ],
  beep: [
    { frequency: 440, duration: 0.04, wave: 'sine', volume: 0.03 },
  ],
}

export function useGameAudio() {
  const audioRef = useRef<AudioContext | null>(null)

  const play = useCallback((cue: SoundCue) => {
    if (typeof window === 'undefined' || !window.AudioContext) return

    try {
      const audio = audioRef.current ?? new window.AudioContext()
      audioRef.current = audio
      if (audio.state === 'suspended') void audio.resume()

      let startAt = audio.currentTime
      const soundSeq = NOTES[cue] || NOTES.beep
      soundSeq.forEach(({ frequency, duration, wave, volume }) => {
        const oscillator = audio.createOscillator()
        const gain = audio.createGain()
        oscillator.type = wave
        oscillator.frequency.setValueAtTime(frequency, startAt)
        gain.gain.setValueAtTime(0.0001, startAt)
        gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.012)
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration)
        oscillator.connect(gain)
        gain.connect(audio.destination)
        oscillator.start(startAt)
        oscillator.stop(startAt + duration + 0.02)
        startAt += duration * 0.82
      })
    } catch {
      // Audio fallback
    }
  }, [])

  return { play }
}
