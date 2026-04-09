import {
  Search,
  StickyNote,
  Users,
  FileText,
  Monitor,
  CalendarDays,
  Stethoscope,
  Building2,
  Wrench,
  ScanLine,
  ImageIcon,
  ClipboardList,
  BookOpen,
  Eye,
  Radio as RadioIcon,
  Bot,
  CreditCard,
  FileStack,
  Camera,
  LayoutGrid,
  LogIn,
  Clock,
  Settings,
} from 'lucide-react'
import {
  currentPatient,
  patientDetails,
  checkInList,
  navIcons,
  subInfoTags,
  subInfoBreadcrumb,
  subInfoExtra,
} from './mock-data'

const NAV_ICON_MAP: Record<string, React.ElementType> = {
  chart: FileText,
  desk: Monitor,
  schedule: CalendarDays,
  treatment: Stethoscope,
  manage: Building2,
  lab: Wrench,
  xray: ScanLine,
  endo: ImageIcon,
  pedo: ClipboardList,
  ortho: BookOpen,
  perio: FileStack,
  prosth: Camera,
  eyefile: Eye,
  xray2: RadioIcon,
}

const SUB_MENU_ICONS = [Bot, CreditCard, FileStack, Camera]

export default function Navigation() {
  return (
    <div className="shrink-0">
      {/* Main Nav Row */}
      <div className="flex items-center h-[92px] border-b bg-white">
        {/* Patient Info */}
        <div className="flex items-center gap-3 w-[321px] h-full px-3 border-r">
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 via-rose-400 to-orange-300 flex items-center justify-center text-white text-base font-bold">
              {currentPatient.name[0]}
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center">
              <span className="text-[8px] text-white">★</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex items-center gap-1">
              <div className="flex items-center h-7 bg-neutral-100 rounded-md px-2 gap-1 text-[12px]">
                <span className="font-semibold text-neutral-900">{currentPatient.name} ({currentPatient.chartNo})</span>
                <Search className="w-3 h-3 text-neutral-400" />
              </div>
              <button className="h-7 px-1.5 rounded-md bg-neutral-100 text-xs text-neutral-600 hover:bg-neutral-200">
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button className="h-[22px] px-2 rounded-md border text-[10px] text-neutral-600 hover:bg-neutral-50">
                <span className="flex items-center gap-0.5"><StickyNote className="w-2.5 h-2.5" /> 포스트잇</span>
              </button>
              <button className="h-[22px] px-2 rounded-md border text-[10px] text-neutral-600 hover:bg-neutral-50">
                <span className="flex items-center gap-0.5"><Users className="w-2.5 h-2.5" /> 환자검색</span>
              </button>
              <button className="h-[22px] px-2 rounded-md border text-[10px] text-neutral-600 hover:bg-neutral-50">
                <span className="flex items-center gap-0.5"><Users className="w-2.5 h-2.5" /> 환자검색</span>
              </button>
            </div>
          </div>
        </div>

        {/* Patient Details (3 rows) */}
        <div className="w-[220px] h-full border-r px-2 py-1.5 flex flex-col justify-center">
          {patientDetails.map((d, i) => (
            <div key={i} className="flex items-center gap-1.5 py-0.5">
              <span className="text-[10px] text-teal-600 font-semibold shrink-0 w-[52px]">{d.label}</span>
              <span className="text-[10px] text-neutral-600 truncate">{d.value}</span>
            </div>
          ))}
        </div>

        {/* Check-in List */}
        <div className="w-[240px] h-full border-r overflow-hidden">
          <div className="h-full overflow-y-auto">
            <table className="w-full text-[10px]">
              <thead>
                <tr className="bg-neutral-100 text-neutral-500">
                  <th className="px-1.5 py-1 text-left font-medium w-[44px]">시간</th>
                  <th className="px-1.5 py-1 text-left font-medium">환자</th>
                  <th className="px-1.5 py-1 text-left font-medium w-[36px]">상태</th>
                </tr>
              </thead>
              <tbody>
                {checkInList.map((item, i) => {
                  const statusColor =
                    item.status === '완료' ? 'text-emerald-600' :
                    item.status === '진료중' ? 'text-blue-600 font-semibold' :
                    item.status === '수납' ? 'text-purple-600' :
                    'text-neutral-400'
                  return (
                    <tr
                      key={i}
                      className={`border-b border-neutral-50 ${
                        item.name === currentPatient.name
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      <td className="px-1.5 py-[3px] text-neutral-400">{item.time}</td>
                      <td className="px-1.5 py-[3px] font-medium">{item.name}</td>
                      <td className={`px-1.5 py-[3px] ${statusColor}`}>{item.status}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Icon Navigation */}
        <div className="flex-1 flex items-center h-full px-2 overflow-x-auto">
          <nav className="flex items-center gap-0.5">
            {navIcons.map((item) => {
              const Icon = NAV_ICON_MAP[item.id] || FileText
              const isActive = item.id === 'chart'
              return (
                <button
                  key={item.id}
                  className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-md transition-colors min-w-[52px] ${
                    isActive
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] whitespace-nowrap">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Sub Menu Buttons */}
        <div className="flex items-center gap-2 px-3 h-full border-l shrink-0">
          {[
            { icon: Bot, label: 'AI 요약' },
            { icon: CreditCard, label: '수납 내역' },
            { icon: FileStack, label: '문서 스캔' },
            { icon: Camera, label: 'PC 촬영' },
          ].map((item, i) => (
            <button
              key={i}
              className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] whitespace-nowrap">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sub Info Bar */}
      <div className="flex items-center h-11 px-4 gap-3 bg-neutral-50 border-b text-[11px] overflow-x-auto">
        {/* Warning/status tags */}
        {subInfoTags.map((tag, i) => (
          <span
            key={i}
            className={`shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-md font-medium ${
              tag.type === 'warning'
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
            }`}
          >
            {tag.type === 'warning' ? '⚠' : '✓'} {tag.label}
          </span>
        ))}

        <span className="text-neutral-300">|</span>

        {/* Breadcrumb info */}
        {subInfoBreadcrumb.map((item, i) => (
          <span key={i} className="shrink-0 text-neutral-500">
            {i > 0 && <span className="mr-2 text-neutral-300">·</span>}
            {item}
          </span>
        ))}

        <span className="text-neutral-300">|</span>

        {/* Extra info */}
        <div className="flex items-center gap-3">
          {subInfoExtra.map((item, i) => (
            <span
              key={i}
              className={`shrink-0 px-2 py-0.5 rounded text-neutral-500 ${
                i === 0 ? 'bg-purple-50 text-purple-600 border border-purple-200' : ''
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        <button className="ml-auto shrink-0 text-neutral-400 hover:text-neutral-600">
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
