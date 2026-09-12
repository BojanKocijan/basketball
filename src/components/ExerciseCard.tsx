import type { Exercise } from '../data/exercises'
import { CategoryBadges } from './CategoryBadges'
import { RatingWidget } from './RatingWidget'

export function ExerciseCard({
  exercise,
  remainingLabel,
  timeRangeLabel,
  onRate,
  ratingAverage,
  ratingCount,
}: {
  exercise: Exercise
  remainingLabel: string
  timeRangeLabel: string
  onRate: (value: number) => void
  ratingAverage: number | null
  ratingCount: number
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-orange-600 dark:text-orange-400">
            {timeRangeLabel}
          </div>
          <h2 className="mt-1 flex items-center gap-2 text-xl font-bold text-neutral-900 dark:text-neutral-50">
            <span>{exercise.emoji}</span>
            {exercise.title}
          </h2>
          {exercise.subtitle && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{exercise.subtitle}</p>
          )}
        </div>
        <div className="shrink-0 rounded-2xl bg-neutral-900 px-3 py-2 text-center text-white dark:bg-white dark:text-neutral-900">
          <div className="font-mono text-lg font-bold leading-none">{remainingLabel}</div>
          <div className="text-[10px] uppercase tracking-wide opacity-70">left</div>
        </div>
      </div>

      {!exercise.isBreak && (
        <div className="mt-3">
          <CategoryBadges categories={exercise.categories} />
        </div>
      )}

      <p className="mt-3 rounded-xl bg-orange-50 px-3 py-2 text-sm font-medium text-orange-800 dark:bg-orange-500/10 dark:text-orange-300">
        🎯 {exercise.goal}
      </p>

      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-neutral-700 dark:text-neutral-300">
        {exercise.steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>

      {exercise.cues && exercise.cues.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {exercise.cues.map((cue) => (
            <span
              key={cue.nl}
              className="rounded-full border border-black/10 bg-neutral-50 px-3 py-1 text-xs text-neutral-700 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-300"
            >
              <span className="font-semibold">{cue.nl}</span>
              <span className="mx-1 text-neutral-400">·</span>
              {cue.en}
            </span>
          ))}
        </div>
      )}

      {!exercise.isBreak && (
        <div className="mt-4">
          <RatingWidget onRate={onRate} average={ratingAverage} count={ratingCount} />
        </div>
      )}
    </div>
  )
}
