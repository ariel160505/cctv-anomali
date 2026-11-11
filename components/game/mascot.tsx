'use client'

import { motion } from 'motion/react'

export function PatrolMascot() {
  return (
    <motion.div
      className="mascot-svg-wrapper"
      animate={{
        y: [0, -8, 0],
      }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Speech Bubble: Sombong & Menantang */}
      <motion.div
        className="mascot-bubble-pill"
        animate={{ scale: [0.96, 1.04, 0.96] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span>😏 &ldquo;Tangkap gw kalau bisa!&rdquo;</span>
      </motion.div>

      {/* High Quality Stylized SVG Mascot (Gaya Sombong Tangan Berpangku) */}
      <svg
        width="220"
        height="260"
        viewBox="0 0 220 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mascot-svg"
      >
        <defs>
          {/* Shadow filter */}
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.25" />
          </filter>
          {/* Uniform gradient */}
          <linearGradient id="shirtGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
          {/* Pants gradient */}
          <linearGradient id="pantsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          {/* Skin gradient */}
          <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDE3D2" />
            <stop offset="100%" stopColor="#F8C7AB" />
          </linearGradient>
        </defs>

        {/* Ground Oval Shadow */}
        <ellipse cx="110" cy="245" rx="55" ry="10" fill="#000000" opacity="0.35" />

        {/* Legs / Celana Abu-Abu SMA */}
        <g id="legs">
          {/* Kaki Kiri */}
          <path d="M88 165 L82 225 L98 225 L102 165 Z" fill="url(#pantsGrad)" />
          {/* Kaki Kanan */}
          <path d="M118 165 L122 225 L138 225 L132 165 Z" fill="url(#pantsGrad)" />
          {/* Lipatan celana */}
          <path d="M82 205 Q90 208 98 205" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <path d="M122 205 Q130 208 138 205" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Sepatu Sneakers Keren */}
        <g id="shoes">
          {/* Sepatu Kiri */}
          <path
            d="M74 232 C74 227 82 224 94 224 L102 224 C104 229 102 235 102 237 C96 238 78 238 74 232 Z"
            fill="#FFFFFF"
            stroke="#0F172A"
            strokeWidth="2.5"
          />
          <path d="M72 236 L102 236" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
          
          {/* Sepatu Kanan */}
          <path
            d="M146 232 C146 227 138 224 126 224 L118 224 C116 229 118 235 118 237 C124 238 142 238 146 232 Z"
            fill="#FFFFFF"
            stroke="#0F172A"
            strokeWidth="2.5"
          />
          <path d="M148 236 L118 236" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Torso / Kemeja Putih Seragam */}
        <g id="torso" filter="url(#softShadow)">
          <path
            d="M75 105 L145 105 L140 172 C140 176 136 180 132 180 L88 180 C84 180 80 176 80 172 Z"
            fill="url(#shirtGrad)"
            stroke="#0F172A"
            strokeWidth="2.5"
          />
          {/* Garis Kancing & Kerah */}
          <line x1="110" y1="115" x2="110" y2="180" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M96 105 L110 122 L124 105" stroke="#CBD5E1" strokeWidth="2.5" fill="none" />
          
          {/* Dasi Santai Sedikit Miring */}
          <path
            d="M107 114 L113 114 L115 142 L110 148 L105 142 Z"
            fill="#475569"
            stroke="#0F172A"
            strokeWidth="1.5"
          />
          {/* Saku & Logo OSIS SMA */}
          <rect x="85" y="122" width="14" height="12" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
          <circle cx="92" cy="128" r="3" fill="#3B82F6" />
        </g>

        {/* Tangan Berpangku / Crossed Arms (Pose Sombong) */}
        <g id="crossedArms" filter="url(#softShadow)">
          {/* Lengan Kiri Menyilang */}
          <path
            d="M72 110 C62 120 60 138 78 145 L142 145 C150 142 152 135 148 128"
            stroke="#0F172A"
            strokeWidth="20"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M72 110 C62 120 60 138 78 145 L142 145 C150 142 152 135 148 128"
            stroke="url(#shirtGrad)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Telapak Tangan Kiri Menyelip di Lengan Kanan */}
          <rect x="132" y="136" width="16" height="14" rx="4" fill="url(#skinGrad)" stroke="#0F172A" strokeWidth="2" />
          {/* Jari-jari Kiri */}
          <line x1="136" y1="139" x2="136" y2="147" stroke="#E29578" strokeWidth="1.5" />
          <line x1="140" y1="139" x2="140" y2="147" stroke="#E29578" strokeWidth="1.5" />

          {/* Lengan Kanan Menyilang di Depan */}
          <path
            d="M148 110 C158 120 156 142 136 150 L84 150 C76 147 74 140 76 132"
            stroke="#0F172A"
            strokeWidth="20"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M148 110 C158 120 156 142 136 150 L84 150 C76 147 74 140 76 132"
            stroke="url(#shirtGrad)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Telapak Tangan Kanan Menyelip di Lengan Kiri */}
          <rect x="74" y="141" width="16" height="14" rx="4" fill="url(#skinGrad)" stroke="#0F172A" strokeWidth="2" />
          {/* Jari-jari Kanan */}
          <line x1="78" y1="144" x2="78" y2="152" stroke="#E29578" strokeWidth="1.5" />
          <line x1="82" y1="144" x2="82" y2="152" stroke="#E29578" strokeWidth="1.5" />
        </g>

        {/* Leher */}
        <rect x="103" y="94" width="14" height="15" fill="url(#skinGrad)" stroke="#0F172A" strokeWidth="2" />

        {/* Kepala & Wajah Tengil / Sombong */}
        <g id="head" filter="url(#softShadow)">
          {/* Bentuk Wajah */}
          <path
            d="M80 60 C80 45 92 38 110 38 C128 38 140 45 140 60 C140 82 126 98 110 98 C94 98 80 82 80 60 Z"
            fill="url(#skinGrad)"
            stroke="#0F172A"
            strokeWidth="2.5"
          />

          {/* Telinga */}
          <ellipse cx="78" cy="65" rx="5" ry="8" fill="url(#skinGrad)" stroke="#0F172A" strokeWidth="2" />
          <ellipse cx="142" cy="65" rx="5" ry="8" fill="url(#skinGrad)" stroke="#0F172A" strokeWidth="2" />

          {/* Plester Kuning di Pipi Kiri (Khas Anak Bandel) */}
          <rect
            x="86"
            y="72"
            width="12"
            height="6"
            rx="1.5"
            fill="#FACC15"
            stroke="#CA8A04"
            strokeWidth="1"
            transform="rotate(18 86 72)"
          />

          {/* Alis Kiri Miring Santai */}
          <path d="M90 56 Q97 53 103 57" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          {/* Alis Kanan Terangkat Tinggi (Ekspresi Sombong) */}
          <path d="M117 52 Q125 47 132 54" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />

          {/* Mata Melirik Sombong */}
          {/* Mata Kiri */}
          <ellipse cx="97" cy="64" rx="5" ry="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <circle cx="98" cy="63" r="3" fill="#0F172A" />
          <circle cx="99.5" cy="61.5" r="1" fill="#FFFFFF" />

          {/* Mata Kanan */}
          <ellipse cx="123" cy="64" rx="5" ry="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <circle cx="124" cy="63" r="3" fill="#0F172A" />
          <circle cx="125.5" cy="61.5" r="1" fill="#FFFFFF" />

          {/* Hidung */}
          <path d="M109 67 L108 72 L112 72" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />

          {/* Senyum Miring Sombong (Smug Smirk) */}
          <path
            d="M104 80 Q114 86 124 77"
            stroke="#991B1B"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M123 76 L125 79" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" />

          {/* Rambut Anime Keren & Sedikit Berantakan */}
          <g id="hair">
            <path
              d="M76 56 C74 38 86 24 110 24 C134 24 146 38 144 56 C144 52 140 48 136 48 C132 40 124 35 110 35 C98 35 90 40 85 48 C81 50 78 52 76 56 Z"
              fill="#1E293B"
            />
            {/* Poni Rambut */}
            <path
              d="M78 48 Q88 40 96 52 Q104 38 116 50 Q126 38 142 50 C140 42 134 32 110 30 C88 30 82 40 78 48 Z"
              fill="#0F172A"
            />
            {/* Helai rambut atas berantakan (Ahoge) */}
            <path d="M108 24 Q116 12 124 18" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
        </g>
      </svg>
    </motion.div>
  )
}
