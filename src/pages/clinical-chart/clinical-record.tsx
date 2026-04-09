import { useState } from 'react'
import { Search, ChevronDown, ToggleLeft, ToggleRight } from 'lucide-react'
import { recordTabs, clinicalRecords, type ClinicalRecord } from './mock-data'

const CATEGORY_COLORS: Record<string, { border: string; bg: string; text: string }> = {
  amber:   { border: 'border-l-amber-400',   bg: 'bg-amber-50',   text: 'text-amber-700' },
  blue:    { border: 'border-l-blue-400',     bg: 'bg-blue-50',    text: 'text-blue-700' },
  purple:  { border: 'border-l-purple-400',   bg: 'bg-purple-50',  text: 'text-purple-700' },
  rose:    { border: 'border-l-rose-400',     bg: 'bg-rose-50',    text: 'text-rose-700' },
  emerald: { border: 'border-l-emerald-400',  bg: 'bg-emerald-50', text: 'text-emerald-700' },
}

function RecordItem({ record, isFirst }: { record: ClinicalRecord; isFirst: boolean }) {
  const colors = CATEGORY_COLORS[record.categoryColor] || CATEGORY_COLORS.blue

  return (
    <div
      className={`border-l-[3px] ${colors.border} ${
        isFirst ? 'bg-blue-50/30' : 'hover:bg-neutral-50'
      } transition-colors`}
    >
      {/* Record header */}
      <div className="flex items-center gap-2 px-3 py-2">
        {/* Category badge */}
        {record.categoryLabel && (
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${colors.bg} ${colors.text}`}>
            {record.isModified && '🔸 '}{record.categoryLabel}
          </span>
        )}

        {/* Date + Doctor */}
        <span className="text-[11px] font-semibold text-neutral-800">{record.date}</span>
        <span className="text-[10px] text-neutral-400">{record.doctor}</span>

        {/* Price */}
        {record.totalPrice !== undefined && (
          <span className="ml-auto text-[11px] font-mono text-neutral-600 tabular-nums">
            {record.totalPrice.toLocaleString()}
          </span>
        )}
      </div>

      {/* Treatment details (always visible) */}
      <div className="pl-5 pr-3 pb-2 space-y-0.5">
        {/* Tooth numbers */}
        {record.toothNumbers.length > 0 && (
          <div className="flex items-center gap-1 mb-1">
            {record.toothNumbers.map((t, i) => (
              <span
                key={i}
                className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Treatment lines */}
        {record.treatments.map((tx, i) => (
          <div key={i} className="flex items-center justify-between text-[11px] py-0.5">
            <div className="flex items-center gap-1.5 min-w-0">
              {tx.code && (
                <span className="text-neutral-400 font-mono text-[10px] shrink-0">{tx.code}</span>
              )}
              <span className="text-neutral-600 truncate">{tx.name}</span>
              {tx.qty !== undefined && (
                <span className="text-neutral-400 shrink-0">{tx.qty}</span>
              )}
            </div>
            {tx.price !== undefined && (
              <span className="text-neutral-500 font-mono tabular-nums shrink-0 ml-2">
                {tx.price.toLocaleString()}
              </span>
            )}
          </div>
        ))}

        {/* Diagnosis */}
        {record.diagnosis && (
          <p className="text-[10px] text-neutral-400 mt-1">{record.diagnosis}</p>
        )}
      </div>
    </div>
  )
}

export default function ClinicalRecord() {
  const [activeTab, setActiveTab] = useState('전체')
  const [showCollect, setShowCollect] = useState(true)

  return (
    <div className="flex flex-col h-full border-r bg-white">
      {/* Header: Tabs + toggle */}
      <div className="flex items-center justify-between h-[46px] px-3 border-b shrink-0">
        <div className="flex items-center gap-0.5 overflow-x-auto">
          {recordTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 py-1.5 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 ml-2 shrink-0">
          <span className="text-[11px] text-neutral-500">수거</span>
          <button
            onClick={() => setShowCollect(!showCollect)}
            className={showCollect ? 'text-blue-500' : 'text-neutral-300'}
          >
            {showCollect ? (
              <ToggleRight className="w-7 h-4" />
            ) : (
              <ToggleLeft className="w-7 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center justify-between h-10 px-3 border-b shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center h-6 px-2 bg-neutral-50 rounded-md border text-[11px] text-neutral-500 gap-1">
            <Search className="w-3 h-3" />
            <span>Q 검색</span>
          </div>
          <button className="flex items-center h-6 px-2 bg-neutral-50 rounded-md border text-[11px] text-neutral-500 gap-1">
            전체 기간
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-neutral-400">
          <span>스캔(복) 0</span>
        </div>
      </div>

      {/* Record List */}
      <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
        {clinicalRecords.map((record, i) => (
          <RecordItem key={i} record={record} isFirst={i === 0} />
        ))}
      </div>
    </div>
  )
}
