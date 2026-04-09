import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DentalChart from './dental-chart'
import ToothCard from './tooth-card'
import CodePanel from './code-panel'
import type { Surface, ToothState } from './logic'

export default function ResinSurfacePage() {
  const [teeth, setTeeth] = useState<ToothState[]>([])

  const selectedNumbers = teeth.map(t => t.toothNumber)

  function handleToggleTooth(num: number) {
    setTeeth(prev => {
      const exists = prev.find(t => t.toothNumber === num)
      if (exists) return prev.filter(t => t.toothNumber !== num)
      return [...prev, { toothNumber: num, surfaces: [], classOverride: null }]
    })
  }

  function handleRemoveTooth(num: number) {
    setTeeth(prev => prev.filter(t => t.toothNumber !== num))
  }

  function handleToggleSurface(num: number, surface: Surface) {
    setTeeth(prev => prev.map(t => {
      if (t.toothNumber !== num) return t
      const has = t.surfaces.includes(surface)
      const next = has ? t.surfaces.filter(s => s !== surface) : [...t.surfaces, surface]
      // 면 변경 시 오버라이드 해제 → 자동 계산 복귀
      return { ...t, surfaces: next, classOverride: null }
    }))
  }

  function handleClassOverride(num: number, cls: number | null) {
    setTeeth(prev => prev.map(t =>
      t.toothNumber === num ? { ...t, classOverride: cls } : t
    ))
  }

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
          <h1 className="text-sm font-semibold">급여레진 치아면 선택</h1>
        </div>
      </header>

      {/* 본문 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 좌측: 모달 영역 */}
        <div className="flex-1 flex items-center justify-center border-r p-6">
          <div className="w-[960px] h-[680px] flex flex-col rounded-lg border shadow-lg bg-card">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* 치식 */}
              <section>
    <DentalChart selectedTeeth={selectedNumbers} onToggleTooth={handleToggleTooth} />
              </section>

              {/* 면 선택 카드 */}
              <section>
{teeth.length === 0 ? (
                  <p className="text-sm text-muted-foreground">위 치식에서 치아를 클릭하세요</p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {teeth.map(t => (
                      <ToothCard
                        key={t.toothNumber}
                        tooth={t}
                        onToggleSurface={handleToggleSurface}
                        onClassOverride={handleClassOverride}
                        onRemove={handleRemoveTooth}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>
            <div className="shrink-0 border-t px-6 py-4 flex justify-end gap-2">
              <Button variant="outline" className="w-28">이전</Button>
              <Button className="w-28" disabled={teeth.every(t => t.surfaces.length === 0)}>저장</Button>
            </div>
          </div>
        </div>

        {/* 우측: 보험코드 */}
        <div className="w-[360px] shrink-0 overflow-y-auto p-6">
          <CodePanel teeth={teeth} />
        </div>
      </div>
    </div>
  )
}
