// ─── Constants ─────────────────────────────────────────────
export const TODAY = '2026-04-05'
export const OPEN_DATE = '2020-03-01' // 개원시작일

// ─── Types ─────────────────────────────────────────────────
export type SignStatus = 'unsigned' | 'mismatch' | 'signed'

export interface Doctor {
  id: number
  name: string
  lastSignDate: string
  unsignedCount: number
}

export interface ChartRecord {
  id: number
  patient: string
  chartNo: string
  dates: string[]
  status: SignStatus
}

export interface DailyRecord {
  id: number
  date: string
  status: SignStatus
}

export interface SignHistoryRecord {
  id: number
  date: string
  signer: string
  count: number
  docType: string
  note?: string
}

// ─── Mock Data ─────────────────────────────────────────────
export const DOCTORS: Doctor[] = [
  { id: 1, name: '김민수', lastSignDate: '2026-02-28', unsignedCount: 342 },
  { id: 2, name: '이지현', lastSignDate: '2026-03-15', unsignedCount: 128 },
  { id: 3, name: '박준혁', lastSignDate: '2026-04-01', unsignedCount: 24 },
]

export const ALL_CHART_RECORDS: Record<string, ChartRecord[]> = {
  '홍원장': [
    { id: 1, patient: '홍길동', chartNo: '2024-00123', dates: ['2026-03-28', '2026-04-01', '2026-04-03'], status: 'unsigned' },
    { id: 2, patient: '김영희', chartNo: '2024-00456', dates: ['2026-04-02'], status: 'unsigned' },
    { id: 3, patient: '이철수', chartNo: '2024-00789', dates: ['2026-03-30', '2026-04-01'], status: 'mismatch' },
    { id: 4, patient: '최수현', chartNo: '2024-01345', dates: ['2026-03-25', '2026-03-28'], status: 'signed' },
    { id: 5, patient: '한미래', chartNo: '2024-02234', dates: ['2026-04-02', '2026-04-03'], status: 'unsigned' },
  ],
  '김민수': [
    { id: 101, patient: '강서윤', chartNo: '2024-03001', dates: ['2026-03-10', '2026-03-12'], status: 'unsigned' },
    { id: 102, patient: '윤도현', chartNo: '2024-03002', dates: ['2026-03-15'], status: 'unsigned' },
    { id: 103, patient: '임채원', chartNo: '2024-03003', dates: ['2026-03-01', '2026-03-05', '2026-03-08'], status: 'unsigned' },
  ],
  '이지현': [
    { id: 201, patient: '박지민', chartNo: '2024-04001', dates: ['2026-03-20', '2026-03-22'], status: 'unsigned' },
    { id: 202, patient: '정하은', chartNo: '2024-04002', dates: ['2026-04-01', '2026-04-03'], status: 'signed' },
  ],
}

export const DAILY_RECORDS_RECEIPT: DailyRecord[] = [
  { id: 1, date: '2026-04-03', status: 'unsigned' },
  { id: 2, date: '2026-04-02', status: 'unsigned' },
  { id: 3, date: '2026-04-01', status: 'mismatch' },
  { id: 4, date: '2026-03-31', status: 'signed' },
  { id: 5, date: '2026-03-30', status: 'signed' },
  { id: 6, date: '2026-03-29', status: 'unsigned' },
  { id: 7, date: '2026-03-28', status: 'signed' },
]

export const DAILY_RECORDS_XRAY: DailyRecord[] = [
  { id: 1, date: '2026-04-03', status: 'unsigned' },
  { id: 2, date: '2026-04-02', status: 'signed' },
  { id: 3, date: '2026-04-01', status: 'unsigned' },
  { id: 4, date: '2026-03-31', status: 'signed' },
  { id: 5, date: '2026-03-30', status: 'signed' },
  { id: 6, date: '2026-03-29', status: 'mismatch' },
  { id: 7, date: '2026-03-28', status: 'signed' },
]

export const SIGN_HISTORY: SignHistoryRecord[] = [
  { id: 1, date: '2026-04-01 09:32', signer: '홍원장', count: 156, docType: '진료기록부' },
  { id: 2, date: '2026-04-01 09:33', signer: '홍원장', count: 1, docType: '수납대장' },
  { id: 3, date: '2026-04-01 09:33', signer: '홍원장', count: 1, docType: '방사선대장' },
  { id: 4, date: '2026-03-15 14:20', signer: '홍원장', count: 89, docType: '진료기록부', note: '장기 휴직' },
  { id: 5, date: '2026-03-01 10:15', signer: '홍원장', count: 420, docType: '진료기록부' },
  { id: 6, date: '2026-03-01 10:16', signer: '홍원장', count: 28, docType: '수납대장' },
  { id: 7, date: '2026-02-01 11:00', signer: '이지현', count: 210, docType: '진료기록부' },
]

// ─── Utilities ─────────────────────────────────────────────
export function getDaysAgo(dateStr: string): number {
  return Math.floor(
    (new Date(TODAY).getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24),
  )
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export function subtractDays(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() - days)
  return d.toISOString().split('T')[0]
}

export function formatDateRange(dates: string[]): string {
  if (!dates || dates.length === 0) return ''
  const sorted = [...dates].sort()
  if (sorted.length === 1) return formatDate(sorted[0])
  return `${formatDate(sorted[0])} ~ ${formatDate(sorted[sorted.length - 1])}`
}

export function getQuickRanges() {
  const today = new Date(TODAY)
  const d3From = subtractDays(TODAY, 2)

  const dayOfWeek = today.getDay() || 7
  const lastMonEnd = new Date(today)
  lastMonEnd.setDate(today.getDate() - dayOfWeek)
  const lastMonStart = new Date(lastMonEnd)
  lastMonStart.setDate(lastMonEnd.getDate() - 6)
  const lwFrom = lastMonStart.toISOString().split('T')[0]
  const lwTo = lastMonEnd.toISOString().split('T')[0]

  const lmEnd = new Date(today.getFullYear(), today.getMonth(), 0)
  const lmStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  const lmFrom = lmStart.toISOString().split('T')[0]
  const lmTo = lmEnd.toISOString().split('T')[0]

  const tmStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const tmFrom = tmStart.toISOString().split('T')[0]
  const tmTo = TODAY

  return [
    { label: '최근 3일', from: d3From, to: TODAY },
    { label: '지난주', from: lwFrom, to: lwTo },
    { label: '지난달', from: lmFrom, to: lmTo },
    { label: '이번달', from: tmFrom, to: tmTo },
    { label: '전체', from: OPEN_DATE, to: TODAY },
  ]
}
