import { useMemo } from 'react'
import { segments, totalMinutes } from '../data/session'
import { useSessionClock } from '../hooks/useSessionClock'
import { formatClock } from '../utils/format'
import { SegmentCard } from './SegmentCard'
import { SegmentTimeline } from './SegmentTimeline'

export function SessionScreen() {
  const { elapsedSeconds, running, start, pause, reset, jumpTo } = useSessionClock()
  const elapsedMinutes = elapsedSeconds / 60
  const totalSeconds = totalMinutes * 60

  const currentIndex = useMemo(() => {
    const idx = segments.findIndex((s) => elapsedMinutes < s.end)
    return idx === -1 ? segments.length - 1 : idx
  }, [elapsedMinutes])

  const current = segments[currentIndex]
  const next = segments[currentIndex + 1]
  const remainingInSegment = Math.max(0, current.end * 60 - elapsedSeconds)
  const isSessionDone = elapsedSeconds >= totalSeconds

  const overallPct = Math.min(100, (elapsedSeconds / totalSeconds) * 100)
  const segmentDuration = (current.end - current.start) * 60
  const segmentElapsed = Math.min(
    segmentDuration,
    Math.max(0, elapsedSeconds - current.start * 60),
  )
  const segmentPct = segmentDuration > 0 ? (segmentElapsed / segmentDuration) * 100 : 0

  function goToSegment(index: number) {
    const target = segments[Math.max(0, Math.min(segments.length - 1, index))]
    jumpTo(target.start * 60)
  }

  return (
    <div className="mx-auto max-w-md pb-24">
      <header className="sticky top-0 z-10 border-b border-black/10 bg-white/90 px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/90">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-bold text-neutral-900 dark:text-neutral-50">
            U8 Basketball Training
          </h1>
          <span className="font-mono text-sm text-neutral-500 dark:text-neutral-400">
            {formatClock(elapsedSeconds)} / {totalMinutes}:00
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
          <div
            className="h-full rounded-full bg-orange-500 transition-all"
            style={{ width: `${overallPct}%` }}
          />
        </div>
      </header>

      <SegmentTimeline segments={segments} currentId={current.id} onSelect={(s) => jumpTo(s.start * 60)} />

      <main className="space-y-4 px-4 pt-2">
        {isSessionDone ? (
          <div className="rounded-3xl border border-black/10 bg-white p-6 text-center dark:border-white/10 dark:bg-neutral-900">
            <p className="text-4xl">🏆</p>
            <h2 className="mt-2 text-lg font-bold text-neutral-900 dark:text-neutral-50">
              Session complete!
            </h2>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Great job, coaches. Time for high-fives and go home.
            </p>
          </div>
        ) : (
          <>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
              <div
                className="h-full rounded-full bg-neutral-900 transition-all dark:bg-neutral-100"
                style={{ width: `${segmentPct}%` }}
              />
            </div>
            <SegmentCard segment={current} remainingLabel={formatClock(remainingInSegment)} />
            {next && (
              <div className="rounded-2xl border border-dashed border-black/15 px-4 py-3 text-sm text-neutral-500 dark:border-white/15 dark:text-neutral-400">
                Up next: <span className="font-semibold">{next.emoji} {next.title}</span> at {next.start}:00
              </div>
            )}
          </>
        )}

        <div className="grid grid-cols-4 gap-2 pt-1">
          <button
            type="button"
            onClick={() => goToSegment(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="rounded-2xl border border-black/10 py-3 text-sm font-semibold text-neutral-700 disabled:opacity-30 dark:border-white/10 dark:text-neutral-200"
          >
            ⏮ Prev
          </button>
          <button
            type="button"
            onClick={running ? pause : start}
            className="col-span-2 rounded-2xl bg-orange-500 py-3 text-sm font-bold text-white shadow-sm active:bg-orange-600"
          >
            {running ? '⏸ Pause' : '▶ Start'}
          </button>
          <button
            type="button"
            onClick={() => goToSegment(currentIndex + 1)}
            disabled={currentIndex === segments.length - 1}
            className="rounded-2xl border border-black/10 py-3 text-sm font-semibold text-neutral-700 disabled:opacity-30 dark:border-white/10 dark:text-neutral-200"
          >
            Next ⏭
          </button>
        </div>
        <button
          type="button"
          onClick={reset}
          className="w-full rounded-2xl py-2 text-xs font-semibold text-neutral-400 active:text-neutral-600 dark:text-neutral-500"
        >
          Reset session clock
        </button>
      </main>
    </div>
  )
}
