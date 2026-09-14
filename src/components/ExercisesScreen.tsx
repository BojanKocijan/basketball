import { useMemo, useState } from 'react'
import { exercises } from '../data/exercises'
import { useRatings } from '../hooks/useRatings'
import { ExerciseLibraryCard } from './ExerciseLibraryCard'

export function ExercisesScreen() {
  const [query, setQuery] = useState('')
  const { rate, stats } = useRatings()

  const trainable = exercises.filter((e) => !e.isBreak)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return trainable
    return trainable.filter(
      (e) => e.title.toLowerCase().includes(q) || e.goal.toLowerCase().includes(q),
    )
  }, [query, trainable])

  return (
    <div className="mx-auto max-w-md space-y-4 px-4 pb-24 pt-4">
      <header>
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">Exercise library</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          The full exercise library. Tap one to see the steps, run its timer, or rate it.
        </p>
      </header>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search an exercise…"
        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-100"
      />

      <div className="space-y-2">
        {filtered.map((exercise) => {
          const s = stats(exercise.id)
          return (
            <ExerciseLibraryCard
              key={exercise.id}
              exercise={exercise}
              onRate={(value) => rate(exercise.id, value)}
              ratingAverage={s.average}
              ratingCount={s.count}
            />
          )
        })}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-neutral-400">No matches.</p>
        )}
      </div>
    </div>
  )
}
