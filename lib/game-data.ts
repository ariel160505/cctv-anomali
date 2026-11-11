export type HidingSpot = {
  id: string
  x: number // percentage 0-100
  y: number // percentage 0-100
  scale: number // scale factor (0.35 - 0.8)
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
  mapX: number // X coordinate on clean MAP GAME V2.jpg (%)
  mapY: number // Y coordinate on clean MAP GAME V2.jpg (%)
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
    name: 'MESJID AL-HARAMAIN',
    shortName: 'Mesjid Al-Haramain',
    description: 'Ruang ibadah, serambi & area tirai',
    images: [
      '/images/school/masjid/1.jpg',
      '/images/school/masjid/2.jpg',
    ],
    mapX: 24,
    mapY: 56,
    pinNumber: 1,
    hidingSpots: [
      // Grounded on carpet floor or behind pillars
      { id: 'm-1', angleIndex: 0, x: 19, y: 68, scale: 0.65, pose: 'peek-left', hint: 'Di samping pilar kiri' },
      { id: 'm-2', angleIndex: 0, x: 66, y: 44, scale: 0.45, pose: 'crouch', hint: 'Dekat mimbar mihrab' },
      { id: 'm-3', angleIndex: 0, x: 34, y: 91, scale: 0.75, pose: 'peek-behind', hint: 'Di balik tirai pembatas bawah' },
      { id: 'm-4', angleIndex: 0, x: 76, y: 44, scale: 0.4, pose: 'peek-right', hint: 'Di selasar kaca kanan' },
    ],
  },
  {
    id: 'lapangan',
    camera: '02',
    name: 'LAPANGAN OLAHRAGA',
    shortName: 'Lapangan',
    description: 'Lapangan basket, tribun & parkir motor',
    images: [
      '/images/school/lapangan/1.jpg',
      '/images/school/lapangan/2.jpg',
    ],
    mapX: 54,
    mapY: 49,
    pinNumber: 2,
    hidingSpots: [
      // Grounded on pavement between bikes or bleachers
      { id: 'l-1', angleIndex: 0, x: 35, y: 80, scale: 0.48, pose: 'crouch', hint: 'Di antara motor parkir depan' },
      { id: 'l-2', angleIndex: 0, x: 76, y: 40, scale: 0.4, pose: 'crouch', hint: 'Di tangga tribun seberang' },
      { id: 'l-3', angleIndex: 0, x: 57, y: 48, scale: 0.38, pose: 'stand-far', hint: 'Dekat tiang basket tengah' },
      { id: 'l-4', angleIndex: 0, x: 23, y: 52, scale: 0.42, pose: 'peek-left', hint: 'Di balik tiang kawat kiri' },
    ],
  },
  {
    id: 'kebun-smp',
    camera: '03',
    name: 'KEBUN SMP',
    shortName: 'Kebun SMP',
    description: 'Bedengan tanaman & pohon rindang',
    images: [
      '/images/school/kebun-smp/1.jpg',
      '/images/school/kebun-smp/2.jpg',
      '/images/school/kebun-smp/3.jpg',
    ],
    mapX: 64,
    mapY: 22,
    pinNumber: 3,
    hidingSpots: [
      // Grounded on soil/planter boxes
      { id: 'kb-1', angleIndex: 0, x: 40, y: 68, scale: 0.55, pose: 'crouch', hint: 'Jongkok di balik kotak tanah' },
      { id: 'kb-2', angleIndex: 0, x: 73, y: 36, scale: 0.45, pose: 'peek-left', hint: 'Di balik rimbun pohon' },
      { id: 'kb-3', angleIndex: 0, x: 49, y: 36, scale: 0.38, pose: 'peek-behind', hint: 'Di dekat pagar tembok belakang' },
      { id: 'kb-4', angleIndex: 0, x: 33, y: 26, scale: 0.4, pose: 'peek-right', hint: 'Dekat pohon pisang' },
    ],
  },
  {
    id: 'parkiran',
    camera: '04',
    name: 'PARKIRAN KENDARAAN',
    shortName: 'Parkiran',
    description: 'Area kanopi motor & mobil',
    images: [
      '/images/school/parkiran/1.jpg',
      '/images/school/parkiran/2.jpg',
    ],
    mapX: 57,
    mapY: 88,
    pinNumber: 4,
    hidingSpots: [
      // Grounded between motorcycles
      { id: 'p-1', angleIndex: 0, x: 38, y: 68, scale: 0.6, pose: 'crouch', hint: 'Di sela motor tengah' },
      { id: 'p-2', angleIndex: 0, x: 70, y: 62, scale: 0.55, pose: 'peek-left', hint: 'Di balik tiang kanopi parkir' },
      { id: 'p-3', angleIndex: 0, x: 50, y: 52, scale: 0.45, pose: 'stand-far', hint: 'Dekat pintu pos belakang' },
      { id: 'p-4', angleIndex: 0, x: 53, y: 72, scale: 0.65, pose: 'peek-behind', hint: 'Di balik motor matic merah' },
    ],
  },
  {
    id: 'gedung-smk',
    camera: '05',
    name: 'GEDUNG SMK',
    shortName: 'Gedung SMK',
    description: 'Koridor lantai atas & rak sepatu',
    images: [
      '/images/school/gedung-smk/1.jpg',
      '/images/school/gedung-smk/2.jpg',
      '/images/school/gedung-smk/3.jpg',
    ],
    mapX: 70,
    mapY: 68,
    pinNumber: 5,
    hidingSpots: [
      // Realistic grounded positions in the hallway:
      { id: 'smk-1', angleIndex: 0, x: 37, y: 62, scale: 0.65, pose: 'peek-left', hint: 'Mengintip dari balik pilar oranye' },
      { id: 'smk-2', angleIndex: 0, x: 44, y: 76, scale: 0.58, pose: 'crouch', hint: 'Jongkok di samping rak sepatu' },
      { id: 'smk-3', angleIndex: 0, x: 61, y: 56, scale: 0.32, pose: 'stand-far', hint: 'Berdiri di ujung lorong terang' },
      { id: 'smk-4', angleIndex: 0, x: 70, y: 60, scale: 0.6, pose: 'peek-right', hint: 'Di balik dinding kanan' },
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
    mapX: 80,
    mapY: 34,
    pinNumber: 6,
    hidingSpots: [
      { id: 'smp-1', angleIndex: 0, x: 33, y: 52, scale: 0.58, pose: 'peek-behind', hint: 'Di balik tirai jendela koridor' },
      { id: 'smp-2', angleIndex: 0, x: 68, y: 82, scale: 0.65, pose: 'crouch', hint: 'Jongkok di dekat rak sepatu' },
      { id: 'smp-3', angleIndex: 0, x: 84, y: 68, scale: 0.45, pose: 'peek-left', hint: 'Di lorong samping kanan' },
      { id: 'smp-4', angleIndex: 0, x: 48, y: 66, scale: 0.68, pose: 'peek-right', hint: 'Di balik sekat dinding' },
    ],
  },
  {
    id: 'kantin',
    camera: '07',
    name: 'KANTIN SEKOLAH',
    shortName: 'Kantin',
    description: 'Meja panjang, bangku & etalase warung',
    images: [
      '/images/school/kantin/1.jpg',
      '/images/school/kantin/2.jpg',
      '/images/school/kantin/3.jpg',
    ],
    mapX: 72,
    mapY: 50,
    pinNumber: 7,
    hidingSpots: [
      { id: 'k-1', angleIndex: 0, x: 53, y: 76, scale: 0.62, pose: 'crouch', hint: 'Di bawah meja panjang kantin' },
      { id: 'k-2', angleIndex: 0, x: 84, y: 58, scale: 0.52, pose: 'peek-left', hint: 'Di balik etalase warung Tora' },
      { id: 'k-3', angleIndex: 0, x: 23, y: 66, scale: 0.5, pose: 'crouch', hint: 'Di sela bangku meja kiri' },
      { id: 'k-4', angleIndex: 0, x: 35, y: 55, scale: 0.42, pose: 'peek-right', hint: 'Di pojokan belakang kantin' },
    ],
  },
]

export const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { name: 'Satpam Bambang', score: 1200 },
  { name: 'Guru BK Ani', score: 950 },
  { name: 'Pak Joko', score: 700 },
]

export const LEADERBOARD_STORAGE_KEY = 'cctv-patrol-leaderboard-v3'

export function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
