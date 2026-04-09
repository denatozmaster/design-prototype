import { X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ToothState, Surface } from './logic'
import { isAnterior, calcClass, calcSurfaceCount, getEffectiveClass } from './logic'

interface ToothCardProps {
  tooth: ToothState
  onToggleSurface: (toothNumber: number, surface: Surface) => void
  onClassOverride: (toothNumber: number, cls: number | null) => void
  onRemove: (toothNumber: number) => void
}

function SurfaceDiagram({ tooth, onToggle }: { tooth: ToothState; onToggle: (s: Surface) => void }) {
  const has = (s: Surface) => tooth.surfaces.includes(s)
  const anterior = isAnterior(tooth.toothNumber)

  const base = 'flex items-center justify-center font-mono text-base font-bold transition-colors cursor-pointer select-none'
  const active = 'bg-blue-600 text-white'
  const inactive = 'bg-muted text-muted-foreground hover:bg-accent'

  // 십자형 배치: 상B, 좌M, 중O, 우D, 하L
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-1 w-[156px] h-[156px]">
      {/* row 1 */}
      <div />
      <button className={`${base} rounded-t flex-col gap-0 leading-tight ${has('B') ? active : inactive}`} onClick={() => onToggle('B')}>
        <span>B</span><span className="text-xs font-normal opacity-70">협</span>
      </button>
      <div />
      {/* row 2 */}
      <button className={`${base} rounded-l flex-col gap-0 leading-tight ${has('M') ? active : inactive}`} onClick={() => onToggle('M')}>
        <span>M</span><span className="text-xs font-normal opacity-70">근심</span>
      </button>
      <button className={`${base} flex-col gap-0 leading-tight ${has('O') ? active : inactive}`} onClick={() => onToggle('O')}>
        <span>{anterior ? 'I' : 'O'}</span><span className="text-xs font-normal opacity-70">교합</span>
      </button>
      <button className={`${base} rounded-r flex-col gap-0 leading-tight ${has('D') ? active : inactive}`} onClick={() => onToggle('D')}>
        <span>D</span><span className="text-xs font-normal opacity-70">원심</span>
      </button>
      {/* row 3 */}
      <div />
      <button className={`${base} rounded-b flex-col gap-0 leading-tight ${has('L') ? active : inactive}`} onClick={() => onToggle('L')}>
        <span>L</span><span className="text-xs font-normal opacity-70">설</span>
      </button>
      <div />
    </div>
  )
}

export default function ToothCard({ tooth, onToggleSurface, onClassOverride, onRemove }: ToothCardProps) {
  const anterior = isAnterior(tooth.toothNumber)
  const surfaceCount = calcSurfaceCount(tooth.surfaces)
  const autoClass = calcClass(tooth.toothNumber, tooth.surfaces)
  const effectiveClass = getEffectiveClass(tooth)

  return (
    <div className="border rounded-lg p-4 bg-card space-y-3 w-[200px] shrink-0">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold">#{tooth.toothNumber}</span>
        </div>
        <button onClick={() => onRemove(tooth.toothNumber)} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 치아 도식 */}
      <div className="flex justify-center">
        <SurfaceDiagram tooth={tooth} onToggle={(s) => onToggleSurface(tooth.toothNumber, s)} />
      </div>

      {/* 면수 · 급수 */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground font-medium">{surfaceCount > 0 ? `${surfaceCount}면` : ''}</span>
        {surfaceCount > 0 ? (
          <Select
            value={effectiveClass?.toString() ?? ''}
            onValueChange={(v) => {
              if (!v) return
              const num = parseInt(v)
              onClassOverride(tooth.toothNumber, num === autoClass ? null : num)
            }}
          >
            <SelectTrigger size="sm" className="h-6 text-xs w-[72px]">
              <SelectValue>{effectiveClass}급</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {[1,2,3,4,5,6].map(c => (
                <SelectItem key={c} value={c.toString()}>
                  {c}급{c === autoClass ? ' (자동)' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span />
        )}
      </div>
    </div>
  )
}
