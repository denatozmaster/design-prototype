import { useEffect, useRef, useState } from 'react'
import { Plus, Save, Trash2 } from 'lucide-react'
import type { PiRecord } from './mock-data'
import { symptomLabelById } from './symptoms'

/**
 * 메모 에디터 — 실시간 반영 안 함. 로컬 편집 후 저장 버튼으로만 커밋.
 * 활성 대상이 바뀌면 부모가 key(activeId)를 바꿔 remount → 로컬값이 새 value로 리셋된다.
 */
function MemoEditor({ value, onSave }: { value: string; onSave: (v: string) => void }) {
  const [text, setText] = useState(value)
  const dirty = text !== value

  return (
    <div className="flex w-[350px] shrink-0 flex-col">
      <div className="flex items-center justify-between border-b px-3 py-1.5">
        <span className="text-[11px] font-semibold text-neutral-500">메모</span>
        <button
          type="button"
          disabled={!dirty}
          onClick={() => onSave(text)}
          className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium transition-colors ${
            dirty
              ? 'cursor-pointer text-neutral-600 hover:bg-neutral-100'
              : 'cursor-not-allowed text-neutral-300'
          }`}
        >
          <Save className="h-3 w-3" />
          저장
        </button>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        placeholder="자유 메모 입력"
        className="flex-1 resize-none p-3 text-[12px] text-neutral-700 outline-none placeholder:text-neutral-300"
      />
    </div>
  )
}

function RecordRow({
  record,
  active,
  isDraft,
  onClick,
  onDelete,
}: {
  record: PiRecord
  active: boolean
  isDraft?: boolean
  onClick: () => void
  onDelete?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  // 활성화될 때 + 활성 상태에서 치식·증상이 바뀔 때 스크롤 영역 안으로
  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [active, record.teeth, record.symptoms])

  const empty =
    record.teeth.length === 0 && record.symptoms.length === 0 && !record.memo?.trim()
  const text = record.memo

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`group relative flex cursor-pointer items-start border-b border-neutral-100 px-3 py-2 transition-colors ${
        active ? 'bg-blue-50' : 'hover:bg-neutral-50'
      }`}
    >
      {/* 활성 row 표시: 좌측 얇은 액센트 바 (draft·기존 행 공통) */}
      {active && <span className="absolute inset-y-0 left-0 w-1 bg-blue-500" />}

      {/* 좌: 치식 (140px) */}
      <div className="mr-3 flex w-[140px] shrink-0 flex-wrap content-start items-center gap-1">
        {record.teeth.length === 0
          ? !isDraft && <span className="text-[11px] text-neutral-400">—</span>
          : record.teeth.map((t) => (
              <span
                key={t}
                className="rounded bg-blue-50 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-blue-600"
              >
                #{t}
              </span>
            ))}
      </div>

      {/* 우: 데이터 (증상 뱃지 + 메모 텍스트, 자동 줄바꿈) */}
      <div className="min-w-0 flex-1 text-[12px] leading-relaxed text-neutral-700">
        {record.symptoms.map((sid) => (
          <span
            key={sid}
            className="mr-1 inline-block rounded bg-neutral-100 px-1.5 py-0.5 align-middle text-[11px] font-medium text-neutral-600"
          >
            {symptomLabelById[sid] ?? sid}
          </span>
        ))}
        {text && <span className="align-middle break-words">{text}</span>}
        {isDraft && empty && (
          <span className="align-middle text-[12px] font-medium text-blue-500">
            새로운 PI를 입력 중입니다.
          </span>
        )}
      </div>

      {/* 삭제: hover 시 우측에서 미끄러져 들어와 내용 위에 덮임 (내용 칸은 그대로) */}
      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          title="삭제"
          className={`absolute inset-y-0 right-0 z-10 flex w-12 translate-x-4 cursor-pointer items-center justify-center text-neutral-400 opacity-0 transition-all duration-200 hover:bg-rose-50 hover:text-rose-500 group-hover:translate-x-0 group-hover:opacity-100 ${
            active ? 'bg-blue-50' : 'bg-neutral-50'
          }`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export default function BottomRow({
  draft,
  records,
  activeId,
  onSelect,
  onNewDraft,
  onDelete,
  memo,
  onMemoChange,
}: {
  draft: PiRecord | null
  records: PiRecord[]
  activeId: string
  onSelect: (id: string) => void
  onNewDraft: () => void
  onDelete: (id: string) => void
  memo: string
  onMemoChange: (v: string) => void
}) {
  return (
    <div className="flex h-[280px] shrink-0 border-t border-b">
      {/* 좌: 입력 내역 (최상단 draft + 기존 record) */}
      <div className="flex flex-1 flex-col border-r border-neutral-200">
        <div className="flex items-center justify-between border-b px-3 py-1.5">
          <span className="text-[11px] font-semibold text-neutral-500">입력 내역</span>
          <button
            type="button"
            onClick={onNewDraft}
            className="inline-flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-[11px] font-medium text-neutral-600 transition-colors hover:bg-neutral-100"
          >
            <Plus className="h-3 w-3" />
            새 PI 입력
          </button>
        </div>
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          {records.map((r) => (
            <RecordRow
              key={r.id}
              record={r}
              active={activeId === r.id}
              onClick={() => onSelect(r.id)}
              onDelete={() => onDelete(r.id)}
            />
          ))}
          {/* draft는 활성 상태일 때만 가장 아래에 존재 */}
          {draft && (
            <RecordRow
              key={draft.id}
              record={draft}
              isDraft
              active={activeId === draft.id}
              onClick={() => onSelect(draft.id)}
              onDelete={() => onDelete(draft.id)}
            />
          )}
        </div>
      </div>

      {/* 우: 메모 입력 (활성 대상의 메모) — 저장 버튼으로만 커밋, activeId로 리셋 */}
      <MemoEditor key={activeId} value={memo} onSave={onMemoChange} />
    </div>
  )
}
