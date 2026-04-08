import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { KeyRound, Settings } from 'lucide-react'
import { DOCTORS, getDaysAgo, formatDate } from './mock-data'

interface Props {
  onNavigate: (page: string) => void
}

export default function DashboardPage({ onNavigate }: Props) {
  const myLastSign = '2026-04-01'
  const myDaysAgo = getDaysAgo(myLastSign)
  const myUnsigned = { chart: 48, receipt: 3, xray: 2 }
  const total = myUnsigned.chart + myUnsigned.receipt + myUnsigned.xray

  const cards = [
    { label: '진료기록부', value: myUnsigned.chart, nav: 'chart' },
    { label: '수납대장', value: myUnsigned.receipt, nav: 'receipt' },
    { label: '방사선대장', value: myUnsigned.xray, nav: 'xray' },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">서명 현황</h1>
        <p className="text-sm text-muted-foreground mt-0.5">대표원장 · 2026.04.05 기준</p>
      </div>

      {/* 마지막 서명일 강조 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-baseline gap-6 mb-6">
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">마지막 서명일</p>
              <p className="text-3xl font-bold tabular-nums tracking-tight">{formatDate(myLastSign)}</p>
            </div>
            <div className="h-10 w-px bg-border self-center" />
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">경과</p>
              <p className={`text-3xl font-bold tabular-nums tracking-tight ${myDaysAgo >= 30 ? 'text-red-600' : ''}`}>
                {myDaysAgo}일
              </p>
            </div>
          </div>

          {/* 개별 문서 카드 */}
          <div className="grid grid-cols-4 gap-3">
            {cards.map((item) => (
              <button
                key={item.label}
                onClick={() => onNavigate(item.nav)}
                className="rounded-xl p-4 text-center border bg-muted/40 transition-all hover:bg-muted hover:shadow-sm cursor-pointer"
              >
                <p className="text-2xl font-bold tabular-nums">{item.value}</p>
                <p className="text-[11px] mt-1 text-muted-foreground">{item.label}</p>
              </button>
            ))}
            {/* 전체 미서명 — 파란 강조 */}
            <button
              onClick={() => onNavigate('batch')}
              className="rounded-xl p-4 text-center border-2 border-blue-200 bg-blue-50/50 transition-all hover:bg-blue-50 hover:shadow-sm cursor-pointer"
            >
              <p className="text-2xl font-bold tabular-nums text-blue-700">{total}</p>
              <p className="text-[11px] mt-1 text-blue-600">전체 미서명</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 인증서 상태 */}
      <Card>
        <CardContent className="py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium">공인인증서 등록됨</p>
              <p className="text-xs text-muted-foreground">유효기간: 2027.01.15 · 남은 기간 285일</p>
            </div>
          </div>
          <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer">
            <Settings className="w-3.5 h-3.5" />
            <span>관리</span>
          </button>
        </CardContent>
      </Card>

      {/* 봉직의 현황 */}
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-sm font-semibold mb-4">의사별 서명 현황</h2>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wider">의사명</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wider">마지막 서명일</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wider">경과일수</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-right">미서명 건수</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DOCTORS.map((doc) => {
                  const days = getDaysAgo(doc.lastSignDate)
                  const warn = days >= 30
                  return (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell className="tabular-nums text-muted-foreground">{formatDate(doc.lastSignDate)}</TableCell>
                      <TableCell className={`tabular-nums font-semibold ${warn ? 'text-red-600' : ''}`}>
                        {days}일
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-semibold">{doc.unsignedCount}건</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
