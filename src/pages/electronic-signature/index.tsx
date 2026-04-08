import { useState, useCallback } from 'react'
import { Link } from 'react-router'
import {
  LayoutDashboard,
  ListChecks,
  FileCheck,
  Receipt,
  Radiation,
  Clock,
  ArrowLeft,
} from 'lucide-react'
import { SignToast, type ToastData } from './components'
import { getDaysAgo } from './mock-data'
import DashboardPage from './dashboard'
import BatchSignPage from './batch-sign'
import ChartSignPage from './chart-sign'
import DailyDocSignPage from './daily-doc-sign'
import HistoryPage from './history'
import { DAILY_RECORDS_RECEIPT, DAILY_RECORDS_XRAY } from './mock-data'

const MENU = [
  { id: 'dashboard', label: '서명 현황', icon: LayoutDashboard },
  { id: 'batch', label: '일괄서명', icon: ListChecks },
  { id: 'chart', label: '진료기록부', icon: FileCheck, lastSignDate: '2026-04-01' },
  { id: 'receipt', label: '수납대장', icon: Receipt, lastSignDate: '2026-02-20' },
  { id: 'xray', label: '방사선대장', icon: Radiation, lastSignDate: '2026-04-01' },
  { id: 'history', label: '서명 이력', icon: Clock },
]

export default function ElectronicSignaturePage() {
  const [page, setPage] = useState('dashboard')
  const [toast, setToast] = useState<ToastData | null>(null)
  const showToast = useCallback((label: string, count: number) => {
    setToast({ label, count, key: Date.now() })
  }, [])
  const clearToast = useCallback(() => setToast(null), [])

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <DashboardPage onNavigate={setPage} />
      case 'batch':
        return <BatchSignPage showToast={showToast} />
      case 'chart':
        return <ChartSignPage showToast={showToast} />
      case 'receipt':
        return (
          <DailyDocSignPage
            title="수납대장 서명"
            subtitle="본인부담금 수납대장 · 일별 1건"
            records={DAILY_RECORDS_RECEIPT}
            showToast={showToast}
          />
        )
      case 'xray':
        return (
          <DailyDocSignPage
            title="방사선대장 서명"
            subtitle="방사선발생장치 사용대장 · 일별 1건"
            records={DAILY_RECORDS_XRAY}
            showToast={showToast}
          />
        )
      case 'history':
        return <HistoryPage />
      default:
        return <DashboardPage onNavigate={setPage} />
    }
  }

  return (
    <div className="flex h-svh bg-background">
      {/* Sidebar */}
      <aside className="w-56 bg-card border-r flex flex-col shrink-0">
        {/* Sidebar header */}
        <div className="px-4 pt-5 pb-4 border-b">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <ArrowLeft className="w-3 h-3" />
            목록으로
          </Link>
          <h2 className="text-sm font-bold">전자서명</h2>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto">
          {MENU.map((item) => {
            const days = item.lastSignDate ? getDaysAgo(item.lastSignDate) : null
            const warn = days !== null && days >= 30
            const Icon = item.icon
            const active = page === item.id
            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-[13px] transition-colors cursor-pointer ${
                  active
                    ? 'bg-blue-50 text-blue-800 font-semibold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-blue-700' : ''}`} />
                <span className="flex-1">{item.label}</span>
                {warn && (
                  <span className="text-[11px] font-bold tabular-nums text-red-500">
                    {days}일
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-8">
          {renderPage()}
        </div>
      </main>

      <SignToast toast={toast} onDone={clearToast} />
    </div>
  )
}
