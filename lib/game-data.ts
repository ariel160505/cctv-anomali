import anomaliesCatalog from './anomalies-data.json'

export type AnomalyType = 'benda-hilang' | 'penambahan-benda' | 'sosok-misterius' | 'siswa-bolos'

export type RoomAnomaly = {
  id: string
  type: AnomalyType
  label: string
  image: string
  x: number // percentage 0-100
  y: number // percentage 0-100
  w: number // percentage
  h: number // percentage
}

export type ActiveAnomaly = {
  id: string
  locationId: string
  anomaly: RoomAnomaly
  spawnedAt: number
}

export type CampusLocation = {
  id: string
  camera: string
  name: string
  shortName: string
  description: string
  baseImage: string
  images: string[]
  mapX: number // X coordinate on clean MAP GAME V2.jpg (%)
  mapY: number // Y coordinate on clean MAP GAME V2.jpg (%)
  pinNumber: number
  anomalies: RoomAnomaly[]
}

export type LeaderboardEntry = {
  name: string
  score: number
  date?: string
}

export const ANOMALY_CATEGORIES: {
  type: AnomalyType
  label: string
  icon: string
  color: string
  description: string
}[] = [
  {
    type: 'benda-hilang',
    label: 'Benda Hilang',
    icon: '📦',
    color: '#38bdf8',
    description: 'Benda atau fasilitas yang tiba-tiba lenyap',
  },
  {
    type: 'penambahan-benda',
    label: 'Penambahan Benda',
    icon: '🎒',
    color: '#fbbf24',
    description: 'Tas, koper, atau barang mencurigakan yang baru muncul',
  },
  {
    type: 'sosok-misterius',
    label: 'Sosok Misterius',
    icon: '👤',
    color: '#a855f7',
    description: 'Bayangan hitam atau entitas ganjil di sudut ruangan',
  },
  {
    type: 'siswa-bolos',
    label: 'Siswa Bolos',
    icon: '🏃',
    color: '#34d399',
    description: 'Murid yang bersembunyi atau mengintip di jam pelajaran',
  },
]

// Helper to look up anomalies catalog
function getAnomaliesForLocation(locationId: string): { baseImage: string; anomalies: RoomAnomaly[] } {
  const match = (anomaliesCatalog as { locationId: string; baseImage: string; anomalies: RoomAnomaly[] }[]).find(
    (item) => item.locationId === locationId
  )
  if (match) {
    return {
      baseImage: match.baseImage,
      anomalies: match.anomalies,
    }
  }
  return {
    baseImage: `/images/school/${locationId}/${locationId}-base.jpg`,
    anomalies: [],
  }
}

export const LOCATIONS: CampusLocation[] = [
  {
    id: 'masjid-al-haramain',
    camera: '01',
    name: 'MESJID AL-HARAMAIN',
    shortName: 'Mesjid Al-Haramain',
    description: 'Ruang ibadah, serambi & area tirai',
    baseImage: getAnomaliesForLocation('masjid-al-haramain').baseImage,
    images: ['/images/school/masjid/1.jpg', '/images/school/masjid/2.jpg'],
    mapX: 24,
    mapY: 56,
    pinNumber: 1,
    anomalies: getAnomaliesForLocation('masjid-al-haramain').anomalies,
  },
  {
    id: 'lapangan',
    camera: '02',
    name: 'LAPANGAN OLAHRAGA',
    shortName: 'Lapangan',
    description: 'Lapangan basket, tribun & parkir motor',
    baseImage: getAnomaliesForLocation('lapangan').baseImage,
    images: ['/images/school/lapangan/LP-asli.jpg', '/images/school/lapangan/LP-asli2.jpg'],
    mapX: 54,
    mapY: 49,
    pinNumber: 2,
    anomalies: getAnomaliesForLocation('lapangan').anomalies,
  },
  {
    id: 'kebun-smp',
    camera: '03',
    name: 'KEBUN SMP',
    shortName: 'Kebun SMP',
    description: 'Bedengan tanaman & pohon rindang',
    baseImage: getAnomaliesForLocation('kebun-smp').baseImage,
    images: ['/images/school/kebun-smp/KBN1-asli.jpg', '/images/school/kebun-smp/KBN2-asli.jpg'],
    mapX: 64,
    mapY: 22,
    pinNumber: 3,
    anomalies: getAnomaliesForLocation('kebun-smp').anomalies,
  },
  {
    id: 'parkiran',
    camera: '04',
    name: 'PARKIRAN KENDARAAN',
    shortName: 'Parkiran',
    description: 'Area kanopi motor & mobil',
    baseImage: getAnomaliesForLocation('parkiran').baseImage,
    images: ['/images/school/parkiran/P1-Asli.jpg', '/images/school/parkiran/P2-Asli.jpg'],
    mapX: 57,
    mapY: 88,
    pinNumber: 4,
    anomalies: getAnomaliesForLocation('parkiran').anomalies,
  },
  {
    id: 'gedung-smk',
    camera: '05',
    name: 'GEDUNG SMK',
    shortName: 'Gedung SMK',
    description: 'Koridor lantai atas & rak sepatu',
    baseImage: getAnomaliesForLocation('gedung-smk').baseImage,
    images: ['/images/school/gedung-smk/GSMK1-asli.jpg', '/images/school/gedung-smk/GSMK2-asli.jpg'],
    mapX: 70,
    mapY: 68,
    pinNumber: 5,
    anomalies: getAnomaliesForLocation('gedung-smk').anomalies,
  },
  {
    id: 'gedung-smp',
    camera: '06',
    name: 'GEDUNG SMP',
    shortName: 'Gedung SMP',
    description: 'Lorong kelas berpenyekat tirai & rak sepatu',
    baseImage: getAnomaliesForLocation('gedung-smp').baseImage,
    images: ['/images/school/gedung-smp/GSMP1-asli.jpg', '/images/school/gedung-smp/GSMP2-asli.jpg'],
    mapX: 80,
    mapY: 34,
    pinNumber: 6,
    anomalies: getAnomaliesForLocation('gedung-smp').anomalies,
  },
  {
    id: 'kantin',
    camera: '07',
    name: 'KANTIN SEKOLAH',
    shortName: 'Kantin',
    description: 'Meja panjang, bangku & etalase warung',
    baseImage: getAnomaliesForLocation('kantin').baseImage,
    images: ['/images/school/kantin/K1-asli.jpg', '/images/school/kantin/K2-asli.jpg'],
    mapX: 72,
    mapY: 50,
    pinNumber: 7,
    anomalies: getAnomaliesForLocation('kantin').anomalies,
  },
]

export const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { name: 'Satpam Bambang', score: 1800 },
  { name: 'Guru BK Ani', score: 1350 },
  { name: 'Pak Joko', score: 900 },
]

export const LEADERBOARD_STORAGE_KEY = 'cctv-anomali-leaderboard-v4'

export function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
