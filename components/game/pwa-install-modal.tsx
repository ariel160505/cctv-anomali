'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  Download,
  Monitor,
  Smartphone,
  Sparkles,
  X,
  CheckCircle2,
  Share,
  PlusSquare,
  ShieldAlert,
  ArrowRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

type PwaInstallModalProps = {
  isOpen: boolean
  onClose: () => void
  onInstalled?: () => void
}

export function PwaInstallModal({ isOpen, onClose, onInstalled }: PwaInstallModalProps) {
  const [isIos, setIsIos] = useState(false)
  const [installSuccess, setInstallSuccess] = useState(false)
  const [showIosGuide, setShowIosGuide] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent.toLowerCase()
      const isApple = /iphone|ipad|ipod/.test(ua)
      setIsIos(isApple)
    }
  }, [])

  const handleInstallClick = async () => {
    if (typeof window === 'undefined') return

    // If iOS Safari, show step-by-step iOS instructions
    if (isIos) {
      setShowIosGuide(true)
      return
    }

    const promptEvent = (window as any).__pwaInstallPrompt
    if (promptEvent) {
      promptEvent.prompt()
      const choice = await promptEvent.userChoice
      if (choice && choice.outcome === 'accepted') {
        setInstallSuccess(true)
        if (onInstalled) onInstalled()
        setTimeout(() => {
          onClose()
        }, 1800)
      }
    } else {
      // Fallback instruction for desktop/mobile browsers without prompt event
      alert(
        'Untuk memasang aplikasi:\n\n' +
        '1. Jika di Komputer (Chrome/Edge): Klik ikon "Install" (layar komputer kecil) di bilah alamat URL (address bar) sebelah kanan.\n' +
        '2. Jika di HP Android (Chrome): Klik tombol titik tiga (⋮) di pojok kanan atas browser lalu pilih "Tambahkan ke Layar Utama" / "Install Aplikasi".'
      )
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <motion.div
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border-2 border-emerald-500/50 bg-[#090f0c] p-5 sm:p-7 shadow-[0_0_50px_rgba(16,185,129,0.25)] text-left"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ duration: 0.2 }}
          >
            {/* Ambient Background Grid & Glow */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Close Button (Silang) */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3.5 right-3.5 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-neutral-900/80 border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 hover:border-neutral-500 transition-all cursor-pointer"
              title="Tutup Pemberitahuan"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Badge */}
            <div className="relative z-10 flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                DOWNLOAD APLIKASI RESMI (PWA)
              </span>
            </div>

            {/* Main Title & Subtitle */}
            <div className="relative z-10 mb-4">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide font-mono flex items-center gap-2">
                PASANG <span className="text-emerald-400">CCTV : AQIS</span>
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 leading-relaxed">
                Nikmati pengalaman observasi horor lebih mendalam dengan layar penuh 100% tanpa gangguan bilah browser di PC maupun HP!
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="relative z-10 grid grid-cols-2 gap-2.5 mb-5 font-mono">
              <div className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-white">Layar Penuh 100%</h4>
                  <p className="text-[9px] sm:text-[10px] text-neutral-400 mt-0.5">Tanpa tab atau URL bar browser yang menutupi monitor.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-white">Komputer & HP</h4>
                  <p className="text-[9px] sm:text-[10px] text-neutral-400 mt-0.5">Bisa dipasang di Windows, Mac, Android, dan iPhone.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-white">Akses 1-Klik</h4>
                  <p className="text-[9px] sm:text-[10px] text-neutral-400 mt-0.5">Ikon langsung muncul di Desktop & Layar Utama HP.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-bold text-white">Ringan & Cepat</h4>
                  <p className="text-[9px] sm:text-[10px] text-neutral-400 mt-0.5">Hemat kuota, responsif, dan siap dimainkan kapan saja.</p>
                </div>
              </div>
            </div>

            {/* iOS Guide Card if on iPhone/iPad or expanded */}
            {showIosGuide && (
              <div className="relative z-10 mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <Share className="w-4 h-4" />
                  <span>Cara Pasang di iPhone / iPad (Safari):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-neutral-300 pl-1">
                  <li>Tap tombol <strong>Bagikan (Share)</strong> di bar bawah Safari.</li>
                  <li>Gulir ke bawah dan pilih <strong>&quot;Tambah ke Layar Utama&quot; (Add to Home Screen)</strong>.</li>
                  <li>Tap <strong>&quot;Tambah&quot; (Add)</strong> di pojok kanan atas. Selesai!</li>
                </ol>
              </div>
            )}

            {/* Success Feedback Banner */}
            {installSuccess && (
              <div className="relative z-10 mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Aplikasi berhasil dipasang! Menutup jendela...</span>
              </div>
            )}

            {/* Buttons Group */}
            <div className="relative z-10 flex flex-col sm:flex-row gap-2.5 font-mono">
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex-1 flex items-center justify-center gap-2 h-12 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs sm:text-sm tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>PASANG APLIKASI SEKARANG</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex items-center justify-center h-11 sm:h-12 px-4 rounded-xl border border-neutral-700 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-400 hover:text-white font-bold text-xs tracking-wide transition-all cursor-pointer"
              >
                <span>Nanti Saja</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
