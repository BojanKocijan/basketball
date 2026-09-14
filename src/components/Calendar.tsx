import { useState } from 'react'
import { toLocalIso } from '../utils/format'

const WEEKDAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function monthLabel(d: Date) {
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

/** Mon-first day-of-week index (0 = Monday .. 6 = Sunday) for a JS Date. */
function mondayIndex(d: Date) {
  return (d.getDay() + 6) % 7
}

export function Calendar({
  value,
  onChange,
  markedDates,
  disabledDates,
  minDate,
}: {
  value: string
  onChange: (iso: string) => void
  /** Dates (YYYY-MM-DD) that already have something scheduled — shown with a dot badge. */
  markedDates: Set<string>
  /** Dates that can't be picked (e.g. already taken for this group) — shown struck through. */
  disabledDates: Set<string>
  /** Earliest selectable date (YYYY-MM-DD), inclusive. Defaults to today. */
  minDate?: string
}) {
  const min = minDate ?? toLocalIso(new Date())
  const initialMonth = value ? new Date(`${value}T00:00:00`) : new Date(`${min}T00:00:00`)
  const [viewMonth, setViewMonth] = useState(new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1))

  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()
  const firstOfMonth = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const leadingBlanks = mondayIndex(firstOfMonth)

  const cells: (Date | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ]

  function goToPrevMonth() {
    setViewMonth(new Date(year, month - 1, 1))
  }

  function goToNextMonth() {
    setViewMonth(new Date(year, month + 1, 1))
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-neutral-900">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={goToPrevMonth}
          aria-label="Previous month"
          className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 active:bg-neutral-100 dark:text-neutral-400 dark:active:bg-neutral-800"
        >
          ‹
        </button>
        <p className="text-sm font-bold text-neutral-900 dark:text-neutral-50">{monthLabel(viewMonth)}</p>
        <button
          type="button"
          onClick={goToNextMonth}
          aria-label="Next month"
          className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 active:bg-neutral-100 dark:text-neutral-400 dark:active:bg-neutral-800"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-neutral-400">
        {WEEKDAY_LABELS.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={`blank-${i}`} />
          const iso = toLocalIso(d)
          const isSelected = iso === value
          const isMarked = markedDates.has(iso)
          const isDisabled = iso < min || disabledDates.has(iso)

          return (
            <button
              key={iso}
              type="button"
              disabled={isDisabled}
              onClick={() => onChange(iso)}
              className={`relative flex h-10 flex-col items-center justify-center rounded-xl text-sm font-medium transition-colors ${
                isSelected
                  ? 'bg-orange-500 text-white'
                  : isDisabled
                    ? 'text-neutral-300 dark:text-neutral-700'
                    : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800'
              }`}
            >
              {d.getDate()}
              {isMarked && (
                <span
                  aria-hidden
                  className={`absolute bottom-1 h-1 w-1 rounded-full ${
                    isSelected ? 'bg-white' : 'bg-orange-500'
                  }`}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
