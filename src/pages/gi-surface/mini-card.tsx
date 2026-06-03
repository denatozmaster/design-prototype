import type { Surface, ToothState } from './logic'

interface MiniCardProps {
  tooth: ToothState
  onToggleSurface: (toothNumber: number, surface: Surface) => void
}

export default function MiniCard({ tooth, onToggleSurface }: MiniCardProps) {
  const has = (s: Surface) => tooth.surfaces.includes(s)
  const count = tooth.surfaces.length

  const base = 'flex items-center justify-center text-sm font-mono font-bold transition-colors cursor-pointer select-none'
  const active = 'bg-blue-600 text-white'
  const inactive = 'bg-muted/80 text-muted-foreground hover:bg-accent'

  return (
    <div className="flex flex-col items-center gap-1 border rounded-lg p-2 bg-card">
      <span className="text-sm font-bold text-foreground">{tooth.toothNumber}</span>
      <div className="grid grid-cols-3 grid-rows-3 gap-0.5 w-[108px] h-[108px]">
        <div />
        <button className={`${base} rounded-t-sm ${has('B') ? active : inactive}`} onClick={() => onToggleSurface(tooth.toothNumber, 'B')}>B</button>
        <div />
        <button className={`${base} rounded-l-sm ${has('M') ? active : inactive}`} onClick={() => onToggleSurface(tooth.toothNumber, 'M')}>M</button>
        <button className={`${base} ${has('O') ? active : inactive}`} onClick={() => onToggleSurface(tooth.toothNumber, 'O')}>O</button>
        <button className={`${base} rounded-r-sm ${has('D') ? active : inactive}`} onClick={() => onToggleSurface(tooth.toothNumber, 'D')}>D</button>
        <div />
        <button className={`${base} rounded-b-sm ${has('L') ? active : inactive}`} onClick={() => onToggleSurface(tooth.toothNumber, 'L')}>L</button>
        <div />
      </div>
      {count > 0 && <span className="text-xs text-muted-foreground">{count}면</span>}
    </div>
  )
}
