export type Surface = 'B' | 'M' | 'O' | 'D' | 'L'

export interface ToothState {
  toothNumber: number
  surfaces: Surface[]
  classOverride: number | null // null = auto, 1~6 = manual
}

// 전치부: 중절치~견치
const ANTERIOR = new Set([11,12,13, 21,22,23, 31,32,33, 41,42,43])

export function isAnterior(toothNumber: number): boolean {
  return ANTERIOR.has(toothNumber)
}

export function calcSurfaceCount(surfaces: Surface[]): number {
  return surfaces.length
}

export function calcClass(toothNumber: number, surfaces: Surface[]): number | null {
  if (surfaces.length === 0) return null

  const has = (s: Surface) => surfaces.includes(s)
  const hasM = has('M')
  const hasD = has('D')
  const hasO = has('O')

  if (isAnterior(toothNumber)) {
    // 전치부
    if (!hasM && !hasD && !hasO) return 1  // B 또는 L만
    if ((hasM || hasD) && !hasO) return 3
    if ((hasM || hasD) && hasO) return 4
    // O만 선택 등 나머지
    return 1
  } else {
    // 구치부
    if (hasM || hasD) return 2
    return 1
  }
}

export function getEffectiveClass(tooth: ToothState): number | null {
  if (tooth.surfaces.length === 0) return null
  return tooth.classOverride ?? calcClass(tooth.toothNumber, tooth.surfaces)
}

export function getInsuranceCode(surfaceCount: number): { code: string; name: string } | null {
  if (surfaceCount === 0) return null
  if (surfaceCount === 1) return { code: 'U0239', name: '광중합형 복합레진 충전-1면' }
  if (surfaceCount === 2) return { code: 'U0240', name: '광중합형 복합레진 충전-2면' }
  return { code: 'U0241', name: '광중합형 복합레진 충전-3면이상' }
}

// 치식 배열: FDI 기준
export const UPPER_ROW = [18,17,16,15,14,13,12,11, 21,22,23,24,25,26,27,28]
export const LOWER_ROW = [48,47,46,45,44,43,42,41, 31,32,33,34,35,36,37,38]
