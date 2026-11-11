'use client'

import { useCallback, useRef } from 'react'

type SoundCue = 'camera' | 'catch' | 'gameOver'

const NOTES: Record<SoundCue, { frequency: number; duration: number; wave: OscillatorType; volume: number }[]> = {
  camera: [
    { frequency: 880, duration: 0.055, wave: 'square', volume: 0.035 },
    { frequency: 560, duration: 0.08, wave: 'triangle', volume: 0.035 },
  ],
  catch: [
    { frequency: 660, duration: 0.08, wave: 'triangle', volume: 0.06 },
    { frequency: 990, duration: 0.16, wave: 'sine', volume: 0.055 },
  ],
  gameOver: [
    { frequency: 440, duration: 0.16, wave: 'triangle', volume: 0.045 },
    { frequency: 330, duration: 0.2, wave: 'triangle', volume: 0.04 },
    { frequency: 220, duration: 0.28, wave: 'sine', volume: 0.04 },
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
      NOTES[cue].forEach(({ frequency, duration, wave, volume }) => {
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
      // Audio is optional; gameplay remains fully usable when browser audio is unavailable.
    }
  }, [])

  return { play }
}
