import type { FdiTooth } from './mock-data'

// 유치 배제 · 사랑니(8번) 배제 · 7~7 배치
// 상악: 17~11 | 21~27   하악: 47~41 | 31~37
const UPPER_ROW: FdiTooth[] = [17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27]
const LOWER_ROW: FdiTooth[] = [47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37]

export default function ToothSelector({
  selected,
  onToggle,
}: {
  selected: FdiTooth[]
  onToggle: (t: FdiTooth) => void
}) {
  const Tooth = ({ t }: { t: FdiTooth }) => {
    const on = selected.includes(t)
    return (
      <button
        type="button"
        onClick={() => onToggle(t)}
        className={`h-10 w-10 cursor-pointer border text-[12px] font-medium tabular-nums transition-colors ${
          on
            ? 'border-blue-500 bg-blue-500 text-white'
            : 'border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-100'
        }`}
      >
        {t}
      </button>
    )
  }

  // 좌(우측 사분면) | 정중선 간격 | 우(좌측 사분면)
  const Row = ({ teeth }: { teeth: FdiTooth[] }) => (
    <div className="flex gap-3">
      <div className="flex gap-1">
        {teeth.slice(0, 7).map((t) => (
          <Tooth key={t} t={t} />
        ))}
      </div>
      <div className="flex gap-1">
        {teeth.slice(7).map((t) => (
          <Tooth key={t} t={t} />
        ))}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col items-center gap-1.5 border-b p-4">
      <Row teeth={UPPER_ROW} />
      <Row teeth={LOWER_ROW} />
    </div>
  )
}
