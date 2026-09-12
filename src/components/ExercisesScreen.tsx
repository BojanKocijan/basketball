import { useState } from 'react'
import { CATEGORIES, type CategoryId } from '../data/categories'
import { exercises } from '../data/exercises'
import { focusPresets, fullU8Session } from '../data/plans'
import type { useActivePlan } from '../hooks/useActivePlan'
import { useRatings } from '../hooks/useRatings'
import { ExerciseLibraryCard } from './ExerciseLibraryCard'

export function ExercisesScreen({
  activePlan,
  onStartTraining,
}: {
  activePlan: ReturnType<typeof useActivePlan>
  onStartTraining: () => void
}) {
  const [activeCategories, setActiveCategories] = useState<CategoryId[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const { setActivePlan } = activePlan
  const { rate, stats } = useRatings()

  const trainable = exercises.filter((e) => !e.isBreak)

  const filtered =
    activeCategories.length === 0
      ? trainable
      : trainable.filter((e) => e.categories.some((c) => activeCategories.includes(c)))

  function toggleCategory(id: CategoryId) {
    setActiveCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    )
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function applyPreset(preset: (typeof focusPresets)[number]) {
    setActiveCategories(preset.categories)
    const matchIds = trainable
      .filter((e) => e.categories.some((c) => preset.categories.includes(c)))
      .map((e) => e.id)
    setSelected(new Set(matchIds))
  }

  function selectAllFiltered() {
    setSelected(new Set(filtered.map((e) => e.id)))
  }

  function clearSelection() {
    setSelected(new Set())
  }

  const selectedIds = trainable.filter((e) => selected.has(e.id)).map((e) => e.id)
  const selectedMinutes = trainable
    .filter((e) => selected.has(e.id))
    .reduce((sum, e) => sum + e.durationMinutes, 0)

  function startSelected() {
    if (selectedIds.length === 0) return
    const title =
      activeCategories.length > 0
        ? `Focus: ${activeCategories.map((c) => CATEGORIES.find((cc) => cc.id === c)?.label).join(' + ')}`
        : 'Custom training'
    setActivePlan(title, '🏀', selectedIds)
    onStartTraining()
  }

  function startFullSession() {
    setActivePlan(fullU8Session.title, fullU8Session.emoji, fullU8Session.exerciseIds)
    onStartTraining()
  }

  return (
    <div className="mx-auto max-w-md space-y-4 px-4 pb-28 pt-[calc(env(safe-area-inset-top)+1rem)]">
      <header>
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">Exercises</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Pick a focus, build a training, and rate how the kids liked each exercise.
        </p>
      </header>

      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Quick start
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={startFullSession}
            className="rounded-full bg-neutral-900 px-3.5 py-2 text-sm font-semibold text-white dark:bg-white dark:text-neutral-900"
          >
            🏀 Full U8 Session (60′)
          </button>
          {focusPresets.map((preset) => (
            <button
              key={preset.title}
              type="button"
              onClick={() => applyPreset(preset)}
              className="rounded-full border border-black/10 bg-white px-3.5 py-2 text-sm font-semibold text-neutral-700 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-200"
            >
              {preset.emoji} {preset.title}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Filter by category
        </h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const active = activeCategories.includes(cat.id)
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300'
                    : 'border-black/10 bg-white text-neutral-600 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300'
                }`}
              >
                {cat.emoji} {cat.label}
              </button>
            )
          })}
        </div>
      </section>

      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span>
          {filtered.length} exercise{filtered.length === 1 ? '' : 's'}
        </span>
        <div className="flex gap-3">
          <button type="button" onClick={selectAllFiltered} className="font-semibold text-orange-600">
            Select all
          </button>
          {selected.size > 0 && (
            <button type="button" onClick={clearSelection} className="font-semibold text-neutral-400">
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((exercise) => {
          const s = stats(exercise.id)
          return (
            <ExerciseLibraryCard
              key={exercise.id}
              exercise={exercise}
              selected={selected.has(exercise.id)}
              onToggleSelect={() => toggleSelect(exercise.id)}
              onRate={(value) => rate(exercise.id, value)}
              ratingAverage={s.average}
              ratingCount={s.count}
            />
          )
        })}
      </div>

      {selected.size > 0 && (
        <div className="fixed inset-x-0 bottom-14 z-10 border-t border-black/10 bg-white/95 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-neutral-900/95">
          <div className="mx-auto flex max-w-md items-center justify-between gap-3">
            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
              {selected.size} selected · {selectedMinutes}′
            </span>
            <button
              type="button"
              onClick={startSelected}
              className="rounded-2xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white active:bg-orange-600"
            >
              Start training ▶
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
