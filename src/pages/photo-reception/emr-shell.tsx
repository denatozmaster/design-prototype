import { type Patient } from './mock-data'
import {
  FileText,
  Stethoscope,
  Pill,
  ImageIcon,
  CreditCard,
  Wifi,
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'chart', icon: FileText, label: '차트' },
  { id: 'treat', icon: Stethoscope, label: '진료' },
  { id: 'rx', icon: Pill, label: '처방' },
  { id: 'image', icon: ImageIcon, label: '영상' },
  { id: 'billing', icon: CreditCard, label: '수납' },
]

export default function EmrShell({
  patient,
  badgeCount = 0,
  onWirelessClick,
  children,
}: {
  patient: Patient
  badgeCount?: number
  onWirelessClick?: () => void
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-full bg-white text-neutral-700">
      {/* Unified top bar: patient + nav */}
      <div className="flex items-center h-14 px-4 bg-neutral-50 border-b border-neutral-200 shrink-0">
        {/* Left: patient info */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm font-bold text-neutral-900">{patient.name}</span>
          <span className="text-xs text-neutral-500">{patient.chartNo}</span>
          <span className="text-[11px] text-neutral-400">{patient.birth} · {patient.gender === 'M' ? '남' : '여'}</span>
        </div>

        {/* Center: nav icons */}
        <nav className="flex items-center gap-1 mx-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-md text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors cursor-default"
            >
              <item.icon className="w-7 h-7" />
              <span className="text-[11px]">{item.label}</span>
            </button>
          ))}

          {/* Wireless transfer icon */}
          <button
            onClick={onWirelessClick}
            className={`relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-md transition-colors ${
              badgeCount > 0
                ? 'text-blue-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer'
                : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 cursor-default'
            }`}
          >
            <Wifi className="w-7 h-7" />
            <span className="text-[11px]">무선전송</span>
            {badgeCount > 0 && (
              <span className="absolute top-0 right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
                {badgeCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right: date */}
        <span className="text-[11px] text-neutral-400 shrink-0">2026-04-08 화</span>
      </div>

      {/* Content area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Fake chart content (background) */}
        <div className="absolute inset-0 p-4 opacity-20 pointer-events-none select-none">
          <div className="grid grid-cols-2 gap-3 h-full">
            <div className="rounded-lg bg-neutral-100 p-3">
              <div className="text-[10px] text-neutral-400 font-medium mb-2">진료기록</div>
              <div className="space-y-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-2.5 bg-neutral-200 rounded" style={{ width: `${60 + Math.random() * 35}%` }} />
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-neutral-100 p-3">
              <div className="text-[10px] text-neutral-400 font-medium mb-2">치식</div>
              <div className="flex gap-1 flex-wrap">
                {Array.from({ length: 16 }, (_, i) => (
                  <div key={i} className="w-5 h-6 rounded bg-neutral-200 text-[8px] flex items-center justify-center text-neutral-400">
                    {i + 11}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Overlay content */}
        {children}
      </div>
    </div>
  )
}
