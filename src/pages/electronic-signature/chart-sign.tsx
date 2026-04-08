import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TriangleAlert, Check, Minus } from 'lucide-react'
import { DateRangePicker, StatusBadge, PinModal } from './components'
import { ALL_CHART_RECORDS, TODAY, formatDateRange } from './mock-data'

interface Props {
  showToast: (label: string, count: number) => void
}

export default function ChartSignPage({ showToast }: Props) {
  const [dateFrom, setDateFrom] = useState('2026-03-25')
  const [dateTo, setDateTo] = useState(TODAY)
  const [allDoctors, setAllDoctors] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [queried, setQueried] = useState(false)
  const [selected, setSelected] = useState<Record<number, boolean>>({})
  const [pinOpen, setPinOpen] = useState(false)

  const visibleGroups = allDoctors
    ? Object.entries(ALL_CHART_RECORDS)
    : [['홍원장', ALL_CHART_RECORDS['홍원장']] as const]

  const allRecords = visibleGroups.flatMap(([, recs]) => recs)
  const actionable = allRecords.filter((r) => r.status !== 'signed')
  const initSelect = () => {
    const s: Record<number, boolean> = {}
    actionable.forEach((r) => (s[r.id] = true))
    return s
  }

  const handleQuery = () => {
    setLoading(true); setLoadProgress(0); setQueried(false)
    const start = Date.now(); const duration = 5000
    const tick = () => {
      const elapsed = Date.now() - start
      const pct = Math.min(100, Math.round((elapsed / duration) * 100))
      setLoadProgress(pct)
      if (elapsed < duration) requestAnimationFrame(tick)
      else { setLoading(false); setQueried(true); setSelected(initSelect()) }
    }
    requestAnimationFrame(tick)
  }

  const toggleRecord = (id: number) => setSelected((p) => ({ ...p, [id]: !p[id] }))
  const selectedCount = Object.values(selected).filter(Boolean).length
  const allActionableSelected = actionable.length > 0 && actionable.every((r) => selected[r.id])
  const someActionableSelected = actionable.some((r) => selected[r.id])
  const toggleAll = () => {
    if (allActionableSelected) {
      const s: Record<number, boolean> = {}; actionable.forEach((r) => (s[r.id] = false)); setSelected(s)
    } else {
      setSelected(initSelect())
    }
  }

  const otherDoctorNames = Object.keys(ALL_CHART_RECORDS).filter((n) => n !== '홍원장')
  const otherDoctorRecordIds = otherDoctorNames.flatMap((n) =>
    ALL_CHART_RECORDS[n].filter((r) => r.status !== 'signed').map((r) => r.id),
  )
  const hasOtherSelected = otherDoctorRecordIds.some((id) => selected[id])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">진료기록부 서명</h1>
        <p className="text-sm text-muted-foreground mt-0.5">환자별 진료기록 서명</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <DateRangePicker dateFrom={dateFrom} dateTo={dateTo} onChangeFrom={setDateFrom} onChangeTo={setDateTo} />
            </div>
            <Button onClick={handleQuery}>조회</Button>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={allDoctors}
              onCheckedChange={(v) => { setAllDoctors(!!v); setQueried(false) }}
            />
            <span className="text-sm">모든 의사 기록 검색</span>
          </label>
        </CardContent>
      </Card>

      {/* 모든 의사 체크 시 안내 */}
      {!queried && !loading && allDoctors && (
        <div className="flex gap-3 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50">
          <TriangleAlert className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">다른 의사의 진료기록 서명 안내</p>
            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
              진료기록부 서명은 진료를 수행한 의사 본인이 하는 것이 원칙입니다.
              퇴사 후 연락 불가 등 불가피한 경우에 한하여 다른 의사의 진료기록에 서명해 주시기 바랍니다.
            </p>
          </div>
        </div>
      )}

      {/* 로딩 */}
      {loading && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-sm font-medium mb-1">진료기록부 조회 중...</p>
            <p className="text-xs text-muted-foreground mb-4">서명 대상 기록을 검색하고 있습니다</p>
            <div className="max-w-md mx-auto">
              <Progress value={loadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2 tabular-nums">{loadProgress}%</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 조회 결과 */}
      {queried && !loading && (
        <Card className="overflow-hidden">
          <div className="px-5 py-3 border-b flex items-center justify-between bg-muted/50">
            <p className="text-xs text-muted-foreground">
              {allDoctors ? `${visibleGroups.length}명 의사` : '본인'} · 전체 {allRecords.length}건 · 서명 대상{' '}
              <span className="font-semibold text-foreground">{selectedCount}건</span> 선택
            </p>
            <Button size="sm" onClick={() => setPinOpen(true)} disabled={selectedCount === 0}>
              선택 건 서명
            </Button>
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            {visibleGroups.map(([doctorName, records]) => (
              <div key={doctorName}>
                {allDoctors && (
                  <div className={`px-5 py-2 border-b flex items-center gap-2 ${
                    doctorName === '홍원장' ? 'bg-primary/5 border-primary/10' : 'bg-muted/50'
                  }`}>
                    <span className={`text-xs font-semibold ${doctorName === '홍원장' ? 'text-primary' : ''}`}>
                      {doctorName}
                    </span>
                    {doctorName === '홍원장' && <span className="text-xs text-primary/70">(본인)</span>}
                    <span className="text-xs text-muted-foreground">
                      {records.filter((r) => r.status !== 'signed').length}건 서명필요
                    </span>
                  </div>
                )}
                <Table>
                  {doctorName === visibleGroups[0][0] && (
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10">
                          <button
                            onClick={toggleAll}
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                              allActionableSelected
                                ? 'bg-primary border-primary text-primary-foreground'
                                : someActionableSelected
                                  ? 'bg-primary border-primary text-primary-foreground'
                                  : 'border-input bg-background'
                            }`}
                          >
                            {allActionableSelected ? <Check className="w-3 h-3" /> : someActionableSelected ? <Minus className="w-3 h-3" /> : null}
                          </button>
                        </TableHead>
                        <TableHead className="text-xs">환자</TableHead>
                        <TableHead className="text-xs">차트번호</TableHead>
                        <TableHead className="text-xs text-right">건수</TableHead>
                        <TableHead className="text-xs">진료일</TableHead>
                        <TableHead className="text-xs">상태</TableHead>
                      </TableRow>
                    </TableHeader>
                  )}
                  <TableBody>
                    {records.map((rec) => {
                      const isActionable = rec.status !== 'signed'
                      return (
                        <TableRow key={rec.id} className={isActionable ? '' : 'opacity-50'}>
                          <TableCell>
                            {isActionable ? (
                              <button
                                onClick={() => toggleRecord(rec.id)}
                                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                                  selected[rec.id]
                                    ? 'bg-primary border-primary text-primary-foreground'
                                    : 'border-input bg-background'
                                }`}
                              >
                                {selected[rec.id] && <Check className="w-3 h-3" />}
                              </button>
                            ) : (
                              <div className="w-4 h-4 rounded border border-muted bg-muted flex items-center justify-center text-emerald-500">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{rec.patient}</TableCell>
                          <TableCell className="tabular-nums text-xs text-muted-foreground">{rec.chartNo}</TableCell>
                          <TableCell className="text-right tabular-nums font-semibold">{rec.dates.length}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{formatDateRange(rec.dates)}</TableCell>
                          <TableCell><StatusBadge status={rec.status} /></TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        </Card>
      )}

      <PinModal
        open={pinOpen}
        onClose={() => setPinOpen(false)}
        onConfirm={() => { setPinOpen(false); showToast('진료기록부', selectedCount) }}
        targetCount={selectedCount}
        targetLabel="진료기록부"
        showNote={hasOtherSelected}
      />
    </div>
  )
}
