export type Surface = 'B' | 'M' | 'O' | 'D' | 'L'

export interface ToothState {
  toothNumber: number
  surfaces: Surface[]
}

// 4사분면 (화면 기준)
// 좌상: 상악 우측 18-11, 우상: 상악 좌측 21-28
// 좌하: 하악 우측 48-41, 우하: 하악 좌측 31-38
export const Q1 = [18, 17, 16, 15, 14, 13, 12, 11]
export const Q2 = [21, 22, 23, 24, 25, 26, 27, 28]
export const Q3 = [31, 32, 33, 34, 35, 36, 37, 38]
export const Q4 = [48, 47, 46, 45, 44, 43, 42, 41]

export const UPPER_ROW = [...Q1, ...Q2]
export const LOWER_ROW = [...Q4, ...Q3]
