import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DateRangePicker, PinModal } from './components'
import { TODAY } from './mock-data'

interface Props {
  showToast: (label: string, count: number) => void
}

export default function BatchSignPage({ showToast }: Props) {
  const [dateFrom, setDateFrom] = useState('2026-03-01')
  const [dateTo, setDateTo] = useState(TODAY)
  const [docTypes, setDocTypes] = useState({ chart: true, receipt: true, xray: true })
  const [queried, setQueried] = useState(false)
  const [pinOpen, setPinOpen] = useState(false)

  const counts = { chart: 48, receipt: 3, xray: 2 }
  const selectedCount =
    (docTypes.chart ? counts.chart : 0) +
    (docTypes.receipt ? counts.receipt : 0) +
    (docTypes.xray ? counts.xray : 0)

  const toggleOne = (k: keyof typeof docTypes) =>
    setDocTypes((p) => ({ ...p, [k]: !p[k] }))

  const docCards = [
    { key: 'chart' as const, label: '진료기록부', count: counts.chart },
    { key: 'receipt' as const, label: '수납대장', count: counts.receipt },
    { key: 'xray' as const, label: '방사선대장', count: counts.xray },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">일괄서명</h1>
        <p className="text-sm text-muted-foreground mt-0.5">3종 문서를 한번에 서명합니다</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <DateRangePicker
                dateFrom={dateFrom} dateTo={dateTo}
                onChangeFrom={setDateFrom} onChangeTo={setDateTo}
              />
            </div>
            <Button onClick={() => { setQueried(true); setDocTypes({ chart: true, receipt: true, xray: true }) }}>
              조회
            </Button>
          </div>
        </CardContent>
      </Card>

      {queried && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-sm font-semibold">
              조회 결과{' '}
              <span className="font-normal text-muted-foreground ml-1">
                클릭하여 서명 대상을 선택하세요
              </span>
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {docCards.map((item) => (
                <button
                  key={item.key}
                  onClick={() => toggleOne(item.key)}
                  className={`rounded-lg p-4 text-center border transition-colors cursor-pointer ${
                    docTypes[item.key]
                      ? 'border-primary/20 bg-primary/5 hover:bg-primary/10'
                      : 'border-border bg-muted/50 opacity-50 hover:opacity-70'
                  }`}
                >
                  <p className={`text-xl font-bold tabular-nums ${docTypes[item.key] ? '' : 'text-muted-foreground'}`}>
                    {item.count}
                  </p>
                  <p className={`text-xs mt-0.5 ${docTypes[item.key] ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                    {item.label}
                  </p>
                </button>
              ))}
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                서명 대상 <span className="font-bold text-foreground">{selectedCount}건</span>
              </p>
              <Button onClick={() => setPinOpen(true)} disabled={selectedCount === 0}>
                서명하기
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <PinModal
        open={pinOpen}
        onClose={() => setPinOpen(false)}
        onConfirm={() => { setPinOpen(false); setQueried(false); showToast('일괄서명', selectedCount) }}
        targetCount={selectedCount}
        targetLabel="일괄서명"
      />
    </div>
  )
}
