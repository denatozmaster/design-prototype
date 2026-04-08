import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, Radio, ImageIcon, Settings2 } from 'lucide-react'
import ReceptionFlow from './reception-flow'
import PhotoList from './photo-list'
import SettingsPage from './settings'

const TABS = [
  { id: 'flow', label: '수신 흐름', icon: Radio },
  { id: 'list', label: '사진 목록', icon: ImageIcon },
  { id: 'settings', label: '설정', icon: Settings2 },
]

export default function PhotoReceptionPage() {
  const [tab, setTab] = useState('flow')

  return (
    <div className="flex flex-col h-svh bg-background">
      {/* Header */}
      <header className="flex items-center justify-between h-11 px-4 border-b bg-card shrink-0">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            목록으로
          </Link>
          <h1 className="text-sm font-bold">임상사진 무선 수신</h1>
        </div>

        <nav className="flex items-center gap-0.5">
          {TABS.map((t) => {
            const Icon = t.icon
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            )
          })}
        </nav>
      </header>

      <main className="flex-1 overflow-hidden">
        {tab === 'flow' && <ReceptionFlow />}
        {tab === 'list' && <PhotoList />}
        {tab === 'settings' && <SettingsPage />}
      </main>
    </div>
  )
}
