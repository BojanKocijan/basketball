export type Tab = 'setup' | 'groups' | 'exercises' | 'session' | 'vocabulary'

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'setup', label: 'Setup', emoji: '📋' },
  { id: 'groups', label: 'Groups', emoji: '👥' },
  { id: 'exercises', label: 'Exercises', emoji: '🏀' },
  { id: 'session', label: 'Session', emoji: '⏱️' },
  { id: 'vocabulary', label: 'Words', emoji: '💬' },
]

export function BottomNav({
  active,
  onChange,
}: {
  active: Tab
  onChange: (tab: Tab) => void
}) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 border-t border-black/10 bg-white/95 backdrop-blur
                 pb-[env(safe-area-inset-bottom)] dark:border-white/10 dark:bg-neutral-900/95"
    >
      <div className="mx-auto flex max-w-md">
        {TABS.map((tab) => {
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors ${
                isActive
                  ? 'text-orange-600 dark:text-orange-400'
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              <span className="text-xl leading-none">{tab.emoji}</span>
              {tab.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
