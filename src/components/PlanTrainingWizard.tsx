import { useState } from 'react'
import { CATEGORIES, type CategoryId } from '../data/categories'
import { exercises, findExercise } from '../data/exercises'
import { formatDate } from '../utils/format'
import { SelectableExerciseCard } from './SelectableExerciseCard'

const STEPS = ['When?', 'Focus', 'Exercises', 'Review'] as const

export function PlanTrainingWizard({
  mode,
  initialDate,
  initialExerciseIds,
  groupLabel,
  saving,
  saveError,
  onCancel,
  onSave,
}: {
  mode: 'create' | 'edit'
  initialDate: string
  initialExerciseIds: string[]
  groupLabel: string
  saving: boolean
  saveError: string | null
  onCancel: () => void
  onSave: (date: string, exerciseIds: string[]) => void
}) {
  const [step, setStep] = useState(1)
  const [date, setDate] = useState(initialDate)
  const [activeCategories, setActiveCategories] = useState<CategoryId[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set(initialExerciseIds))

  const trainable = exercises.filter((e) => !e.isBreak)
  const filtered =
    activeCategories.length === 0
      ? trainable
      : trainable.filter((e) => e.categories.some((c) => activeCategories.includes(c)))
  const selectedExercises = [...selected].map(findExercise).filter((e): e is NonNullable<typeof e> => Boolean(e))
  const selectedMinutes = selectedExercises.reduce((sum, e) => sum + e.durationMinutes, 0)

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleCategory(id: CategoryId) {
    setActiveCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  const canGoNext = step === 1 ? Boolean(date) : step === 3 ? selected.size > 0 : true

  return (
    <section className="space-y-4 rounded-3xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
      <div>
        <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-50">
          {mode === 'edit' ? 'Edit training' : 'Plan a training'}
        </h2>
        <div className="mt-2 flex items-center gap-1.5">
          {STEPS.map((label, i) => {
            const n = i + 1
            return (
              <div
                key={label}
                className={`h-1.5 flex-1 rounded-full ${
                  n <= step ? 'bg-orange-500' : 'bg-neutral-200 dark:bg-neutral-700'
                }`}
              />
            )
          })}
        </div>
        <p className="mt-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Step {step} of {STEPS.length} · {STEPS[step - 1]}
        </p>
      </div>

      {step === 1 && (
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Training date
          </label>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDate(e.target.value)}
            autoFocus
            className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-800"
          />
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="mb-2 text-sm text-neutral-500 dark:text-neutral-400">
            Optionally narrow the exercise list to a focus for this training.
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = activeCategories.includes(cat.id)
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
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
        </div>
      )}

      {step === 3 && (
        <div>
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {filtered.map((ex) => (
              <SelectableExerciseCard
                key={ex.id}
                exercise={ex}
                selected={selected.has(ex.id)}
                onToggle={() => toggleSelect(ex.id)}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
            {selected.size} selected · {selectedMinutes}′
          </p>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-3">
          <div className="rounded-2xl border border-black/10 bg-neutral-50 px-4 py-3 dark:border-white/10 dark:bg-neutral-800/60">
            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-50">
              {groupLabel} · {formatDate(date)}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {selected.size} exercises · {selectedMinutes}′ total
            </p>
          </div>
          <ul className="space-y-1.5">
            {selectedExercises.map((ex) => (
              <li
                key={ex.id}
                className="flex items-center justify-between rounded-xl border border-black/10 px-3 py-2 text-sm dark:border-white/10"
              >
                <span>
                  {ex.emoji} {ex.title}
                </span>
                <span className="text-xs text-neutral-400">{ex.durationMinutes}′</span>
              </li>
            ))}
          </ul>
          {saveError && <p className="text-xs font-semibold text-red-600">{saveError}</p>}
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={step === 1 ? onCancel : () => setStep((s) => s - 1)}
          className="flex-1 rounded-xl border border-black/10 py-2.5 text-sm font-semibold text-neutral-600 dark:border-white/10 dark:text-neutral-300"
        >
          {step === 1 ? 'Cancel' : 'Back'}
        </button>
        {step < STEPS.length ? (
          <button
            type="button"
            disabled={!canGoNext}
            onClick={() => setStep((s) => s + 1)}
            className="flex-1 rounded-xl bg-orange-500 py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            disabled={saving}
            onClick={() => onSave(date, [...selected])}
            className="flex-1 rounded-xl bg-orange-500 py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            {saving ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Save training'}
          </button>
        )}
      </div>
    </section>
  )
}
