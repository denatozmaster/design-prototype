import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Check } from 'lucide-react'
import { DateRangePicker, StatusBadge, PinModal } from './components'
import { type DailyRecord, TODAY, formatDate } from './mock-data'

interface Props {
  title: string
  subtitle: string
  records: DailyRecord[]
  showToast: (label: string, count: number) => void
}

export default function DailyDocSignPage({ title, subtitle, records, showToast }: Props) {
  const [dateFrom, setDateFrom] = useState('2026-03-28')
  const [dateTo, setDateTo] = useState(TODAY)
  const [queried, setQueried] = useState(false)
  const [selected, setSelected] = useState<Record<number, boolean>>({})
  const [pinOpen, setPinOpen] = useState(false)

  const actionable = records.filter((r) => r.status !== 'signed')
  const handleQuery = () => {
    setQueried(true)
    const sel: Record<number, boolean> = {}
    actionable.forEach((r) => (sel[r.id] = true))
    setSelected(sel)
  }

  const toggleRecord = (id: number) => setSelected((p) => ({ ...p, [id]: !p[id] }))
  const selectedCount = Object.values(selected).filter(Boolean).length

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <DateRangePicker dateFrom={dateFrom} dateTo={dateTo} onChangeFrom={setDateFrom} onChangeTo={setDateTo} />
            </div>
            <Button onClick={handleQuery}>조회</Button>
          </div>
        </CardContent>
      </Card>

      {queried && (
        <Card className="overflow-hidden">
          <div className="px-5 py-3 border-b flex items-center justify-between bg-muted/50">
            <p className="text-xs text-muted-foreground">
              전체 {records.length}건 · 서명 대상{' '}
              <span className="font-semibold text-foreground">{selectedCount}건</span> 선택
            </p>
            <Button size="sm" onClick={() => setPinOpen(true)} disabled={selectedCount === 0}>
              선택 건 서명
            </Button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10" />
                  <TableHead className="text-xs">날짜</TableHead>
                  <TableHead className="text-xs">상태</TableHead>
                </TableRow>
              </TableHeader>
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
                      <TableCell className="font-medium tabular-nums">{formatDate(rec.date)}</TableCell>
                      <TableCell><StatusBadge status={rec.status} /></TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      <PinModal
        open={pinOpen}
        onClose={() => setPinOpen(false)}
        onConfirm={() => { setPinOpen(false); showToast(title, selectedCount) }}
        targetCount={selectedCount}
        targetLabel={title}
      />
    </div>
  )
}
