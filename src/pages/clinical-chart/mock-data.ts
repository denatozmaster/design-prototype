// 전자차트 진료입력 mock data

export interface Patient {
  id: string
  name: string
  chartNo: string
  birth: string
  gender: 'M' | 'F'
  age: number
  isVIP: boolean
}

export interface CheckInItem {
  time: string
  name: string
  chartNo: string
  status: '대기' | '진료중' | '완료' | '수납'
  doctor: string
}

export interface TreatmentLine {
  code?: string
  name: string
  teeth?: string
  qty?: number
  price?: number
  insurance?: boolean
}

export interface ClinicalRecord {
  date: string
  doctor: string
  toothNumbers: string[]
  category: 'treatment' | 'tmj' | 'surgery' | 'prosth' | 'pedo' | 'perio' | 'consult'
  categoryLabel: string
  categoryColor: string
  treatments: TreatmentLine[]
  diagnosis: string
  totalPrice?: number
  memo?: string
  isModified?: boolean
}

export interface TreatmentCategory {
  label: string
  items: string[]
}

export const currentPatient: Patient = {
  id: 'p1',
  name: '차서일',
  chartNo: '41357',
  birth: '1985.03.12',
  gender: 'M',
  age: 41,
  isVIP: true,
}

export const checkInList: CheckInItem[] = [
  { time: '09:00', name: '김민수', chartNo: '41350', status: '완료', doctor: '김민우(41357)' },
  { time: '09:30', name: '이영희', chartNo: '41351', status: '완료', doctor: '김민우(41357)' },
  { time: '10:00', name: '박준호', chartNo: '41352', status: '진료중', doctor: '김민우(41357)' },
  { time: '10:30', name: '최수진', chartNo: '41353', status: '대기', doctor: '김민우(41357)' },
  { time: '11:00', name: '정하늘', chartNo: '41354', status: '대기', doctor: '김민우(41357)' },
  { time: '11:30', name: '한소영', chartNo: '41355', status: '대기', doctor: '김민우(41357)' },
  { time: '13:00', name: '오동현', chartNo: '41356', status: '대기', doctor: '김민우(41357)' },
  { time: '13:30', name: '차서일', chartNo: '41357', status: '대기', doctor: '김민우(41357)' },
]

export const patientDetails = [
  { label: '환진지기', value: '김민우(D (41357) 22/여' },
  { label: '추신', value: '김민우(D (41357) 22/여' },
  { label: '오미현등록', value: '김민우(D (41357) 22/여' },
]

export const clinicalRecords: ClinicalRecord[] = [
  {
    date: '2025.01.15',
    doctor: '김민우',
    toothNumbers: ['#14345', '1,2,3,4,5,6,7,8'],
    category: 'treatment',
    categoryLabel: '수정',
    categoryColor: 'amber',
    isModified: true,
    treatments: [
      { name: '# 41345 setting > 81(초) 치관형 변경 확인', teeth: '#41345' },
    ],
    diagnosis: '[2024-11-07 데이터 투자 사진] 변경된 확인',
    totalPrice: undefined,
    memo: '투자 pricelist map',
  },
  {
    date: '2025.01.15',
    doctor: '김민우',
    toothNumbers: ['#26', '#27'],
    category: 'tmj',
    categoryLabel: 'TMJ 자궁검진·진단',
    categoryColor: 'blue',
    treatments: [
      { code: 'M013', name: '자궁근종제거(혼합잔존)전3)', qty: 1, price: 0, insurance: true },
      { code: 'M021', name: '치주세척(저절제/치조정상면)', qty: 0.5, price: 34810 },
    ],
    diagnosis: 'K02.1 상아질 우식',
    totalPrice: 34810,
  },
  {
    date: '2025.01.08',
    doctor: '김민우',
    toothNumbers: ['#36'],
    category: 'tmj',
    categoryLabel: 'TMJ 자궁검진·처방',
    categoryColor: 'blue',
    treatments: [
      { name: '# 자궁내막(자궁비례포) 내원일:', teeth: '#자궁' },
      { name: '# 추시검부초음 (자일)', teeth: '' },
    ],
    diagnosis: 'K04.0 치수염',
    totalPrice: undefined,
  },
  {
    date: '2025.01.08',
    doctor: '김민우',
    toothNumbers: [],
    category: 'consult',
    categoryLabel: '치료 소계항목',
    categoryColor: 'purple',
    treatments: [
      { name: '# 치료사례탐색비(종합건강검진결과)', qty: 1, price: 64850 },
      { name: '# 처치건수 소계항목', qty: 1 },
      { name: '# 차트(복사) 치시/임검보존비/보스/시스/치 (1100000)', qty: 1, price: 1100000 },
      { name: '# 아환클링 직각대학원정진원', qty: 1 },
    ],
    diagnosis: '',
    totalPrice: 1164850,
  },
  {
    date: '2024.12.20',
    doctor: '김민우',
    toothNumbers: ['#36'],
    category: 'surgery',
    categoryLabel: '',
    categoryColor: 'rose',
    treatments: [
      { code: 'S011', name: '발치(단순)', teeth: '#36', qty: 1, price: 27110 },
      { code: 'S012', name: '발치(복잡)', teeth: '#36', qty: 1, price: 53110 },
      { name: '4023.1, A 3.1, A 4)', qty: 1 },
      { name: '4023.1, A 3.1, A 4)', qty: 1 },
      { name: '4023.1, A 3.1, A 4)', qty: 1 },
    ],
    diagnosis: 'K04.0 치수염',
    totalPrice: 80220,
  },
  {
    date: '2024.12.13',
    doctor: '박지연',
    toothNumbers: ['#46', '#47'],
    category: 'perio',
    categoryLabel: 'LP검을 수치 pick-up imp',
    categoryColor: 'emerald',
    treatments: [
      { name: '# Monel seating', teeth: '#46,47' },
    ],
    diagnosis: 'K05.1 만성 치은염',
    totalPrice: 94100,
  },
]

export const navIcons = [
  { id: 'chart', label: '환자차트' },
  { id: 'desk', label: '데스크' },
  { id: 'schedule', label: '예약' },
  { id: 'treatment', label: '원장실' },
  { id: 'manage', label: '진료' },
  { id: 'lab', label: '기공' },
  { id: 'xray', label: '구강검진' },
  { id: 'endo', label: '영상판독' },
  { id: 'pedo', label: '접수대기' },
  { id: 'ortho', label: '진찰서류' },
  { id: 'perio', label: '진서대장' },
  { id: 'prosth', label: '사진' },
  { id: 'eyefile', label: 'EyeFile' },
  { id: 'xray2', label: 'X-ray' },
]

export const subMenuItems = [
  { group: 'AI', items: ['AI 요약'] },
  { group: '수납', items: ['수납 내역'] },
  { group: '문서', items: ['문서 스캔'] },
  { group: 'PC', items: ['PC 촬영'] },
]

export const recordTabs = [
  '전체', 'CC', 'Next', 'PI', '메모', '커스텀', '기공', '진료', '원사', '사진', 'Tx.Plan',
]

export const entryTabs = [
  'PI 입력', '진료 입력', '처사보험급', '자동차보험', '보관함',
]

export const treatmentMainTabs = [
  '자주하는 진료', '자주쓰는 비급여', '소아', '외과', '통시(임플)', '보철 기타',
  '기타 비급여', '사용 X', '비급여보고레포트', 'Lorem hendrerit', 'Lorem m',
]

export const frequentTreatments: TreatmentCategory[] = [
  {
    label: '보존',
    items: ['전산정보', '충용치료', '치과(진전)', '치약(여치)', '파수방지트', '파스방지트', '교종프로', '상부(프로)', '스캐링', '보존기타', '진료의뢰', '전비의뢰'],
  },
  {
    label: '어처치',
    items: ['아탈', '크라', '그래', '사설', '여비'],
  },
  {
    label: '앤도',
    items: ['발치', 'Sc', '단발치', '다발치', '근관퍼핑', '구매', '근관의뢰', '가교프', '수당초기료', '소통체성', '오랜데', '도지', '수호케어'],
  },
  {
    label: '치근확장',
    items: ['치근활장', 'APF', 'APF+골이식'],
  },
  {
    label: '임피재형',
    items: ['A type', 'A type(1차3)', 'B type 3', 'B type 5', 'B-2 type 5', 'S type'],
  },
  {
    label: '텍스트',
    items: ['Re처방'],
  },
]

export const additionalCategories = [
  { label: '폐기', items: ['폐기대거(레진)', '포스트제거'] },
  { label: '비급여', items: ['비급여', '임플C라이트 screw 조임', '임시합착'] },
  { label: '결과', items: ['계속', '완료', '삭제'] },
]

// FDI tooth numbering (permanent teeth)
export const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28]
export const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]
// Deciduous teeth
export const upperDeciduousTeeth = [55, 54, 53, 52, 51, 61, 62, 63, 64, 65]
export const lowerDeciduousTeeth = [85, 84, 83, 82, 81, 71, 72, 73, 74, 75]

export const subInfoTags = [
  { label: '감상선 호르몬제 복용 / 위장 진행 +2', type: 'warning' as const },
  { label: '본인확인 확인(완)', type: 'success' as const },
]

export const subInfoBreadcrumb = [
  '급여 1/2', '니니 살 3년3개 · 81 3년전', '차세대기 보험SC 1/1',
]

export const subInfoExtra = [
  '급진만 완원', '상급인 원원', 'Pellentesque', 'Ornare', 'Loremfacilisis',
]

export const bottomFormData = {
  진료일: '2025년 01월 23일',
  상병명: '',
  보험: '건강보험',
  진찰료: { type: '초진' as const, options: ['초진', '재진'] },
  진찰료상세: { options: ['검진대상', '장애인', '임신부'] },
  진료의사: { primary: '원장1차', options: ['영상자기...'] },
  기타체크: ['신질특허', '특요대원'],
  결과: '계속',
  출결여부: '-',
  본인부담: '건재 수납',
}

export const footerButtons = [
  '임시클/개발클립',
  'Next 입력',
  '분전모/통사시기/건스형 차트',
  '기공대역사',
  '환미차트형',
]
