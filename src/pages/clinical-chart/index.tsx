import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import Navigation from './navigation'
import ClinicalRecord from './clinical-record'
import ClinicalEntry from './clinical-entry'

export default function ClinicalChartPage() {
  return (
    <div className="flex flex-col h-svh bg-background overflow-hidden">
      {/* Navigation */}
      <Navigation />

      {/* Main Content: 2-panel layout */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left: Clinical Record */}
        <div className="w-[760px] shrink-0">
          <ClinicalRecord />
        </div>

        {/* Right: Clinical Entry */}
        <div className="flex-1 min-w-0">
          <ClinicalEntry />
        </div>
      </main>

      {/* Prototype overlay: back to home */}
      <Link
        to="/"
        className="fixed top-2 left-3 z-50 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/70 text-white text-[11px] hover:bg-black/90 transition-colors backdrop-blur-sm"
      >
        <ArrowLeft className="w-3 h-3" />
        목록으로
      </Link>
    </div>
  )
}
