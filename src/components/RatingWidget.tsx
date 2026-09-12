const SCALE = [
  { value: 1, emoji: '😐', label: 'Okay' },
  { value: 2, emoji: '🙂', label: 'Fun' },
  { value: 3, emoji: '🤩', label: 'Loved it' },
] as const

export function RatingWidget({
  onRate,
  average,
  count,
}: {
  onRate: (value: number) => void
  average: number | null
  count: number
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-2xl border border-black/10 bg-neutral-50 px-3 py-2 dark:border-white/10 dark:bg-neutral-800/60">
      <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
        Kids liked it?
      </span>
      <div className="flex items-center gap-1">
        {SCALE.map((s) => (
          <button
            key={s.value}
            type="button"
            aria-label={s.label}
            onClick={() => onRate(s.value)}
            className="rounded-full p-1.5 text-lg leading-none transition-transform active:scale-90"
          >
            {s.emoji}
          </button>
        ))}
      </div>
      {count > 0 && average !== null && (
        <span className="shrink-0 text-xs font-medium text-neutral-400">
          avg {average.toFixed(1)} · {count}×
        </span>
      )}
    </div>
  )
}
