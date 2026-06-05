// PI 입력 - 체크패널 증상/소견 데이터
// 출처: "개선 구안" 이미지의 체크패널. 원본은 배경색으로 묶여 있어, 색상 = 그룹 축이다.
//
// 추후 고도화 방향 (지금은 라벨 나열까지만):
//  - 검사 항목의 결과 극성/수치 분리 — Per(+)/(-), EPT 값, Mob 1~3 동요도 degree
//  - 우식의 치아면(교합/인접/협/설/치근)·보철 종류를 치식과 연계
//  - "정상소견" 같은 배타 선택 처리
//  - 체크 결과를 PiRecord(치식·PI 본문)로 옮기는 흐름  → [mock-data] 참고

/** 원본 체크패널 배경색 분류. 실제 팔레트(색조/명도)는 디자이너 결정. */
export type SymptomTone =
  | 'pink' // 분홍
  | 'purple' // 보라
  | 'fuchsia' // 자주
  | 'lime' // 연두
  | 'rose' // 연분홍
  | 'neutral' // 회색
  | 'orange' // 살구/연보라 (원본 색 혼재)

export interface SymptomItem {
  id: string
  label: string
}

export interface SymptomGroup {
  id: string
  name: string
  tone: SymptomTone
  items: SymptomItem[]
}

export const symptomGroups: SymptomGroup[] = [
  {
    id: 'exam',
    name: '임상 검사 및 증상',
    tone: 'pink',
    items: [
      { id: 'per-pos', label: 'Per(+)' },
      { id: 'air-pos', label: 'Air(+)' },
      { id: 'bite-pos', label: 'Bite(+)' },
      { id: 'cold-pos', label: 'Cold(+)' },
      { id: 'hot-pos', label: 'Hot(+)' },
      { id: 'ept-neg', label: 'EPT(-)' },
      { id: 'discolor-pos', label: '변색(+)' },
      { id: 'bite-neg', label: 'Bite(-)' },
      { id: 'air-neg', label: 'Air(-)' },
    ],
  },
  {
    id: 'caries',
    name: '치아 우식 및 보철 상태',
    tone: 'purple',
    items: [
      { id: 'occlusal-caries', label: '교합면 우식' },
      { id: 'proximal-caries', label: '인접면 우식' },
      { id: 'buccal-caries', label: '협면 우식' },
      { id: 'lingual-caries', label: '설면 우식' },
      { id: 'root-caries', label: '치근 우식' },
      { id: 'secondary-caries', label: '이차 우식' },
      { id: 'restoration-defect', label: '충전물/보철물 불량' },
      { id: 'crown', label: '크라운' },
      { id: 'implant', label: '임플란트' },
      { id: 'inlay', label: '인레이' },
      { id: 'filling-state', label: '충전상태' },
    ],
  },
  {
    id: 'damage',
    name: '치아 손상 및 치주 질환',
    tone: 'fuchsia',
    items: [
      { id: 'cervical-abfraction', label: '치경부 마모/굴곡 파절' },
      { id: 'tooth-loss', label: '치아상실/결손' },
      { id: 'tooth-crack', label: 'Tooth Crack' },
      { id: 'tooth-fracture', label: '치아 파절' },
      { id: 'periapical-lesion', label: '치근단 병소' },
      { id: 'residual-root', label: '잔존 치근' },
    ],
  },
  {
    id: 'infection',
    name: '화농성 감염 상태',
    tone: 'lime',
    items: [
      { id: 'pus', label: 'Pus 나옴' },
      { id: 'fistula', label: '누공 존재' },
      { id: 'cellulitis', label: 'Cellulitis' },
    ],
  },
  {
    id: 'perio',
    name: '치주 상태 및 치아 동요도',
    tone: 'rose',
    items: [
      { id: 'calculus', label: '치은 연상/연하 치석' },
      { id: 'gingival-swelling-bleeding', label: '치은 부종/출혈' },
      { id: 'traumatic-occlusion', label: '외상성 교합' },
      { id: 'mob-1', label: 'Mob(1)' },
      { id: 'mob-2', label: 'Mob(2)' },
      { id: 'mob-3', label: 'Mob(3)' },
    ],
  },
  {
    id: 'anomaly',
    name: '치아 발육 및 형태 이상',
    tone: 'neutral',
    items: [
      { id: 'attrition', label: '교모' },
      { id: 'supraeruption', label: '정출' },
      { id: 'dens-in-dente', label: '치내치' },
      { id: 'dens-evaginatus', label: '치외치' },
      { id: 'supernumerary', label: '과잉치' },
      { id: 'impacted', label: '매복치' },
      { id: 'external-resorption', label: '외흡수' },
      { id: 'internal-resorption', label: '내흡수' },
      { id: 'non-eruption', label: '미맹출' },
    ],
  },
  {
    id: 'habit',
    name: '구강 악습관 및 기타 소견',
    tone: 'orange',
    items: [
      { id: 'nail-biting', label: '손톱 깨물기' },
      { id: 'finger-sucking', label: '손가락 빨기' },
      { id: 'clenching', label: '이악물기' },
      { id: 'unilateral-chewing', label: '편측 저작' },
      { id: 'bruxism', label: '이갈이' },
      { id: 'normal', label: '정상소견' },
    ],
  },
]

/** 증상 id → 라벨 빠른 조회 */
export const symptomLabelById: Record<string, string> = Object.fromEntries(
  symptomGroups.flatMap((g) => g.items.map((it) => [it.id, it.label])),
)
