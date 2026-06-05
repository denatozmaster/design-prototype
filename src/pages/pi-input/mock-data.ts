// PI 입력 모듈 전용 데이터 구조 · 가짜 데이터
// 이 파일의 타입/상수는 PI 입력 모듈 안에서만 쓴다.

// ──────────────────────────────────────────────────────────
// FDI 치식
// ──────────────────────────────────────────────────────────
// FDI 표기: 두 자리 숫자. 앞자리 = 사분면, 뒷자리 = 치아 위치.
//   사분면 1~4 = 영구치(상우/상좌/하좌/하우), 5~8 = 유치
//   위치 영구치 1~8, 유치 1~5

/** FDI 치식 번호 (예: 11, 36, 48, 또는 유치 51~85) */
export type FdiTooth = number

/** 화면 배치용 표준 FDI 배열 (clinical-chart 템플릿과 동일 기준) */
export const FDI_LAYOUT = {
  upperPermanent: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
  lowerPermanent: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
  upperDeciduous: [55, 54, 53, 52, 51, 61, 62, 63, 64, 65],
  lowerDeciduous: [85, 84, 83, 82, 81, 71, 72, 73, 74, 75],
} as const

/** 전치부 FDI (중절치~견치). 나머지는 구치부. */
export const ANTERIOR_FDI: FdiTooth[] = [
  13, 12, 11, 21, 22, 23,
  43, 42, 41, 31, 32, 33,
]

// ──────────────────────────────────────────────────────────
// PI 항목 (내역 한 줄 = 하나의 PiRecord)
// ──────────────────────────────────────────────────────────

export interface PiRecord {
  id: string
  /** FDI 치식. 빈 배열이면 특정 치아에 귀속되지 않은 일반 소견(전악/구내). */
  teeth: FdiTooth[]
  /** 선택된 증상/소견 id 목록 (symptoms.ts의 SymptomItem.id 참조) */
  symptoms: string[]
  /** 자유 텍스트: 현병력 본문/메모 (선택). 내역 표시·메모 패널이 공유하는 단일 필드. */
  memo?: string
}

/** 새 PI 항목 골격. 생성 시 사용. id는 호출부에서 채운다. */
export function emptyPiRecord(id: string): PiRecord {
  return { id, teeth: [], symptoms: [], memo: '' }
}

// ──────────────────────────────────────────────────────────
// 가짜 데이터
// ──────────────────────────────────────────────────────────

export const piRecords: PiRecord[] = [
  {
    id: 'pi-1',
    teeth: [36],
    symptoms: ['cold-pos', 'hot-pos', 'per-pos'],
    memo: '수일 전부터 찬물에 시림. 어제 저녁부터 가만히 있어도 욱신거리는 통증 발생, 밤에 더 심함.',
  },
  {
    id: 'pi-2',
    teeth: [16, 17],
    symptoms: ['bite-pos', 'occlusal-caries'],
    memo: '음식 씹을 때 통증. 단단한 것 씹기 어려움.',
  },
  {
    id: 'pi-3',
    teeth: [46],
    symptoms: ['cold-pos', 'filling-state'],
    memo: '2주 전 충전 후 시린 증상 지속. 점점 호전 중이라고 함.',
  },
  {
    id: 'pi-4',
    teeth: [],
    symptoms: ['gingival-swelling-bleeding', 'calculus'],
    memo: '전반적으로 잇몸에서 피가 남. 양치 시 출혈.',
  },
]
