// ─── Types ─────────────────────────────────────────────────
export interface WatchFolder {
  id: number
  path: string
  label: string
  extensions: string[]
  active: boolean
  lastReceived?: string
  defaultCategory?: string
  color?: string
}

export interface Photo {
  id: number
  filename: string
  image: string
  thumb: string
  source: string
  timestamp: string
  size: string
  patient?: string
  added: boolean
}

export interface Patient {
  name: string
  chartNo: string
  birth: string
  gender: 'M' | 'F'
}

// ─── Mock Data ─────────────────────────────────────────────
export const CURRENT_PATIENT: Patient = {
  name: '홍길동',
  chartNo: '2024-00123',
  birth: '1985.03.12',
  gender: 'M',
}

export const TODAY_PATIENTS: Patient[] = [
  { name: '홍길동', chartNo: '2024-00123', birth: '1985.03.12', gender: 'M' },
  { name: '김영희', chartNo: '2024-00456', birth: '1992.07.21', gender: 'F' },
  { name: '이철수', chartNo: '2024-00789', birth: '1978.11.05', gender: 'M' },
  { name: '박지민', chartNo: '2024-01234', birth: '2001.04.18', gender: 'F' },
  { name: '최수현', chartNo: '2024-01345', birth: '1995.09.30', gender: 'F' },
]

export const ALL_PATIENTS: Patient[] = [
  ...TODAY_PATIENTS,
  { name: '한미래', chartNo: '2024-02234', birth: '1988.02.14', gender: 'F' },
  { name: '강서윤', chartNo: '2024-03001', birth: '2003.06.08', gender: 'F' },
  { name: '윤도현', chartNo: '2024-03002', birth: '1975.12.25', gender: 'M' },
  { name: '임채원', chartNo: '2024-03003', birth: '1999.01.03', gender: 'F' },
  { name: '정하은', chartNo: '2024-04002', birth: '1990.08.17', gender: 'F' },
]

export const WATCH_FOLDERS: WatchFolder[] = [
  { id: 1, path: 'C:\\Photos\\NikonZ50', label: 'Nikon Z50', extensions: ['jpg', 'raw'], active: true, lastReceived: '2026-04-08 10:09', defaultCategory: '구강사진', color: 'amber' },
  { id: 2, path: 'C:\\Photos\\Canon90D', label: '진료실2 Canon', extensions: ['jpg'], active: true, lastReceived: '2026-04-08 10:20', defaultCategory: '구강사진', color: 'teal' },
  { id: 3, path: 'C:\\Photos\\Intraoral', label: '구강카메라', extensions: ['jpg', 'png'], active: false, defaultCategory: '구강사진', color: 'violet' },
]

export const PHOTOS: Photo[] = [
  // 20분 미만 — 미추가
  { id: 13, filename: '20250315_102855.jpg', image: '/images/20250315_102855.jpg', thumb: '/images/thumb/20250315_102855.jpg', source: '진료실2 Canon', timestamp: '2026-04-08 10:22', size: '1.7MB', added: false },
  { id: 3, filename: '20250315_102039.jpg', image: '/images/20250315_102039.jpg', thumb: '/images/thumb/20250315_102039.jpg', source: '진료실2 Canon', timestamp: '2026-04-08 10:20', size: '243KB', added: false },
  { id: 12, filename: '20250315_102854.jpg', image: '/images/20250315_102854.jpg', thumb: '/images/thumb/20250315_102854.jpg', source: 'Nikon Z50', timestamp: '2026-04-08 10:12', size: '1.8MB', added: false },
  // 20분 이상 — 랜덤 섞임
  { id: 2, filename: '20250315_100952.jpg', image: '/images/20250315_100952.jpg', thumb: '/images/thumb/20250315_100952.jpg', source: 'Nikon Z50', timestamp: '2026-04-08 10:09', size: '564KB', patient: '홍길동', added: true },
  { id: 1, filename: '20250315_100623.jpg', image: '/images/20250315_100623.jpg', thumb: '/images/thumb/20250315_100623.jpg', source: 'Nikon Z50', timestamp: '2026-04-08 10:06', size: '603KB', added: false },
  { id: 4, filename: '20250315_103325.jpg', image: '/images/20250315_103325.jpg', thumb: '/images/thumb/20250315_103325.jpg', source: 'Nikon Z50', timestamp: '2026-04-08 09:20', size: '233KB', patient: '홍길동', added: true },
  { id: 5, filename: '20240525_100209.jpg', image: '/images/20240525_100209.jpg', thumb: '/images/thumb/20240525_100209.jpg', source: 'Nikon Z50', timestamp: '2026-04-08 09:15', size: '603KB', added: false },
  { id: 6, filename: '20240525_100605.jpg', image: '/images/20240525_100605.jpg', thumb: '/images/thumb/20240525_100605.jpg', source: 'Nikon Z50', timestamp: '2026-04-08 09:15', size: '388KB', patient: '홍길동', added: true },
  { id: 7, filename: '20231026_191957.jpg', image: '/images/20231026_191957.jpg', thumb: '/images/thumb/20231026_191957.jpg', source: 'Nikon Z50', timestamp: '2026-04-07 14:20', size: '1.3MB', patient: '김영희', added: true },
  { id: 8, filename: '20231026_191958.jpg', image: '/images/20231026_191958.jpg', thumb: '/images/thumb/20231026_191958.jpg', source: 'Nikon Z50', timestamp: '2026-04-07 14:20', size: '1.4MB', added: false },
  { id: 9, filename: '20231026_191959.jpg', image: '/images/20231026_191959.jpg', thumb: '/images/thumb/20231026_191959.jpg', source: '진료실2 Canon', timestamp: '2026-04-07 14:21', size: '1.4MB', patient: '김영희', added: true },
  { id: 10, filename: '20231102_191619.jpg', image: '/images/20231102_191619.jpg', thumb: '/images/thumb/20231102_191619.jpg', source: '진료실2 Canon', timestamp: '2026-04-06 11:30', size: '1.5MB', patient: '이철수', added: true },
  { id: 11, filename: '20231102_191620.jpg', image: '/images/20231102_191620.jpg', thumb: '/images/thumb/20231102_191620.jpg', source: '진료실2 Canon', timestamp: '2026-04-06 11:30', size: '1.5MB', added: false },
]

// ─── Utilities ─────────────────────────────────────────────
export function formatTimestamp(ts: string): string {
  const d = new Date(ts)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

export function formatDate(ts: string): string {
  const d = new Date(ts)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export function groupByDate(photos: Photo[]): Record<string, Photo[]> {
  const groups: Record<string, Photo[]> = {}
  for (const p of photos) {
    const date = p.timestamp.split(' ')[0]
    if (!groups[date]) groups[date] = []
    groups[date].push(p)
  }
  return groups
}
