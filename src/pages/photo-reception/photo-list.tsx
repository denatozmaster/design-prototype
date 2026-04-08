import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Camera, Check, Eye, EyeOff, ImageIcon } from 'lucide-react'
import { PHOTOS, formatTimestamp, formatDate, groupByDate, type Photo } from './mock-data'

export default function PhotoList() {
  const [showAdded, setShowAdded] = useState(false)
  const [sourceFilter, setSourceFilter] = useState<string | null>(null)

  const sources = [...new Set(PHOTOS.map((p) => p.source))]

  let filtered = PHOTOS.filter((p) => {
    if (!showAdded && p.added) return false
    if (sourceFilter && p.source !== sourceFilter) return false
    return true
  })

  const grouped = groupByDate(filtered)
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  const pendingCount = PHOTOS.filter((p) => !p.added).length
  const addedCount = PHOTOS.filter((p) => p.added).length

  return (
    <div className="flex flex-col h-full">
      {/* Header + filters */}
      <div className="shrink-0 px-5 py-4 bg-card border-b space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold">수신 사진 목록</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              미추가 {pendingCount}장 · 추가완료 {addedCount}장
            </p>
          </div>
          <Button
            variant={showAdded ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowAdded(!showAdded)}
          >
            {showAdded ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            추가완료 {showAdded ? '표시 중' : '숨김'}
          </Button>
        </div>

        {/* Source filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground mr-1">소스:</span>
          <Button
            variant={sourceFilter === null ? 'default' : 'outline'}
            size="xs"
            onClick={() => setSourceFilter(null)}
          >
            전체
          </Button>
          {sources.map((s) => (
            <Button
              key={s}
              variant={sourceFilter === s ? 'default' : 'outline'}
              size="xs"
              onClick={() => setSourceFilter(sourceFilter === s ? null : s)}
            >
              <Camera className="w-3 h-3" />
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* Photo grid */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {sortedDates.map((date) => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-3">
              <h4 className="text-xs font-semibold text-muted-foreground">{formatDate(date)}</h4>
              <span className="text-[11px] text-muted-foreground">({grouped[date].length}장)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {grouped[date].map((photo) => (
                <PhotoCard key={photo.id} photo={photo} />
              ))}
            </div>
          </div>
        ))}
        {sortedDates.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <ImageIcon className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">표시할 사진이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  )
}

function PhotoCard({ photo }: { photo: Photo }) {
  return (
    <div
      className={`group rounded-lg border overflow-hidden transition-all ${
        photo.added ? 'opacity-60 border-neutral-200' : 'border-neutral-200 hover:border-primary/30 hover:shadow-sm'
      }`}
    >
      <div className="aspect-square bg-neutral-100 relative overflow-hidden">
        <img
          src={photo.thumb}
          alt={photo.filename}
          className="w-full h-full object-cover"
        />
        {photo.added && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
        {!photo.added && (
          <div className="absolute top-1.5 right-1.5">
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] px-1.5 py-0">
              미추가
            </Badge>
          </div>
        )}
      </div>
      <div className="p-2">
        <p className="text-[11px] font-medium truncate">{photo.filename}</p>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1">
            <Camera className="w-2.5 h-2.5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">{photo.source}</span>
          </div>
          <span className="text-[10px] text-muted-foreground">{formatTimestamp(photo.timestamp)}</span>
        </div>
        {photo.added && photo.patient && (
          <div className="flex items-center gap-1 mt-1">
            <Check className="w-2.5 h-2.5 text-emerald-500" />
            <span className="text-[10px] text-emerald-600 font-medium">{photo.patient}</span>
          </div>
        )}
      </div>
    </div>
  )
}
