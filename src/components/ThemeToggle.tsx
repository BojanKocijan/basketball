import { useTheme, type ThemePreference } from '../hooks/useTheme'

const OPTIONS: { id: ThemePreference; label: string; emoji: string }[] = [
  { id: 'light', label: 'Light', emoji: '☀️' },
  { id: 'dark', label: 'Dark', emoji: '🌙' },
  { id: 'system', label: 'System', emoji: '🖥️' },
]

/** Three-way Light/Dark/System switch — see useTheme.ts for how the choice is applied and
 * persisted. Icon-only by default; each button carries its label for screen readers/tooltip. */
export function ThemeToggle() {
  const { preference, setPreference } = useTheme()

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="flex shrink-0 gap-0.5 rounded-full border border-black/10 bg-neutral-50 p-0.5 dark:border-white/10 dark:bg-neutral-900"
    >
      {OPTIONS.map((opt) => {
        const isActive = opt.id === preference
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={opt.label}
            title={opt.label}
            onClick={() => setPreference(opt.id)}
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs leading-none transition-colors ${
              isActive
                ? 'bg-white shadow-sm dark:bg-neutral-700'
                : 'opacity-50 hover:opacity-80'
            }`}
          >
            {opt.emoji}
          </button>
        )
      })}
    </div>
  )
}
