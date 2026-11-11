'use client'

import { motion } from 'motion/react'

export function PatrolMascot({ compact = false }: { compact?: boolean }) {
  return (
    <motion.div
      className={`truant-mascot ${compact ? 'mascot-compact' : ''}`}
      aria-label="Karakter anak sekolah yang suka bolos berdiri dengan gaya sombong tangan berpangku"
      role="img"
      animate={{
        y: [0, -6, 0],
        rotate: [-1, 1.5, -1],
      }}
      transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Shadow */}
      <div className="mascot-ground-shadow" />

      {/* Student Character Container */}
      <div className="mascot-character">
        {/* Legs / Celana Abu-abu SMA */}
        <div className="mascot-legs-wrapper">
          <div className="mascot-leg mascot-leg-left" />
          <div className="mascot-leg mascot-leg-right" />
          {/* Sepatu Sneakers Hitam Putih */}
          <div className="mascot-sneaker mascot-sneaker-left" />
          <div className="mascot-sneaker mascot-sneaker-right" />
        </div>

        {/* Torso & Kemeja Putih Seragam */}
        <div className="mascot-torso-wrapper">
          {/* Kemeja Putih */}
          <div className="mascot-shirt">
            {/* Dasinya miring / santai */}
            <div className="mascot-tie" />
            <div className="mascot-collar" />
            <div className="mascot-badge" />
            {/* Jaket / Hoodie yang disampirkan atau kaos oblong */}
          </div>

          {/* Tangan Berpangku / Crossed Arms (Gaya Sombong) */}
          <motion.div
            className="mascot-crossed-arms"
            animate={{ y: [0, -1.5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="arm-segment arm-left" />
            <div className="arm-segment arm-right" />
            <div className="arm-hands-crossed">
              <span className="finger-grip left-grip" />
              <span className="finger-grip right-grip" />
            </div>
          </motion.div>
        </div>

        {/* Head & Cocky Expression */}
        <motion.div
          className="mascot-head-wrapper"
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Hair (Gaya Rambut Keren / Sedikit Berantakan) */}
          <div className="mascot-hair">
            <span className="hair-bang hair-bang-1" />
            <span className="hair-bang hair-bang-2" />
            <span className="hair-bang hair-bang-3" />
          </div>

          {/* Face */}
          <div className="mascot-face">
            {/* Smug eyebrows */}
            <div className="mascot-eyebrow eyebrow-left" />
            <div className="mascot-eyebrow eyebrow-right" />

            {/* Confident / Smug Eyes */}
            <div className="mascot-eye eye-left">
              <div className="eye-pupil pupil-cocky" />
            </div>
            <div className="mascot-eye eye-right">
              <div className="eye-pupil pupil-cocky" />
            </div>

            {/* Sombong / Smug smirk (senyum miring meremehkan) */}
            <div className="mascot-smirk" />

            {/* Plaster / Bandage di pipi tanda bandel */}
            <div className="mascot-cheek-plaster" />
          </div>
        </motion.div>

        {/* Chat / Emoticon Bubble - "Tangkap kalau bisa!" */}
        <motion.div
          className="mascot-speech-bubble"
          animate={{ y: [0, -4, 0], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <span>😏 Coba cari gw kalau bisa!</span>
        </motion.div>
      </div>
    </motion.div>
  )
}
