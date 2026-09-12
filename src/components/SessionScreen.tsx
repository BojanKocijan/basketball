import { useMemo } from 'react'
import type { useActivePlan } from '../hooks/useActivePlan'
import { useRatings } from '../hooks/useRatings'
import { useSessionClock } from '../hooks/useSessionClock'
import { formatClock } from '../utils/format'
import { ExerciseCard } from './ExerciseCard'
import { ExerciseTimeline } from './ExerciseTimeline'

export function SessionScreen({
  activePlan,
  onBuildPlan,
}: {
  activePlan: ReturnType<typeof useActivePlan>
  onBuildPlan: () => void
}) {
  const { planTitle, planEmoji, planExercises, totalMinutes } = activePlan
  const { elapsedSeconds, running, start, pause, reset, jumpTo } = useSessionClock()
  const { rate, stats } = useRatings()
  const totalSeconds = totalMinutes * 60

  // cumulative start/end (in seconds) for each exercise, derived from the active plan's order
  const timeline = useMemo(() => {
    return planExercises.reduce<{ exercise: (typeof planExercises)[number]; startSec: number; endSec: number }[]>(
      (acc, exercise) => {
        const startSec = acc.length > 0 ? acc[acc.length - 1].endSec : 0
        acc.push({ exercise, startSec, endSec: startSec + exercise.durationMinutes * 60 })
        return acc
      },
      [],
    )
  }, [planExercises])

  const currentIndex = useMemo(() => {
    const idx = timeline.findIndex((t) => elapsedSeconds < t.endSec)
    return idx === -1 ? timeline.length - 1 : idx
  }, [timeline, elapsedSeconds])

  const currentEntry = timeline[currentIndex]
  const nextEntry = timeline[currentIndex + 1]
  const isSessionDone = elapsedSeconds >= totalSeconds

  const overallPct = totalSeconds > 0 ? Math.min(100, (elapsedSeconds / totalSeconds) * 100) : 0

  function goToIndex(index: number) {
    const target = timeline[Math.max(0, Math.min(timeline.length - 1, index))]
    jumpTo(target.startSec)
  }

  if (!currentEntry) {
    return (
      <div className="mx-auto max-w-md space-y-4 px-4 pb-24 pt-[calc(env(safe-area-inset-top)+1rem)]">
        <p className="text-center text-sm text-neutral-500">No exercises in this training yet.</p>
        <button
          type="button"
          onClick={onBuildPlan}
          className="w-full rounded-2xl bg-orange-500 py-3 text-sm font-bold text-white"
        >
          Build a training
        </button>
      </div>
    )
  }

  const { exercise: current } = currentEntry
  const remainingInSegment = Math.max(0, currentEntry.endSec - elapsedSeconds)
  const segmentDuration = currentEntry.endSec - currentEntry.startSec
  const segmentElapsed = Math.min(
    segmentDuration,
    Math.max(0, elapsedSeconds - currentEntry.startSec),
  )
  const segmentPct = segmentDuration > 0 ? (segmentElapsed / segmentDuration) * 100 : 0
  const currentStats = stats(current.id)

  function timeRangeLabel(startSec: number, endSec: number) {
    const fmt = (s: number) => `${Math.floor(s / 60)}:00`
    return `${fmt(startSec)} – ${fmt(endSec)}`
  }

  return (
    <div className="mx-auto max-w-md pb-24">
      <header className="sticky top-0 z-10 border-b border-black/10 bg-white/90 px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/90">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onBuildPlan}
            className="truncate text-left text-base font-bold text-neutral-900 dark:text-neutral-50"
          >
            {planEmoji} {planTitle} <span className="text-neutral-400">✎</span>
          </button>
          <span className="shrink-0 font-mono text-sm text-neutral-500 dark:text-neutral-400">
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

      <ExerciseTimeline
        exercises={planExercises}
        currentId={current.id}
        doneIds={new Set(timeline.filter((t) => t.endSec <= elapsedSeconds).map((t) => t.exercise.id))}
        onSelect={(e) => {
          const idx = timeline.findIndex((t) => t.exercise.id === e.id)
          if (idx !== -1) goToIndex(idx)
        }}
      />

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
            <ExerciseCard
              exercise={current}
              remainingLabel={formatClock(remainingInSegment)}
              timeRangeLabel={timeRangeLabel(currentEntry.startSec, currentEntry.endSec)}
              onRate={(value) => rate(current.id, value)}
              ratingAverage={currentStats.average}
              ratingCount={currentStats.count}
            />
            {nextEntry && (
              <div className="rounded-2xl border border-dashed border-black/15 px-4 py-3 text-sm text-neutral-500 dark:border-white/15 dark:text-neutral-400">
                Up next:{' '}
                <span className="font-semibold">
                  {nextEntry.exercise.emoji} {nextEntry.exercise.title}
                </span>
              </div>
            )}
          </>
        )}

        <div className="grid grid-cols-4 gap-2 pt-1">
          <button
            type="button"
            onClick={() => goToIndex(currentIndex - 1)}
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
            onClick={() => goToIndex(currentIndex + 1)}
            disabled={currentIndex === timeline.length - 1}
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
