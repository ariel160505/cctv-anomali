'use client'

import Image from 'next/image'
import { ArrowLeft, ArrowUpRight, LocateFixed, MapPin, X } from 'lucide-react'
import { motion } from 'motion/react'
import { LOCATIONS, type CampusLocation } from '@/lib/game-data'

type CampusMapProps = {
  onSelect: (location: CampusLocation) => void
  onClose?: () => void
  isOverlay?: boolean
}

export function CampusMap({ onSelect, onClose, isOverlay = false }: CampusMapProps) {
  return (
    <motion.main
      className={`map-screen ${isOverlay ? 'map-screen-overlay' : ''}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      aria-labelledby="map-title"
    >
      <div className="map-topline">
        <div className="map-top-copy">
          {isOverlay && onClose ? (
            <button className="icon-button map-back-button" onClick={onClose} aria-label="Tutup peta">
              <ArrowLeft aria-hidden="true" />
            </button>
          ) : null}
          <span className="eyebrow">PETA OPERASIONAL / SEKTOR 07</span>
          <h1 id="map-title">Pilih titik pantau</h1>
          <p>Ketuk penanda untuk berpindah langsung ke kamera CCTV.</p>
        </div>
        <div className="map-live-tag"><span className="status-dot" /> 7 KAMERA AKTIF</div>
        {isOverlay && onClose ? (
          <button className="icon-button map-close-button" onClick={onClose} aria-label="Tutup peta">
            <X aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="map-content">
        <section className="map-board" aria-label="Peta interaktif kampus">
          <Image
            src="/images/map.png"
            alt="Peta ilustrasi kampus dengan gedung, kantin, kebun, lapangan, masjid, dan parkiran"
            fill
            priority
            sizes="(max-width: 800px) 100vw, 70vw"
            className="campus-map-image"
          />
          <div className="map-grid-overlay" aria-hidden="true" />
          <div className="map-compass" aria-label="Arah utara"><ArrowUpRight aria-hidden="true" /><span>UTARA</span></div>
          <div className="map-scale" aria-hidden="true"><span /> 50 m</div>
          {LOCATIONS.map((location, index) => (
            <button
              type="button"
              key={location.id}
              className="map-pin"
              style={{ left: `${location.x}%`, top: `${location.y}%` }}
              onClick={() => onSelect(location)}
              aria-label={`Pilih ${location.name}, kamera ${location.camera}`}
            >
              <span className="map-pin-tooltip">
                <strong>{location.name}</strong>
                <small>{location.description}</small>
              </span>
              <span className="map-pin-number">{String(index + 1).padStart(2, '0')}</span>
              <MapPin className="map-pin-icon" aria-hidden="true" />
            </button>
          ))}
          <div className="map-corner-label"><LocateFixed aria-hidden="true" /> SEKOLAH NUSANTARA</div>
        </section>

        <aside className="location-list" aria-label="Daftar lokasi kamera">
          <div className="location-list-heading">
            <span className="eyebrow">DAFTAR KAMERA</span>
            <span className="camera-count">07 / 07</span>
          </div>
          <div className="location-list-items">
            {LOCATIONS.map((location) => (
              <button className="location-row" key={location.id} onClick={() => onSelect(location)}>
                <span className="location-row-id">{location.camera}</span>
                <span className="location-row-copy">
                  <strong>{location.name}</strong>
                  <small>{location.description}</small>
                </span>
                <ArrowUpRight className="location-row-arrow" aria-hidden="true" />
              </button>
            ))}
          </div>
          <p className="map-hint">Pilih kamera pertama untuk memulai ronda.</p>
        </aside>
      </div>
    </motion.main>
  )
}
