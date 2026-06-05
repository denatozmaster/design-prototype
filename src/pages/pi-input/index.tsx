import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import ToothSelector from './tooth-selector'
import SymptomPanel from './symptom-panel'
import BottomRow from './bottom-row'
import { piRecords, emptyPiRecord, type FdiTooth, type PiRecord } from './mock-data'

/** 셋(치식·증상·메모) 다 비었는지 = 폐기 대상 판정 */
export function isEmptyRecord(r: PiRecord): boolean {
  return r.teeth.length === 0 && r.symptoms.length === 0 && !r.memo?.trim()
}

export default function PiInputPage() {
  const idRef = useRef(0)
  const [records, setRecords] = useState<PiRecord[]>(piRecords)
  // draft 존재 ⟺ draft가 활성. draft는 매번 고유 id (메모 에디터 리셋 키로 사용).
  const [draft, setDraft] = useState<PiRecord | null>(() => emptyPiRecord('draft-0'))
  const [activeId, setActiveId] = useState<string>('draft-0')

  const isDraftActive = !!draft && activeId === draft.id

  // 활성 대상: draft 이거나 기존 record.
  const active: PiRecord | null = isDraftActive
    ? draft
    : records.find((r) => r.id === activeId) ?? null

  // 활성 대상 편집 (draft / 기존 record 공통)
  const editActive = (updater: (r: PiRecord) => PiRecord) => {
    if (isDraftActive) setDraft((d) => (d ? updater(d) : d))
    else setRecords((rs) => rs.map((r) => (r.id === activeId ? updater(r) : r)))
  }

  const toggleTooth = (t: FdiTooth) =>
    editActive((r) => ({
      ...r,
      teeth: r.teeth.includes(t)
        ? r.teeth.filter((x) => x !== t)
        : [...r.teeth, t],
    }))

  const toggleSymptom = (sid: string) =>
    editActive((r) => ({
      ...r,
      symptoms: r.symptoms.includes(sid)
        ? r.symptoms.filter((x) => x !== sid)
        : [...r.symptoms, sid],
    }))

  // 메모는 실시간 반영 X — 저장 버튼 클릭 시에만 활성 대상에 커밋.
  const saveMemo = (v: string) => editActive((r) => ({ ...r, memo: v }))

  // 활성 draft 정리: 내용 있으면 리스트 최하단(draft 자리)에 그대로 커밋, 비었으면 폐기.
  const resolveDraft = () => {
    if (draft && !isEmptyRecord(draft)) {
      const committed = draft
      setRecords((rs) => [...rs, committed])
    }
    setDraft(null)
  }

  // row 클릭
  const selectRow = (id: string) => {
    if (id === activeId) return
    // 기존 row로 이동 → 활성 draft 정리 (빈 draft는 사라짐)
    if (isDraftActive) resolveDraft()
    setActiveId(id)
  }

  // + 새 PI: 현재 활성 draft 정리 후, 새 빈 draft 즉시 생성·활성
  const newDraft = () => {
    if (isDraftActive) resolveDraft()
    const d = emptyPiRecord(`draft-${++idRef.current}`)
    setDraft(d)
    setActiveId(d.id)
  }

  // row 삭제
  const deleteRecord = (id: string) => {
    // draft 삭제: 아래가 없으니 바로 위(마지막 record) 활성화. 위도 없으면 새 빈 draft.
    if (draft && id === draft.id) {
      const above = records[records.length - 1]
      if (above) {
        setDraft(null)
        setActiveId(above.id)
      } else {
        const d = emptyPiRecord(`draft-${++idRef.current}`)
        setDraft(d)
        setActiveId(d.id)
      }
      return
    }
    // 기존 record 삭제: 활성 row면 삭제 위치로 당겨 올라온 다음 row 활성화, 없으면 새 빈 draft.
    const i = records.findIndex((r) => r.id === id)
    const next = records.filter((r) => r.id !== id)
    setRecords(next)
    if (id === activeId) {
      const fallback = next[i]
      if (fallback) {
        setActiveId(fallback.id)
      } else {
        const d = emptyPiRecord(`draft-${++idRef.current}`)
        setDraft(d)
        setActiveId(d.id)
      }
    }
  }

  return (
    <div className="min-h-svh bg-neutral-100 flex items-center justify-center gap-6 p-8">
      {/* 1000 x 850 고정 캔버스 — 이 안에 PI 입력 화면을 디자인한다 */}
      <div className="flex w-[1000px] h-[750px] shrink-0 flex-col border border-neutral-300 bg-white overflow-hidden">
        {/* 상단: FDI 치식선택기 (활성 대상 반영/편집) */}
        <ToothSelector selected={active?.teeth ?? []} onToggle={toggleTooth} />

        {/* 체크패널: 증상/소견 버튼 (활성 대상 반영/편집) */}
        <SymptomPanel checked={active?.symptoms ?? []} onToggle={toggleSymptom} />

        {/* 하단: 좌(입력 내역, 활성 draft만 최상단) / 우(메모) */}
        <BottomRow
          draft={draft}
          records={records}
          activeId={activeId}
          onSelect={selectRow}
          onNewDraft={newDraft}
          onDelete={deleteRecord}
          memo={active?.memo ?? ''}
          onMemoChange={saveMemo}
        />
      </div>

      {/* Prototype overlay: back to home */}
      <Link
        to="/"
        className="fixed top-2 left-3 z-50 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/70 text-white text-[11px] hover:bg-black/90 transition-colors backdrop-blur-sm"
      >
        <ArrowLeft className="w-3 h-3" />
        목록으로
      </Link>
    </div>
  )
}
