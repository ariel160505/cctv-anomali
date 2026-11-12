export type AnomalyType = 'sosok-misterius' | 'benda-hilang' | 'penambahan-benda' | 'siswa-bolos' | 'anomali'

export type AnomalyDef = {
  id: string
  type: AnomalyType
  label: string
  image: string
  angleIndex: number // which camera angle (0, 1, 2)
  isSpecialTwoStage?: boolean
  stage2Image?: string
}

export type LocationAngle = {
  angleIndex: number
  name: string
  baseImage: string
}

export type GameLocation = {
  id: string
  camNumber: string
  name: string // e.g. "GEDUNG SMK"
  folderSlug: string
  angles: LocationAngle[]
  anomalies: AnomalyDef[]
}

export const GAME_LOCATIONS: GameLocation[] = [
  {
    id: 'gedung-smk',
    camNumber: '01',
    name: 'GEDUNG SMK',
    folderSlug: 'gedung-smk',
    angles: [
      { angleIndex: 0, name: 'Koridor Utama (GSMK-1)', baseImage: '/images/game/gedung-smk/GSMK1-asli.jpg' },
      { angleIndex: 1, name: 'Area Rak Sepatu (GSMK-2)', baseImage: '/images/game/gedung-smk/GSMK2-asli.jpg' },
      { angleIndex: 2, name: 'Selasar Kelas (GSMK-3)', baseImage: '/images/game/gedung-smk/GSMK3-asli.jpg' },
    ],
    anomalies: [
      {
        id: 'gsmk1-bolos',
        type: 'siswa-bolos',
        label: 'Siswa Mengintip di Balik Dinding',
        image: '/images/game/gedung-smk/GSMK1-anomali bolos.jpg',
        angleIndex: 0,
      },
      {
        id: 'gsmk1-hilang',
        type: 'benda-hilang',
        label: 'Objek Koridor Hilang',
        image: '/images/game/gedung-smk/GSMK1-anomali hilang.jpg',
        angleIndex: 0,
      },
      {
        id: 'gsmk1-sosok',
        type: 'sosok-misterius',
        label: 'Sosok Hitam di Ujung Lorong',
        image: '/images/game/gedung-smk/GSMK1-anomali sosok.jpg',
        angleIndex: 0,
      },
      {
        id: 'gsmk2-hilang',
        type: 'benda-hilang',
        label: 'Rak Sepatu Lenyap',
        image: '/images/game/gedung-smk/GSMK2-anomali hilang.jpg',
        angleIndex: 1,
      },
      {
        id: 'gsmk2-sosok',
        type: 'sosok-misterius',
        label: 'Sosok Menyeramkan Dekat Tangga',
        image: '/images/game/gedung-smk/GSMK2-anomali sosok.jpg',
        angleIndex: 1,
      },
      {
        id: 'gsmk3-bolos',
        type: 'siswa-bolos',
        label: 'Siswa Bersembunyi di Sudut',
        image: '/images/game/gedung-smk/GSMK3-anomali bolos.jpg',
        angleIndex: 2,
      },
    ],
  },
  {
    id: 'gedung-smp',
    camNumber: '02',
    name: 'GEDUNG SMP',
    folderSlug: 'gedung-smp',
    angles: [
      { angleIndex: 0, name: 'Lorong Kelas (GSMP-1)', baseImage: '/images/game/gedung-smp/GSMP1-asli.jpg' },
      { angleIndex: 1, name: 'Koridor Depan (GSMP-2)', baseImage: '/images/game/gedung-smp/GSMP2-asli.jpg' },
      { angleIndex: 2, name: 'Selasar Tangga (GSMP-3)', baseImage: '/images/game/gedung-smp/GSMP3-asli.jpg' },
    ],
    anomalies: [
      {
        id: 'gsmp1-hilang',
        type: 'benda-hilang',
        label: 'Benda di Koridor Lenyap',
        image: '/images/game/gedung-smp/GSMP1-anomali hilang.jpg',
        angleIndex: 0,
      },
      {
        id: 'gsmp1-sosok',
        type: 'sosok-misterius',
        label: 'Sosok Wajah Mengerikan Dekat Kamera',
        image: '/images/game/gedung-smp/GSMP1-anomali sosok.jpg',
        angleIndex: 0,
      },
      {
        id: 'gsmp3-anomali',
        type: 'sosok-misterius',
        label: 'Entitas Ganjil di Tangga',
        image: '/images/game/gedung-smp/GSMP3-anomali.jpg',
        angleIndex: 2,
      },
    ],
  },
  {
    id: 'kantin',
    camNumber: '03',
    name: 'KANTIN',
    folderSlug: 'kantin',
    angles: [
      { angleIndex: 0, name: 'Area Meja Makan (K-1)', baseImage: '/images/game/kantin/K1-asli.jpg' },
      { angleIndex: 1, name: 'Selasar Meja Panjang (K-2)', baseImage: '/images/game/kantin/K2-asli.jpg' },
      { angleIndex: 2, name: 'Depan Warung (K-3)', baseImage: '/images/game/kantin/K3-asli.jpg' },
    ],
    anomalies: [
      {
        id: 'k1-hilang',
        type: 'benda-hilang',
        label: 'Bangku Kantin Hilang',
        image: '/images/game/kantin/K1-anomali hilang.jpg',
        angleIndex: 0,
      },
      {
        id: 'k1-sosok',
        type: 'sosok-misterius',
        label: 'Sosok Mengintai di Balik Warung',
        image: '/images/game/kantin/K1-anomali sosok.jpg',
        angleIndex: 0,
      },
      {
        id: 'k2-bolos',
        type: 'siswa-bolos',
        label: 'Siswa Bersembunyi di Bawah Meja',
        image: '/images/game/kantin/K2-anomali bolos.jpg',
        angleIndex: 1,
      },
      {
        id: 'k2-sosok',
        type: 'sosok-misterius',
        label: 'Sosok Gelap Duduk di Meja Kantin',
        image: '/images/game/kantin/K2-anomali sosok.jpg',
        angleIndex: 1,
      },
      {
        id: 'k3-hilang',
        type: 'benda-hilang',
        label: 'Fasilitas Warung Lenyap',
        image: '/images/game/kantin/K3-anomali hilang.jpg',
        angleIndex: 2,
      },
      {
        id: 'k3-sosok',
        type: 'sosok-misterius',
        label: 'Sosok Berdiri di Sudut Warung',
        image: '/images/game/kantin/K3-anomali sosok.jpg',
        angleIndex: 2,
      },
    ],
  },
  {
    id: 'kebun',
    camNumber: '04',
    name: 'KEBUN',
    folderSlug: 'kebun',
    angles: [
      { angleIndex: 0, name: 'Jalan Setapak Kebun (KBN-1)', baseImage: '/images/game/kebun/KBN1-asli.jpg' },
      { angleIndex: 1, name: 'Bedengan Tanaman (KBN-2)', baseImage: '/images/game/kebun/KBN2-asli.jpg' },
      { angleIndex: 2, name: 'Rimbun Pohon Belakang (KBN-3)', baseImage: '/images/game/kebun/KBN3-asli.jpg' },
    ],
    anomalies: [
      {
        id: 'kbn1-sosok-special',
        type: 'sosok-misterius',
        label: 'Sosok Misterius Kebun (Agresif)',
        image: '/images/game/kebun/KBN1-anomali sosok awal pas pemain lapor sistem ga bisa lapor dan tampilannya bergetarrr.jpg',
        angleIndex: 0,
        isSpecialTwoStage: true,
        stage2Image: '/images/game/kebun/KBN1-anomali sosok setelah muncul anomali sosok pertama pas user klik lapor.jpg',
      },
      {
        id: 'kbn2-bolos',
        type: 'siswa-bolos',
        label: 'Siswa Bersembunyi di Kotak Bedengan',
        image: '/images/game/kebun/KBN2-anomali bolos.jpg',
        angleIndex: 1,
      },
    ],
  },
  {
    id: 'lapangan',
    camNumber: '05',
    name: 'LAPANGAN',
    folderSlug: 'lapangan',
    angles: [
      { angleIndex: 0, name: 'Lapangan Basket (LP-1)', baseImage: '/images/game/lapangan/LP-asli.jpg' },
      { angleIndex: 1, name: 'Parkir Lapangan (LP-2)', baseImage: '/images/game/lapangan/LP-asli2.jpg' },
    ],
    anomalies: [
      {
        id: 'lp1-hilang',
        type: 'benda-hilang',
        label: 'Tiang / Fasilitas Lapangan Hilang',
        image: '/images/game/lapangan/LP-asli anomali hilang.jpg',
        angleIndex: 0,
      },
      {
        id: 'lp1-bolos',
        type: 'siswa-bolos',
        label: 'Siswa Berdiri di Tengah Lapangan',
        image: '/images/game/lapangan/LP-asli anomali siswa bolos.jpg',
        angleIndex: 0,
      },
      {
        id: 'lp1-sosok',
        type: 'sosok-misterius',
        label: 'Sosok Hitam di Tribun Lapangan',
        image: '/images/game/lapangan/LP-asli anomali sosok.jpg',
        angleIndex: 0,
      },
      {
        id: 'lp1-tambah',
        type: 'penambahan-benda',
        label: 'Benda Asing di Garis Lapangan',
        image: '/images/game/lapangan/LP-asli anomali tambahan barang.jpg',
        angleIndex: 0,
      },
      {
        id: 'lp2-motor-hilang',
        type: 'benda-hilang',
        label: 'Sepeda Motor Parkir Hilang',
        image: '/images/game/lapangan/LP-asli2 anomali motor hilang.jpg',
        angleIndex: 1,
      },
      {
        id: 'lp2-sosok',
        type: 'sosok-misterius',
        label: 'Sosok Bayangan di Antara Motor',
        image: '/images/game/lapangan/LP-asli2 anomali sosok.jpg',
        angleIndex: 1,
      },
      {
        id: 'lp2-tambah',
        type: 'penambahan-benda',
        label: 'Benda Misterius di Dekat Motor',
        image: '/images/game/lapangan/LP-asli2 anomali tambah.jpg',
        angleIndex: 1,
      },
    ],
  },
  {
    id: 'parkiran',
    camNumber: '06',
    name: 'PARKIRAN',
    folderSlug: 'parkiran',
    angles: [
      { angleIndex: 0, name: 'Kanopi Depan (P-1)', baseImage: '/images/game/parkiran/P1-Asli.jpg' },
      { angleIndex: 1, name: 'Parkiran Motor Luar (P-2)', baseImage: '/images/game/parkiran/P2-Asli.jpg' },
    ],
    anomalies: [
      {
        id: 'p1-anomali',
        type: 'anomali',
        label: 'Perubahan Ganjil di Parkiran Depan',
        image: '/images/game/parkiran/P1-anomali.jpg',
        angleIndex: 0,
      },
      {
        id: 'p2-anomali1',
        type: 'anomali',
        label: 'Anomali Bayangan Kendaraan',
        image: '/images/game/parkiran/P2-anomali.jpg',
        angleIndex: 1,
      },
      {
        id: 'p2-anomali2',
        type: 'anomali',
        label: 'Penampakan Ganjil Parkiran',
        image: '/images/game/parkiran/p2-anomali2.jpg',
        angleIndex: 1,
      },
    ],
  },
]

export type FlatCameraAngle = {
  globalIndex: number
  locationIndex: number
  angleIndex: number
  locationId: string
  locationName: string
  camNumber: string
  angleName: string
  baseImage: string
}

export const ALL_CAMERA_ANGLES: FlatCameraAngle[] = GAME_LOCATIONS.flatMap(
  (loc, locIdx) =>
    loc.angles.map((ang) => ({
      globalIndex: 0,
      locationIndex: locIdx,
      angleIndex: ang.angleIndex,
      locationId: loc.id,
      locationName: loc.name,
      camNumber: loc.camNumber,
      angleName: ang.name,
      baseImage: ang.baseImage,
    }))
).map((item, idx) => ({ ...item, globalIndex: idx }))

export const ANOMALY_REPORT_OPTIONS: {
  type: AnomalyType
  label: string
  icon: string
  description: string
}[] = [
  {
    type: 'sosok-misterius',
    label: 'Sosok Misterius',
    icon: '👤',
    description: 'Penampakan makhluk ganjil atau bayangan hitam',
  },
  {
    type: 'benda-hilang',
    label: 'Benda Hilang',
    icon: '📦',
    description: 'Barang, rak, atau motor yang tiba-tiba lenyap',
  },
  {
    type: 'penambahan-benda',
    label: 'Penambahan Benda',
    icon: '🎒',
    description: 'Barang misterius asing yang tiba-tiba muncul',
  },
  {
    type: 'siswa-bolos',
    label: 'Aktivitas Gerakan / Siswa',
    icon: '🏃',
    description: 'Siswa atau orang yang bersembunyi / mengintip',
  },
]

export type ActiveAnomalyState = {
  instanceId: string
  locationId: string
  angleIndex: number
  anomaly: AnomalyDef
  currentStage: number // 1 or 2 (for 2-stage special anomaly)
  spawnedAt: number
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export type LeaderboardEntry = {
  id: string
  score: number
  date: string
}

export const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', score: 120, date: 'Skor Standar' },
  { id: '2', score: 90, date: 'Skor Standar' },
  { id: '3', score: 70, date: 'Skor Standar' },
  { id: '4', score: 50, date: 'Skor Standar' },
  { id: '5', score: 30, date: 'Skor Standar' },
]

export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return DEFAULT_LEADERBOARD
  try {
    const raw = localStorage.getItem('cctv_aqis_scores_v3')
    if (!raw) {
      localStorage.setItem('cctv_aqis_scores_v3', JSON.stringify(DEFAULT_LEADERBOARD))
      return DEFAULT_LEADERBOARD
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed.slice(0, 5) : DEFAULT_LEADERBOARD
  } catch {
    return DEFAULT_LEADERBOARD
  }
}

export function savePlayerScore(score: number): LeaderboardEntry[] {
  if (typeof window === 'undefined' || score <= 0) return getLeaderboard()
  try {
    const current = getLeaderboard()
    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      score,
      date: 'Skor Terbaru',
    }
    const combined = [...current, newEntry]
    combined.sort((a, b) => b.score - a.score)
    const top5 = combined.slice(0, 5)
    localStorage.setItem('cctv_aqis_scores_v3', JSON.stringify(top5))
    return top5
  } catch {
    return DEFAULT_LEADERBOARD
  }
}
