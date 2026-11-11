export type CampusLocation = {
  id: string
  camera: string
  name: string
  shortName: string
  description: string
  image: string
  x: number
  y: number
}

export type LeaderboardEntry = {
  name: string
  score: number
}

export const LOCATIONS: CampusLocation[] = [
  {
    id: 'gedung-smk',
    camera: '01',
    name: 'GEDUNG SMK',
    shortName: 'Gedung SMK',
    description: 'Koridor kelas dan ruang praktik',
    image: '/images/locations/gedung-smk.png',
    x: 48,
    y: 27,
  },
  {
    id: 'gedung-smp',
    camera: '02',
    name: 'GEDUNG SMP',
    shortName: 'Gedung SMP',
    description: 'Lorong kelas dan area loker',
    image: '/images/locations/gedung-smp.png',
    x: 75,
    y: 27,
  },
  {
    id: 'kantin',
    camera: '03',
    name: 'KANTIN',
    shortName: 'Kantin',
    description: 'Meja makan dan konter jajanan',
    image: '/images/locations/kantin.png',
    x: 28,
    y: 54,
  },
  {
    id: 'kebun-smp',
    camera: '04',
    name: 'KEBUN SMP',
    shortName: 'Kebun SMP',
    description: 'Kebun rindang di belakang sekolah',
    image: '/images/locations/kebun-smp.png',
    x: 75,
    y: 54,
  },
  {
    id: 'lapangan',
    camera: '05',
    name: 'LAPANGAN',
    shortName: 'Lapangan',
    description: 'Lapangan olahraga dan tribun',
    image: '/images/locations/lapangan.png',
    x: 49,
    y: 75,
  },
  {
    id: 'masjid-al-haramain',
    camera: '06',
    name: 'MASJID AL-HARAMAIN',
    shortName: 'Masjid Al-Haramain',
    description: 'Halaman tempat ibadah sekolah',
    image: '/images/locations/masjid-al-haramain.png',
    x: 13,
    y: 29,
  },
  {
    id: 'parkiran',
    camera: '07',
    name: 'PARKIRAN',
    shortName: 'Parkiran',
    description: 'Area parkir motor dan sepeda',
    image: '/images/locations/parkiran.png',
    x: 87,
    y: 77,
  },
]

export const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { name: 'Satpam Bambang', score: 1200 },
  { name: 'Guru BK Ani', score: 950 },
  { name: 'Pak Joko', score: 700 },
]

export const LEADERBOARD_STORAGE_KEY = 'cctv-patrol-leaderboard-v1'

export function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
