import type { Exercise } from '../data/exercises'

export function ExerciseTimeline({
  exercises,
  currentId,
  onSelect,
}: {
  exercises: Exercise[]
  currentId: string
  onSelect: (exercise: Exercise) => void
}) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-2 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {exercises.map((exercise) => {
        const isActive = exercise.id === currentId
        return (
          <button
            key={exercise.id}
            type="button"
            onClick={() => onSelect(exercise)}
            className={`flex shrink-0 flex-col items-center gap-1 rounded-2xl border px-3 py-2 text-center transition-colors ${
              isActive
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10'
                : 'border-black/10 bg-white dark:border-white/10 dark:bg-neutral-900'
            }`}
          >
            <span className="text-lg leading-none">{exercise.emoji}</span>
            <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400">
              {exercise.durationMinutes}′
            </span>
          </button>
        )
      })}
    </div>
  )
}
