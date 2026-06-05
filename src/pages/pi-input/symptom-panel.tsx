import { symptomGroups } from './symptoms'

export default function SymptomPanel({
  checked,
  onToggle,
}: {
  checked: string[]
  onToggle: (id: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5 p-4">
      {symptomGroups.map((group) => (
        <div key={group.id} className="flex flex-wrap gap-1">
          {group.items.map((item) => {
            const on = checked.includes(item.id)
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onToggle(item.id)}
                className={`cursor-pointer rounded border px-2.5 py-1.5 text-[13px] font-medium transition-colors ${
                  on
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
