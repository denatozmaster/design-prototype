import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DateRangePicker } from './components'
import { SIGN_HISTORY, TODAY, subtractDays } from './mock-data'

export default function HistoryPage() {
  const [dateFrom, setDateFrom] = useState(subtractDays(TODAY, 365))
  const [dateTo, setDateTo] = useState(TODAY)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">서명 이력</h1>
        <p className="text-sm text-muted-foreground mt-0.5">전체 서명 이력 조회</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DateRangePicker dateFrom={dateFrom} dateTo={dateTo} onChangeFrom={setDateFrom} onChangeTo={setDateTo} />
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider">서명일시</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider">서명자</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-right">건수</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider">문서 종류</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider">특이사항</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SIGN_HISTORY.map((h) => (
                <TableRow key={h.id}>
                  <TableCell className="tabular-nums text-xs text-muted-foreground">{h.date}</TableCell>
                  <TableCell className="font-medium">{h.signer}</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">{h.count}건</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{h.docType}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{h.note || ''}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
