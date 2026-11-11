'use client'

import Image from 'next/image'
import { ArrowLeft, Check, Crosshair, MapPin, X } from 'lucide-react'
import { motion } from 'motion/react'
import { LOCATIONS, type CampusLocation } from '@/lib/game-data'

type CampusMapProps = {
  onSelect: (location: CampusLocation) => void
  onClose?: () => void
  isOverlay?: boolean
  currentLocationId?: string
}

export function CampusMap({
  onSelect,
  onClose,
  isOverlay = false,
  currentLocationId,
}: CampusMapProps) {
  return (
    <motion.main
      className={`clean-map-screen ${isOverlay ? 'clean-map-overlay' : ''}`}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {/* Top Header */}
      <header className="clean-map-header">
        <div className="clean-map-title-group">
          {isOverlay && onClose && (
            <button
              onClick={onClose}
              className="clean-map-btn-back"
              title="Kembali ke CCTV (ESC)"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>KEMBALI KE CCTV</span>
            </button>
          )}
          <div>
            <h1 className="clean-map-h1">🗺️ PILIH LOKASI PATROLI</h1>
            <p className="clean-map-p">
              Klik salah satu pin atau nama tempat di bawah untuk langsung memantau CCTV-nya.
            </p>
          </div>
        </div>

        {isOverlay && onClose && (
          <button onClick={onClose} className="clean-map-btn-close" aria-label="Tutup Peta">
            <X className="w-6 h-6" />
          </button>
        )}
      </header>

      {/* Main Map Canvas */}
      <div className="clean-map-canvas-wrapper">
        <div className="clean-map-canvas">
          {/* Real Clean Map V2 Background */}
          <Image
            src="/images/school/map.jpg"
            alt="Denah Sekolah Bersih V2"
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 85vw"
            className="clean-map-img"
          />

          {/* Interactive Pins with Number & Location Name underneath */}
          {LOCATIONS.map((loc) => {
            const isCurrent = loc.id === currentLocationId
            return (
              <button
                key={loc.id}
                type="button"
                className={`clean-map-pin-btn ${isCurrent ? 'pin-is-current' : ''}`}
                style={{ left: `${loc.mapX}%`, top: `${loc.mapY}%` }}
                onClick={() => onSelect(loc)}
                title={`Pilih ${loc.shortName}`}
              >
                {/* Pulsing ring wave */}
                <span className="clean-pin-pulse" />

                {/* Numbered Pin Head */}
                <div className="clean-pin-badge">
                  <span>{loc.pinNumber}</span>
                </div>

                {/* Permanent Location Name Label underneath the pin */}
                <div className="clean-pin-label">
                  <span className="pin-label-text">
                    {loc.pinNumber}. {loc.shortName}
                  </span>
                  {isCurrent && <span className="pin-current-tag">AKTIF</span>}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Bottom Quick Bar */}
      <footer className="clean-map-footer">
        <div className="clean-map-pills">
          {LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => onSelect(loc)}
              className={`map-pill-item ${loc.id === currentLocationId ? 'pill-active' : ''}`}
            >
              <span className="pill-num">{loc.pinNumber}</span>
              <span>{loc.shortName}</span>
            </button>
          ))}
        </div>
      </footer>
    </motion.main>
  )
}
