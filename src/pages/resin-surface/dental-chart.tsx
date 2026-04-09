import { UPPER_ROW, LOWER_ROW, isAnterior } from './logic'

interface DentalChartProps {
  selectedTeeth: number[]
  onToggleTooth: (toothNumber: number) => void
}

function ToothButton({ num, selected, onClick }: { num: number; selected: boolean; onClick: () => void }) {
  const anterior = isAnterior(num)
  return (
    <button
      onClick={onClick}
      className={`
        w-11 h-11 text-sm font-mono rounded transition-colors
        ${selected
          ? 'bg-primary text-primary-foreground font-bold'
          : anterior
            ? 'bg-muted/60 text-muted-foreground hover:bg-muted'
            : 'bg-muted text-foreground hover:bg-accent'
        }
      `}
    >
      {num}
    </button>
  )
}

export default function DentalChart({ selectedTeeth, onToggleTooth }: DentalChartProps) {
  const selected = new Set(selectedTeeth)

  return (
    <div className="space-y-1">
      {/* Upper */}
      <div className="flex gap-0.5 justify-center">
        {UPPER_ROW.slice(0, 8).map(n => (
          <ToothButton key={n} num={n} selected={selected.has(n)} onClick={() => onToggleTooth(n)} />
        ))}
        <div className="w-px bg-border mx-1" />
        {UPPER_ROW.slice(8).map(n => (
          <ToothButton key={n} num={n} selected={selected.has(n)} onClick={() => onToggleTooth(n)} />
        ))}
      </div>
      {/* Lower */}
      <div className="flex gap-0.5 justify-center">
        {LOWER_ROW.slice(0, 8).map(n => (
          <ToothButton key={n} num={n} selected={selected.has(n)} onClick={() => onToggleTooth(n)} />
        ))}
        <div className="w-px bg-border mx-1" />
        {LOWER_ROW.slice(8).map(n => (
          <ToothButton key={n} num={n} selected={selected.has(n)} onClick={() => onToggleTooth(n)} />
        ))}
      </div>
    </div>
  )
}
