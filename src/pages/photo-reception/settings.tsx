import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  FolderOpen,
  Plus,
  Pencil,
  Trash2,
  Bell,
  BellOff,
} from 'lucide-react'
import { WATCH_FOLDERS, type WatchFolder } from './mock-data'


const LABEL_COLORS = [
  { id: 'amber', label: '앰버', className: 'bg-amber-500' },
  { id: 'teal', label: '틸', className: 'bg-teal-500' },
  { id: 'violet', label: '보라', className: 'bg-violet-500' },
  { id: 'blue', label: '파랑', className: 'bg-blue-500' },
  { id: 'rose', label: '로즈', className: 'bg-rose-500' },
  { id: 'emerald', label: '초록', className: 'bg-emerald-500' },
  { id: 'orange', label: '주황', className: 'bg-orange-500' },
  { id: 'cyan', label: '시안', className: 'bg-cyan-500' },
]

function colorDotClass(colorId?: string): string {
  return LABEL_COLORS.find((c) => c.id === colorId)?.className || 'bg-neutral-400'
}

export default function Settings() {
  const [folders, setFolders] = useState<WatchFolder[]>(WATCH_FOLDERS)
  const [alertEnabled, setAlertEnabled] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<WatchFolder | null>(null)

  const [formPath, setFormPath] = useState('')
  const [formLabel, setFormLabel] = useState('')
  const [formExts, setFormExts] = useState<string[]>(['jpg'])
  const [formCategory, setFormCategory] = useState('구강사진')
  const [formColor, setFormColor] = useState('amber')

  const openAdd = () => {
    setEditTarget(null)
    setFormPath('')
    setFormLabel('')
    setFormExts(['jpg'])
    setFormCategory('구강사진')
    setFormColor('amber')
    setDialogOpen(true)
  }

  const openEdit = (folder: WatchFolder) => {
    setEditTarget(folder)
    setFormPath(folder.path)
    setFormLabel(folder.label)
    setFormExts([...folder.extensions])
    setFormCategory(folder.defaultCategory || '구강사진')
    setFormColor(folder.color || 'amber')
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (editTarget) {
      setFolders((prev) =>
        prev.map((f) =>
          f.id === editTarget.id
            ? { ...f, path: formPath, label: formLabel, extensions: formExts, defaultCategory: formCategory, color: formColor }
            : f
        )
      )
    } else {
      const newId = Math.max(...folders.map((f) => f.id)) + 1
      setFolders((prev) => [
        ...prev,
        { id: newId, path: formPath, label: formLabel, extensions: formExts, active: true, defaultCategory: formCategory, color: formColor },
      ])
    }
    setDialogOpen(false)
  }

  const toggleActive = (id: number) => {
    setFolders((prev) =>
      prev.map((f) => (f.id === id ? { ...f, active: !f.active } : f))
    )
  }

  const deleteFolder = (id: number) => {
    setFolders((prev) => prev.filter((f) => f.id !== id))
  }


  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Watch folders */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold">감시 폴더</h3>
              <p className="text-xs text-muted-foreground mt-0.5">사진이 저장되는 폴더를 등록하면 자동으로 감시합니다</p>
            </div>
            <Button size="sm" onClick={openAdd}>
              <Plus className="w-3.5 h-3.5" />
              폴더 추가
            </Button>
          </div>

          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">상태</TableHead>
                  <TableHead>라벨</TableHead>
                  <TableHead>경로</TableHead>
                  <TableHead>최근 수신</TableHead>
                  <TableHead className="w-20 text-right">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {folders.map((f) => (
                  <TableRow key={f.id} className={!f.active ? 'opacity-50' : ''}>
                    <TableCell>
                      <button
                        onClick={() => toggleActive(f.id)}
                        className="cursor-pointer"
                      >
                        <div className={`w-2.5 h-2.5 rounded-full ${f.active ? 'bg-emerald-500' : 'bg-neutral-300'}`} />
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full shrink-0 ${colorDotClass(f.color)}`} />
                        <span className="font-medium text-sm">{f.label}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{f.path}</code>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground tabular-nums">{f.lastReceived || '-'}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon-xs" onClick={() => openEdit(f)}>
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon-xs" onClick={() => deleteFolder(f.id)}>
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {folders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-sm">
                      <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      등록된 감시 폴더가 없습니다
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Notification settings */}
        <section>
          <h3 className="text-sm font-bold mb-3">알림 설정</h3>
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {alertEnabled ? (
                  <Bell className="w-4 h-4 text-blue-500" />
                ) : (
                  <BellOff className="w-4 h-4 text-muted-foreground" />
                )}
                <div>
                  <p className="text-sm font-medium">이 컴퓨터에서 알림 받기</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    비활성화하면 사진 수신 알림이 표시되지 않습니다 (데스크·상담실용)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAlertEnabled(!alertEnabled)}
                className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${
                  alertEnabled ? 'bg-blue-500' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    alertEnabled ? 'left-[18px]' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editTarget ? '폴더 수정' : '감시 폴더 추가'}</DialogTitle>
            <DialogDescription>
              사진이 저장되는 폴더 경로와 라벨을 설정합니다
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">폴더 경로</label>
              <Input
                value={formPath}
                onChange={(e) => setFormPath(e.target.value)}
                placeholder="C:\Photos\NikonZ50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">라벨</label>
              <Input
                value={formLabel}
                onChange={(e) => setFormLabel(e.target.value)}
                placeholder="Nikon Z50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">라벨 색상</label>
              <div className="flex flex-wrap gap-2">
                {LABEL_COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setFormColor(c.id)}
                    className={`w-7 h-7 rounded-full ${c.className} transition-all cursor-pointer ${
                      formColor === c.id
                        ? 'ring-2 ring-offset-2 ring-neutral-400 scale-110'
                        : 'hover:scale-110'
                    }`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>취소</Button>
              <Button onClick={handleSave} disabled={!formPath || !formLabel}>
                {editTarget ? '수정' : '추가'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
