import { useState, useEffect, useRef, useCallback } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Check, X, LoaderCircle } from 'lucide-react'
import { type SignStatus, getQuickRanges } from './mock-data'

// ─── StatusBadge ───────────────────────────────────────────
const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
  unsigned: { label: '서명필요', variant: 'outline', className: 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50' },
  mismatch: { label: '서명필요', variant: 'outline', className: 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50' },
  signed: { label: '서명완료', variant: 'outline', className: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50' },
}

export function StatusBadge({ status }: { status: SignStatus }) {
  const config = statusConfig[status]
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  )
}

// ─── DateRangePicker ───────────────────────────────────────
interface DateRangePickerProps {
  dateFrom: string
  dateTo: string
  onChangeFrom: (v: string) => void
  onChangeTo: (v: string) => void
}

export function DateRangePicker({ dateFrom, dateTo, onChangeFrom, onChangeTo }: DateRangePickerProps) {
  const ranges = getQuickRanges()
  return (
    <div>
      <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
        기간 선택
      </label>
      <div className="flex items-center gap-2 flex-wrap">
        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => onChangeFrom(e.target.value)}
          className="w-[150px] text-sm h-9"
        />
        <span className="text-muted-foreground text-xs">~</span>
        <Input
          type="date"
          value={dateTo}
          onChange={(e) => onChangeTo(e.target.value)}
          className="w-[150px] text-sm h-9"
        />
        <div className="flex gap-1 ml-1">
          {ranges.map((r) => {
            const active = dateFrom === r.from && dateTo === r.to
            return (
              <Button
                key={r.label}
                size="sm"
                variant={active ? 'default' : 'outline'}
                className="text-xs h-8"
                onClick={() => { onChangeFrom(r.from); onChangeTo(r.to) }}
              >
                {r.label}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── PinModal ──────────────────────────────────────────────
interface PinModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (note?: string) => void
  targetCount: number
  targetLabel: string
  showNote?: boolean
}

export function PinModal({ open, onClose, onConfirm, targetCount, targetLabel, showNote }: PinModalProps) {
  const [pins, setPins] = useState(['', '', '', '', '', ''])
  const [note, setNote] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const reset = useCallback(() => {
    setPins(['', '', '', '', '', ''])
    setNote('')
  }, [])

  const triggerSign = useCallback(() => {
    const n = note.trim()
    reset()
    onConfirm(n || undefined)
  }, [note, reset, onConfirm])

  const handleChange = (idx: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...pins]
    next[idx] = digit
    setPins(next)
    if (digit && idx < 5) inputRefs.current[idx + 1]?.focus()
    if (digit && idx === 5 && next.every((d) => d !== '')) {
      setTimeout(triggerSign, 150)
    }
  }

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (pins[idx]) {
        const next = [...pins]; next[idx] = ''; setPins(next)
      } else if (idx > 0) {
        const next = [...pins]; next[idx - 1] = ''; setPins(next)
        inputRefs.current[idx - 1]?.focus()
      }
      e.preventDefault()
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
    } else if (e.key === 'ArrowRight' && idx < 5) {
      inputRefs.current[idx + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const next = [...pins]
    for (let i = 0; i < 6; i++) next[i] = pasted[i] || ''
    setPins(next)
    inputRefs.current[Math.min(pasted.length, 5)]?.focus()
    if (pasted.length === 6) setTimeout(triggerSign, 150)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose() } }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>전자서명</DialogTitle>
          <DialogDescription>
            {targetLabel} <span className="font-semibold text-foreground">{targetCount}건</span>에 서명합니다
          </DialogDescription>
        </DialogHeader>

        {showNote && (
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              특이사항 <span className="font-normal">(선택)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="특이사항이 있으면 입력하세요"
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none h-16"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-3">
            PIN 6자리 입력
          </label>
          <div className="flex gap-2 justify-center">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el }}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={pins[i]}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                onFocus={(e) => e.target.select()}
                autoFocus={i === 0}
                className={`w-11 h-14 rounded-lg border-2 text-center text-xl font-bold outline-none transition-all ${
                  pins[i]
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border bg-muted text-muted-foreground'
                } focus:border-primary focus:ring-2 focus:ring-ring`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            6자리 입력 시 자동으로 서명이 실행됩니다
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── SignToast ──────────────────────────────────────────────
export interface ToastData {
  label: string
  count: number
  key: number
}

export function SignToast({ toast, onDone }: { toast: ToastData | null; onDone: () => void }) {
  const [progress, setProgress] = useState(0)
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    if (!toast) return
    setProgress(0)
    setComplete(false)
    const duration = 20000
    const start = Date.now()
    let raf: number
    const tick = () => {
      const elapsed = Date.now() - start
      const pct = Math.min(100, Math.round((elapsed / duration) * 100))
      setProgress(pct)
      if (elapsed < duration) {
        raf = requestAnimationFrame(tick)
      } else {
        setComplete(true)
        setTimeout(() => onDone(), 3000)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [toast, onDone])

  if (!toast) return null

  return (
    <div className="fixed top-5 right-5 z-50 w-80 animate-in slide-in-from-top-3 fade-in duration-300">
      <div className="bg-card border rounded-xl shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            complete ? 'bg-emerald-100' : 'bg-primary/10'
          }`}>
            {complete
              ? <Check className="w-4 h-4 text-emerald-600" />
              : <LoaderCircle className="w-4 h-4 text-primary animate-spin" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">
              {complete ? '서명 완료' : '서명 처리 중'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {toast.label} · {toast.count}건{complete ? ' 처리 완료' : ''}
            </p>
            {!complete && (
              <div className="mt-2.5">
                <Progress value={progress} className="h-1.5" />
                <p className="text-xs text-muted-foreground mt-1 tabular-nums">{progress}%</p>
              </div>
            )}
          </div>
          {complete && (
            <button onClick={onDone} className="text-muted-foreground hover:text-foreground shrink-0 mt-0.5 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
