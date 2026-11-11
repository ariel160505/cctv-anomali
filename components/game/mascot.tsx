'use client'

import { motion } from 'motion/react'

export function PatrolMascot({ compact = false }: { compact?: boolean }) {
  return (
    <motion.div
      className={`mascot ${compact ? 'mascot-compact' : ''}`}
      aria-label="Maskot siswa penjaga sekolah berdiri dengan tangan bersilang"
      role="img"
      animate={{ y: [0, -5, 0], rotate: [0, 1, 0, -1, 0] }}
      transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <span className="mascot-shadow" />
      <span className="mascot-leg mascot-leg-left" />
      <span className="mascot-leg mascot-leg-right" />
      <span className="mascot-shoe mascot-shoe-left" />
      <span className="mascot-shoe mascot-shoe-right" />
      <span className="mascot-torso">
        <span className="mascot-shirt-line" />
        <span className="mascot-badge" />
      </span>
      <span className="mascot-arm mascot-arm-left" />
      <span className="mascot-arm mascot-arm-right" />
      <span className="mascot-hand mascot-hand-left" />
      <span className="mascot-hand mascot-hand-right" />
      <span className="mascot-neck" />
      <span className="mascot-head">
        <span className="mascot-hair" />
        <span className="mascot-eye mascot-eye-left" />
        <span className="mascot-eye mascot-eye-right" />
        <span className="mascot-smile" />
      </span>
      <span className="mascot-cap">
        <span />
      </span>
    </motion.div>
  )
}
