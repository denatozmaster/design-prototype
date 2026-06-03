import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'

interface Module {
  path: string
  title: string
  description: string
  status: 'ready' | 'wip' | 'planned'
}

const modules: Module[] = [
  {
    path: '/electronic-signature',
    title: '전자서명',
    description: '진료기록부·수납대장·방사선대장 전자서명 관리',
    status: 'ready',
  },
  {
    path: '/photo-reception',
    title: '임상사진 무선 수신',
    description: 'DSLR 촬영 사진 자동 감지 → 알림 → 환자 매칭 · 저장',
    status: 'ready',
  },
  {
    path: '/resin-surface',
    title: '급여레진 치아면 선택',
    description: '소아 복합레진 보험청구 — 면 선택 시 급수·면수·코드 자동 계산',
    status: 'ready',
  },
  {
    path: '/gi-surface',
    title: 'GI 치면 입력',
    description: 'GI 충전 치면 일괄 입력 — 사분면 배치 미니카드',
    status: 'wip',
  },
  {
    path: '/clinical-chart',
    title: '전자차트 (템플릿)',
    description: '전자차트 모듈의 공통 배경 화면 — 새 모듈 생성 시 복사하여 사용',
    status: 'planned',
  },
]

const statusLabel: Record<Module['status'], string> = {
  ready: '완료',
  wip: '작업 중',
  planned: '예정',
}

const statusColor: Record<Module['status'], string> = {
  ready: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  wip: 'bg-amber-50 text-amber-700 border-amber-200',
  planned: 'bg-neutral-100 text-neutral-500 border-neutral-200',
}

export default function Home() {
  return (
    <div className="min-h-svh bg-background">
      <header className="border-b px-8 py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-3">
            Design Prototype
          </p>
          <h1 className="text-4xl font-bold tracking-tight">Dops</h1>
          <p className="mt-2 text-muted-foreground">
            치과 EMR 디자인 프로토타입 — 각 모듈을 선택하여 확인
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-8 py-10">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          모듈 목록
        </p>
        <div className="space-y-3">
          {modules.map((m) => (
            <Link
              key={m.path}
              to={m.path}
              className="group flex items-center justify-between gap-4 p-5 rounded-xl border bg-card transition-all hover:shadow-md hover:border-primary/20 cursor-pointer"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold">{m.title}</span>
                  <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusColor[m.status]}`}>
                    {statusLabel[m.status]}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground truncate">
                  {m.description}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
