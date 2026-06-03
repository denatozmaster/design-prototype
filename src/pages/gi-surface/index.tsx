import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MiniCard from './mini-card'
import type { Surface, ToothState } from './logic'
import { UPPER_ROW, LOWER_ROW } from './logic'

export default function GiSurfacePage() {
  const [teeth, setTeeth] = useState<Map<number, ToothState>>(new Map())

  const selected = new Set(teeth.keys())

  function handleToggleTooth(num: number) {
    setTeeth(prev => {
      const next = new Map(prev)
      if (next.has(num)) {
        next.delete(num)
      } else {
        next.set(num, { toothNumber: num, surfaces: [] })
      }
      return next
    })
  }

  function handleToggleSurface(num: number, surface: Surface) {
    setTeeth(prev => {
      const next = new Map(prev)
      const tooth = next.get(num)
      if (!tooth) return prev
      const has = tooth.surfaces.includes(surface)
      const surfaces = has ? tooth.surfaces.filter(s => s !== surface) : [...tooth.surfaces, surface]
      next.set(num, { ...tooth, surfaces })
      return next
    })
  }

  function renderRow(row: number[]) {
    const active = row.filter(num => teeth.has(num))
    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {active.map(num => (
          <MiniCard key={num} tooth={teeth.get(num)!} onToggleSurface={handleToggleSurface} />
        ))}
      </div>
    )
  }

  function renderChartRow(row: number[]) {
    return (
      <div className="flex gap-0.5 justify-center">
        {row.slice(0, 8).map(n => (
          <button
            key={n}
            onClick={() => handleToggleTooth(n)}
            className={`w-8 h-8 text-[11px] font-mono rounded transition-colors ${
              selected.has(n)
                ? 'bg-primary text-primary-foreground font-bold'
                : 'bg-muted text-foreground hover:bg-accent'
            }`}
          >
            {n}
          </button>
        ))}
        <div className="w-px bg-border mx-0.5" />
        {row.slice(8).map(n => (
          <button
            key={n}
            onClick={() => handleToggleTooth(n)}
            className={`w-8 h-8 text-[11px] font-mono rounded transition-colors ${
              selected.has(n)
                ? 'bg-primary text-primary-foreground font-bold'
                : 'bg-muted text-foreground hover:bg-accent'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    )
  }

  const hasAnySurface = Array.from(teeth.values()).some(t => t.surfaces.length > 0)

  return (
    <div className="flex flex-col h-svh bg-background overflow-hidden">
      {/* 헤더 */}
      <header className="flex items-center justify-between border-b px-6 h-12 shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            목록
          </Link>
          <span className="text-border">/</span>
          <h1 className="text-sm font-semibold">GI 치면 입력</h1>
        </div>
      </header>

      {/* 본문: 수직 3단 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 1단: 상악 (18~11, 21~28 순서) */}
        <div className="flex-1 flex items-end justify-center px-6 pt-4">
          {renderRow(UPPER_ROW)}
        </div>

        {/* 2단: 치식 선택기 */}
        <div className="shrink-0 px-6 py-3 space-y-1">
          {renderChartRow(UPPER_ROW)}
          {renderChartRow(LOWER_ROW)}
        </div>

        {/* 3단: 하악 (48~41, 31~38 순서) */}
        <div className="flex-1 flex items-start justify-center px-6 pb-4">
          {renderRow(LOWER_ROW)}
        </div>

        {/* 하단 버튼 */}
        <div className="shrink-0 border-t px-6 py-4 flex justify-end gap-2">
          <Button variant="outline" className="w-28">이전</Button>
          <Button className="w-28" disabled={!hasAnySurface}>저장</Button>
        </div>
      </div>
    </div>
  )
}
