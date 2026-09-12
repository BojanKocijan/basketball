import type { Segment } from '../data/session'

export function SegmentTimeline({
  segments,
  currentId,
  onSelect,
}: {
  segments: Segment[]
  currentId: string
  onSelect: (segment: Segment) => void
}) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-2 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {segments.map((segment) => {
        const isActive = segment.id === currentId
        return (
          <button
            key={segment.id}
            type="button"
            onClick={() => onSelect(segment)}
            className={`flex shrink-0 flex-col items-center gap-1 rounded-2xl border px-3 py-2 text-center transition-colors ${
              isActive
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10'
                : 'border-black/10 bg-white dark:border-white/10 dark:bg-neutral-900'
            }`}
          >
            <span className="text-lg leading-none">{segment.emoji}</span>
            <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400">
              {segment.start}′
            </span>
          </button>
        )
      })}
    </div>
  )
}
