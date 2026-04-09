import type { ToothState } from './logic'
import { calcSurfaceCount, getInsuranceCode, getEffectiveClass } from './logic'

interface CodePanelProps {
  teeth: ToothState[]
}

const ALL_CODES = [
  { code: 'U0239', name: '광중합형 복합레진 충전-1면' },
  { code: 'U0240', name: '광중합형 복합레진 충전-2면' },
  { code: 'U0241', name: '광중합형 복합레진 충전-3면이상' },
]

export default function CodePanel({ teeth }: CodePanelProps) {
  const activeTeeth = teeth.filter(t => t.surfaces.length > 0)

  // 코드별 합산
  const summary = new Map<string, number>()
  for (const t of activeTeeth) {
    const ins = getInsuranceCode(calcSurfaceCount(t.surfaces))
    if (ins) summary.set(ins.code, (summary.get(ins.code) ?? 0) + 1)
  }

  return (
    <div className="space-y-6">
      {/* 치아별 코드 매핑 */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">치아별 적용 코드</h3>
        {activeTeeth.length === 0 ? (
          <p className="text-sm text-muted-foreground">치아를 선택하고 면을 지정하세요</p>
        ) : (
          <div className="space-y-2">
            {activeTeeth.map(t => {
              const count = calcSurfaceCount(t.surfaces)
              const ins = getInsuranceCode(count)
              const cls = getEffectiveClass(t)
              return (
                <div key={t.toothNumber} className="flex items-center justify-between py-1.5 px-3 rounded-md bg-muted/50 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">#{t.toothNumber}</span>
                    <span className="text-muted-foreground">
                      {t.surfaces.join('+')} · {count}면 · {cls}급
                    </span>
                  </div>
                  {ins && (
                    <span className="font-mono text-xs font-semibold text-primary">{ins.code}</span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 코드 요약 */}
      {activeTeeth.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">보험코드 요약</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-3 py-2 font-medium">코드</th>
                  <th className="text-left px-3 py-2 font-medium">명칭</th>
                  <th className="text-right px-3 py-2 font-medium">횟수</th>
                </tr>
              </thead>
              <tbody>
                {ALL_CODES.map(({ code, name }) => {
                  const count = summary.get(code) ?? 0
                  if (count === 0) return null
                  return (
                    <tr key={code} className="border-b last:border-0">
                      <td className="px-3 py-2 font-mono font-semibold">{code}</td>
                      <td className="px-3 py-2 text-muted-foreground">{name}</td>
                      <td className="px-3 py-2 text-right font-bold">{count}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
