export type HidingSpot = {
  id: string
  x: number // percentage 0-100
  y: number // percentage 0-100
  scale: number // scale factor (0.3 - 0.7)
  pose: 'peek-left' | 'peek-right' | 'crouch' | 'peek-behind' | 'stand-far'
  angleIndex: number // which photo index this spot belongs to
  hint: string
}

export type CampusLocation = {
  id: string
  camera: string
  name: string
  shortName: string
  description: string
  images: string[]
  mapX: number // X coordinate on MAP GAME.jpg (%)
  mapY: number // Y coordinate on MAP GAME.jpg (%)
  pinNumber: number
  hidingSpots: HidingSpot[]
}

export type LeaderboardEntry = {
  name: string
  score: number
  date?: string
}

export const LOCATIONS: CampusLocation[] = [
  {
    id: 'masjid-al-haramain',
    camera: '01',
    name: 'MASJID AL-HARAMAIN',
    shortName: 'Mesjid Al-Haramain',
    description: 'Ruang ibadah, serambi & area tirai shaf',
    images: [
      '/images/school/masjid/1.jpg',
      '/images/school/masjid/2.jpg',
    ],
    mapX: 28,
    mapY: 51,
    pinNumber: 1,
    hidingSpots: [
      { id: 'm-1', angleIndex: 0, x: 19, y: 64, scale: 0.55, pose: 'peek-left', hint: 'Di balik tiang pilar kiri' },
      { id: 'm-2', angleIndex: 0, x: 65, y: 39, scale: 0.38, pose: 'crouch', hint: 'Dekat mimbar mihrab' },
      { id: 'm-3', angleIndex: 0, x: 32, y: 88, scale: 0.7, pose: 'peek-behind', hint: 'Di balik tirai pembatas' },
      { id: 'm-4', angleIndex: 0, x: 77, y: 38, scale: 0.35, pose: 'peek-right', hint: 'Di selasar kaca kanan' },
    ],
  },
  {
    id: 'lapangan',
    camera: '02',
    name: 'LAPANGAN OLAHRAGA',
    shortName: 'Lapangan',
    description: 'Lapangan basket, tribun & deretan parkir',
    images: [
      '/images/school/lapangan/1.jpg',
      '/images/school/lapangan/2.jpg',
    ],
    mapX: 54,
    mapY: 48,
    pinNumber: 2,
    hidingSpots: [
      { id: 'l-1', angleIndex: 0, x: 34, y: 76, scale: 0.38, pose: 'crouch', hint: 'Di sela-sela motor depan' },
      { id: 'l-2', angleIndex: 0, x: 75, y: 36, scale: 0.3, pose: 'crouch', hint: 'Di tangga tribun' },
      { id: 'l-3', angleIndex: 0, x: 58, y: 44, scale: 0.32, pose: 'stand-far', hint: 'Dekat tiang basket' },
      { id: 'l-4', angleIndex: 0, x: 22, y: 48, scale: 0.35, pose: 'peek-left', hint: 'Di balik pagar kawat' },
    ],
  },
  {
    id: 'kebun-smp',
    camera: '03',
    name: 'KEBUN SMP',
    shortName: 'Kebun SMP',
    description: 'Area tanaman, bedengan & pohon rindang',
    images: [
      '/images/school/kebun-smp/1.jpg',
      '/images/school/kebun-smp/2.jpg',
      '/images/school/kebun-smp/3.jpg',
    ],
    mapX: 70,
    mapY: 16,
    pinNumber: 3,
    hidingSpots: [
      { id: 'kb-1', angleIndex: 0, x: 38, y: 62, scale: 0.45, pose: 'crouch', hint: 'Di balik kotak tanaman' },
      { id: 'kb-2', angleIndex: 0, x: 74, y: 32, scale: 0.38, pose: 'peek-left', hint: 'Di balik rimbun pohon' },
      { id: 'kb-3', angleIndex: 0, x: 48, y: 32, scale: 0.32, pose: 'peek-behind', hint: 'Dekat dinding belakang' },
      { id: 'kb-4', angleIndex: 0, x: 33, y: 22, scale: 0.35, pose: 'peek-right', hint: 'Dekat pohon pisang' },
    ],
  },
  {
    id: 'parkiran',
    camera: '04',
    name: 'PARKIRAN KENDARAAN',
    shortName: 'Parkiran',
    description: 'Kanoopi parkir motor & area mobil',
    images: [
      '/images/school/parkiran/1.jpg',
      '/images/school/parkiran/2.jpg',
    ],
    mapX: 57,
    mapY: 81,
    pinNumber: 4,
    hidingSpots: [
      { id: 'p-1', angleIndex: 0, x: 39, y: 64, scale: 0.5, pose: 'crouch', hint: 'Di antara motor tengah' },
      { id: 'p-2', angleIndex: 0, x: 71, y: 55, scale: 0.45, pose: 'peek-left', hint: 'Di balik tiang kanopi' },
      { id: 'p-3', angleIndex: 0, x: 50, y: 48, scale: 0.4, pose: 'stand-far', hint: 'Dekat pintu belakang' },
      { id: 'p-4', angleIndex: 0, x: 54, y: 66, scale: 0.55, pose: 'peek-behind', hint: 'Di balik motor depan' },
    ],
  },
  {
    id: 'gedung-smk',
    camera: '05',
    name: 'GEDUNG SMK',
    shortName: 'Gedung SMK',
    description: 'Koridor lantai atas, pilar oranye & rak sepatu',
    images: [
      '/images/school/gedung-smk/1.jpg',
      '/images/school/gedung-smk/2.jpg',
      '/images/school/gedung-smk/3.jpg',
    ],
    mapX: 71,
    mapY: 63,
    pinNumber: 5,
    hidingSpots: [
      { id: 'smk-1', angleIndex: 0, x: 36, y: 44, scale: 0.55, pose: 'peek-left', hint: 'Di balik pilar oranye' },
      { id: 'smk-2', angleIndex: 0, x: 43, y: 72, scale: 0.5, pose: 'crouch', hint: 'Dekat rak sepatu' },
      { id: 'smk-3', angleIndex: 0, x: 60, y: 50, scale: 0.3, pose: 'stand-far', hint: 'Ujung lorong kelas' },
      { id: 'smk-4', angleIndex: 0, x: 72, y: 46, scale: 0.55, pose: 'peek-right', hint: 'Di balik dinding kanan' },
    ],
  },
  {
    id: 'gedung-smp',
    camera: '06',
    name: 'GEDUNG SMP',
    shortName: 'Gedung SMP',
    description: 'Lorong kelas berpenyekat tirai & rak sepatu',
    images: [
      '/images/school/gedung-smp/1.jpg',
    ],
    mapX: 81,
    mapY: 36,
    pinNumber: 6,
    hidingSpots: [
      { id: 'smp-1', angleIndex: 0, x: 32, y: 45, scale: 0.5, pose: 'peek-behind', hint: 'Di balik tirai jendela' },
      { id: 'smp-2', angleIndex: 0, x: 67, y: 78, scale: 0.55, pose: 'crouch', hint: 'Di dekat rak sepatu' },
      { id: 'smp-3', angleIndex: 0, x: 84, y: 64, scale: 0.4, pose: 'peek-left', hint: 'Ujung lorong kanan' },
      { id: 'smp-4', angleIndex: 0, x: 48, y: 62, scale: 0.6, pose: 'peek-right', hint: 'Di balik dinding tengah' },
    ],
  },
  {
    id: 'kantin',
    camera: '07',
    name: 'KANTIN SEKOLAH',
    shortName: 'Kantin',
    description: 'Deretan meja makan, bangku & etalase makanan',
    images: [
      '/images/school/kantin/1.jpg',
      '/images/school/kantin/2.jpg',
      '/images/school/kantin/3.jpg',
    ],
    mapX: 75,
    mapY: 48,
    pinNumber: 7,
    hidingSpots: [
      { id: 'k-1', angleIndex: 0, x: 52, y: 72, scale: 0.55, pose: 'crouch', hint: 'Di kolong meja makan' },
      { id: 'k-2', angleIndex: 0, x: 84, y: 53, scale: 0.48, pose: 'peek-left', hint: 'Di balik etalase warung' },
      { id: 'k-3', angleIndex: 0, x: 24, y: 62, scale: 0.45, pose: 'crouch', hint: 'Di sela bangku kiri' },
      { id: 'k-4', angleIndex: 0, x: 34, y: 51, scale: 0.38, pose: 'peek-right', hint: 'Pojokan belakang kantin' },
    ],
  },
]

export const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { name: 'Satpam Bambang', score: 1200 },
  { name: 'Guru BK Ani', score: 950 },
  { name: 'Pak Joko', score: 700 },
]

export const LEADERBOARD_STORAGE_KEY = 'cctv-patrol-leaderboard-v2'

export function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
