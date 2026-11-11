'use client'

import Image from 'next/image'
import { ArrowLeft, ArrowUpRight, Camera, CheckCircle2, Crosshair, MapPin, X } from 'lucide-react'
import { motion } from 'motion/react'
import { LOCATIONS, type CampusLocation } from '@/lib/game-data'

type CampusMapProps = {
  onSelect: (location: CampusLocation) => void
  onClose?: () => void
  isOverlay?: boolean
  currentLocationId?: string
}

export function CampusMap({ onSelect, onClose, isOverlay = false, currentLocationId }: CampusMapProps) {
  return (
    <motion.main
      className={`map-screen ${isOverlay ? 'map-screen-overlay' : ''}`}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      aria-labelledby="map-title"
    >
      <div className="map-topline">
        <div className="map-top-copy">
          {isOverlay && onClose ? (
            <button className="icon-button map-back-button" onClick={onClose} aria-label="Tutup peta">
              <ArrowLeft aria-hidden="true" />
            </button>
          ) : null}
          <span className="eyebrow">
            <Crosshair aria-hidden="true" /> DENAH AREA SEKOLAH
          </span>
          <h1 id="map-title">Pilih Titik Pantau CCTV</h1>
          <p>Klik salah satu pin nomor (1 - 7) di peta atau pilih dari daftar lokasi.</p>
        </div>
        <div className="map-live-tag">
          <span className="status-dot" /> 7 TITIK CCTV ONLINE
        </div>
        {isOverlay && onClose ? (
          <button className="icon-button map-close-button" onClick={onClose} aria-label="Tutup peta">
            <X aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="map-content">
        {/* Interactive Map Board with real MAP GAME.jpg */}
        <section className="map-board" aria-label="Peta interaktif sekolah">
          <div className="map-image-wrapper">
            <Image
              src="/images/school/map.jpg"
              alt="Peta Interaktif Sekolah untuk Mencari Pembolos"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 75vw"
              className="campus-map-image object-contain"
            />
          </div>

          {/* Interactive Clickable Pins overlaying the 7 locations */}
          {LOCATIONS.map((loc) => {
            const isCurrent = loc.id === currentLocationId
            return (
              <button
                type="button"
                key={loc.id}
                className={`map-hotspot-pin ${isCurrent ? 'map-hotspot-current' : ''}`}
                style={{ left: `${loc.mapX}%`, top: `${loc.mapY}%` }}
                onClick={() => onSelect(loc)}
                aria-label={`Pilih kamera ${loc.pinNumber}: ${loc.name}`}
              >
                {/* Pulse wave ring */}
                <span className="pin-pulse-wave" />

                {/* Pin Circle with Number matching the map */}
                <span className="pin-marker-badge">
                  <span className="pin-number">{loc.pinNumber}</span>
                </span>

                {/* Floating Tooltip */}
                <span className="map-pin-tooltip">
                  <span className="tooltip-cam">CCTV {loc.camera}</span>
                  <strong>{loc.name}</strong>
                  <small>{loc.description}</small>
                </span>
              </button>
            )
          })}
        </section>

        {/* Location List Panel */}
        <aside className="location-list" aria-label="Daftar lokasi CCTV">
          <div className="location-list-heading">
            <span className="eyebrow">DAFTAR TITIK KAMERA</span>
            <span className="camera-count">07 TITIK</span>
          </div>
          <div className="location-list-items">
            {LOCATIONS.map((loc) => {
              const isCurrent = loc.id === currentLocationId
              return (
                <button
                  key={loc.id}
                  className={`location-row ${isCurrent ? 'location-row-active' : ''}`}
                  onClick={() => onSelect(loc)}
                >
                  <span className="location-row-id">
                    {loc.pinNumber}
                  </span>
                  <span className="location-row-copy">
                    <strong>{loc.name}</strong>
                    <small>{loc.description}</small>
                  </span>
                  {isCurrent ? (
                    <CheckCircle2 className="location-row-check" aria-hidden="true" />
                  ) : (
                    <ArrowUpRight className="location-row-arrow" aria-hidden="true" />
                  )}
                </button>
              )
            })}
          </div>
          <p className="map-hint">💡 Klik kamera mana saja untuk langsung memantau area tersebut.</p>
        </aside>
      </div>
    </motion.main>
  )
}
