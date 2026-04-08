import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Check,
  ChevronDown,
  ChevronLeft,
  Search,
  User,
  RotateCw,
  Crop,
  FlipHorizontal,
  Sun,
  Contrast,
  Palette,
  Trash2,
  FlipVertical,
} from 'lucide-react'
import EmrShell from './emr-shell'
import { CURRENT_PATIENT, PHOTOS, TODAY_PATIENTS, ALL_PATIENTS, formatTimestamp, type Patient } from './mock-data'

const ALL_PHOTOS = [...PHOTOS].sort((a, b) => b.timestamp.localeCompare(a.timestamp))
const PENDING_COUNT = PHOTOS.filter((p) => !p.added).length

function humanizeTime(ts: string): string {
  const now = new Date('2026-04-08T10:30:00')
  const then = new Date(ts)
  const diffMin = Math.floor((now.getTime() - then.getTime()) / 60000)
  if (diffMin < 1) return '방금 전'
  if (diffMin < 60) return `${diffMin}분 전`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH}시간 전`
  return `${Math.floor(diffH / 24)}일 전`
}

const SOURCE_COLORS: Record<string, string> = {
  'Nikon Z50': 'bg-amber-500',
  '진료실2 Canon': 'bg-teal-500',
  '구강카메라': 'bg-violet-500',
}

const EDIT_TOOLS = [
  { icon: RotateCw, label: '회전' },
  { icon: Crop, label: '크롭' },
  { icon: FlipHorizontal, label: '좌우반전' },
  { icon: FlipVertical, label: '상하반전' },
  { icon: Sun, label: '밝기' },
  { icon: Contrast, label: '대비' },
  { icon: Palette, label: '색조' },
]

export default function ReceptionFlow() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [previewIdx, setPreviewIdx] = useState(0)
  const [targetPatient, setTargetPatient] = useState<Patient>(CURRENT_PATIENT)
  const [patientPickerOpen, setPatientPickerOpen] = useState(false)
  const [patientSearch, setPatientSearch] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastCount, setToastCount] = useState(0)

  const handleWirelessClick = () => {
    setModalOpen(true)
    setShowToast(false)
  }

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleAdd = () => {
    setToastCount(selectedIds.size)
    setModalOpen(false)
    setSelectedIds(new Set())
    setShowToast(true)
  }

  const previewPhoto = ALL_PHOTOS[previewIdx]

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <EmrShell
          patient={CURRENT_PATIENT}
          badgeCount={PENDING_COUNT}
          onWirelessClick={handleWirelessClick}
        >
          {/* Image viewer modal */}
          {modalOpen && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 animate-in fade-in duration-200">
              <div className="bg-white rounded-xl shadow-2xl w-[92%] max-w-[1040px] h-[90%] max-h-[800px] flex flex-col overflow-hidden">
                <div className="flex flex-1 overflow-hidden">
                  {/* Left: image grid (2 columns) */}
                  <div className="w-84 border-r bg-neutral-50 flex flex-col shrink-0">
                    <div className="flex-1 overflow-y-auto p-2">
                      <div className="grid grid-cols-2 gap-2">
                        {ALL_PHOTOS.map((photo, idx) => (
                          <div
                            key={photo.id}
                            className={`relative rounded-lg overflow-hidden cursor-pointer ring-2 transition-all ${
                              previewIdx === idx
                                ? 'ring-blue-500'
                                : 'ring-transparent hover:ring-neutral-300'
                            }`}
                          >
                            <div
                              onClick={() => { setPreviewIdx(idx); toggleSelect(photo.id) }}
                              className="aspect-square bg-neutral-200"
                            >
                              <img
                                src={photo.thumb}
                                alt={photo.filename}
                                className={`w-full h-full object-cover ${photo.added ? 'opacity-50' : ''}`}
                              />
                              {photo.added && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <div className="w-6 h-6 rounded-full bg-emerald-500/80 flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white" />
                                  </div>
                                </div>
                              )}
                            </div>
                            {/* Source dot + time */}
                            <span className="absolute bottom-1.5 right-1.5 text-xs text-white bg-black/50 px-1.5 py-0.5 rounded pointer-events-none flex items-center gap-1">
                              <span className={`w-2 h-2 rounded-full shrink-0 ${SOURCE_COLORS[photo.source] || 'bg-neutral-500'}`} />
                              {humanizeTime(photo.timestamp)}
                            </span>
                            {/* Checkbox — display only */}
                            <div className="absolute top-1.5 left-1.5 pointer-events-none">
                              <Checkbox
                                checked={selectedIds.has(photo.id)}
                                className="w-5 h-5 bg-white/80 border-white shadow-sm"
                              />
                            </div>
                            {/* Selected overlay */}
                            {selectedIds.has(photo.id) && (
                              <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: preview + edit tools */}
                  <div className="flex-1 flex flex-col bg-neutral-900">
                    <div className="flex items-center gap-1 px-3 py-2 bg-neutral-800 border-b border-neutral-700 shrink-0">
                      {EDIT_TOOLS.map((tool) => (
                        <button
                          key={tool.label}
                          className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700 transition-colors cursor-pointer"
                          title={tool.label}
                        >
                          <tool.icon className="w-4 h-4" />
                          <span className="text-[9px]">{tool.label}</span>
                        </button>
                      ))}
                      <div className="flex-1" />
                      <button
                        className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700 transition-colors cursor-pointer"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-[9px]">삭제</span>
                      </button>
                    </div>

                    <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
                      {previewPhoto && (
                        <img
                          src={previewPhoto.image}
                          alt={previewPhoto.filename}
                          className="max-w-full max-h-full object-contain rounded"
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between px-4 py-1.5 bg-neutral-800 text-[11px] text-neutral-400 shrink-0">
                      <span>{previewPhoto?.filename}</span>
                      <span>{previewPhoto?.source} · {previewPhoto && formatTimestamp(previewPhoto.timestamp)} · {previewPhoto?.size}</span>
                    </div>
                  </div>
                </div>

                {/* Modal footer */}
                <div className="flex items-center justify-between px-4 py-3 border-t bg-white shrink-0">
                  <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                    <ChevronLeft className="w-3.5 h-3.5" />
                    이전
                  </Button>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-neutral-500">
                      <span className="font-semibold text-neutral-900">{selectedIds.size}개</span> 선택됨
                    </span>

                    {/* Patient picker */}
                    <div className="relative">
                      <button
                        onClick={() => { setPatientPickerOpen(!patientPickerOpen); setPatientSearch('') }}
                        className="flex items-center gap-1.5 w-48 px-2.5 py-1.5 rounded-md border border-neutral-200 hover:bg-neutral-50 transition-colors cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-sm font-semibold text-neutral-900">{targetPatient.name}</span>
                        <span className="text-xs text-neutral-400">{targetPatient.chartNo}</span>
                        <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${patientPickerOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {patientPickerOpen && (
                        <div className="absolute bottom-full right-0 mb-1 w-72 bg-white rounded-lg border shadow-xl z-50 overflow-hidden">
                          <div className="p-2 border-b">
                            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-neutral-50 border">
                              <Search className="w-3.5 h-3.5 text-neutral-400" />
                              <input
                                type="text"
                                value={patientSearch}
                                onChange={(e) => setPatientSearch(e.target.value)}
                                placeholder="환자 검색..."
                                className="flex-1 text-sm bg-transparent outline-none placeholder:text-neutral-400"
                                autoFocus
                              />
                            </div>
                          </div>
                          <div className="h-52 overflow-y-auto">
                            {patientSearch === '' && (
                              <div className="px-3 py-1.5 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                                오늘 접수
                              </div>
                            )}
                            {(patientSearch === '' ? TODAY_PATIENTS : ALL_PATIENTS.filter((p) =>
                              p.name.includes(patientSearch) || p.chartNo.includes(patientSearch)
                            )).map((p) => (
                              <button
                                key={p.chartNo}
                                onClick={() => { setTargetPatient(p); setPatientPickerOpen(false) }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-neutral-50 transition-colors cursor-pointer ${
                                  targetPatient.chartNo === p.chartNo ? 'bg-blue-50' : ''
                                }`}
                              >
                                <User className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <span className="text-sm font-medium text-neutral-900">{p.name}</span>
                                  <span className="text-xs text-neutral-400 ml-2">{p.chartNo}</span>
                                </div>
                                <span className="text-[11px] text-neutral-400">{p.birth}</span>
                                {targetPatient.chartNo === p.chartNo && (
                                  <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                )}
                              </button>
                            ))}
                            {patientSearch !== '' && ALL_PATIENTS.filter((p) =>
                              p.name.includes(patientSearch) || p.chartNo.includes(patientSearch)
                            ).length === 0 && (
                              <div className="px-3 py-4 text-sm text-neutral-400 text-center">검색 결과 없음</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <span className="text-sm text-neutral-400">에</span>
                    <Button onClick={handleAdd} disabled={selectedIds.size === 0}>
                      추가하기
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sonner toast */}
          {showToast && (
            <div className="absolute bottom-4 right-4 z-30 animate-in slide-in-from-bottom-3 fade-in duration-300">
              <div className="bg-white rounded-lg shadow-xl border px-4 py-3 flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{toastCount}장 추가 완료</p>
                  <p className="text-xs text-neutral-500">{targetPatient.name} 환자에 저장되었습니다</p>
                </div>
              </div>
            </div>
          )}
        </EmrShell>
      </div>
    </div>
  )
}
