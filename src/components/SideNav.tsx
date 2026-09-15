import { TABS, type Tab } from '../data/tabs'

/** Desktop navigation — a left rail, sticky under the club header. Hidden below `lg`, where
 * BottomNav takes over; the two are mutually exclusive; not two navs at once. */
export function SideNav({
  active,
  onChange,
}: {
  active: Tab
  onChange: (tab: Tab) => void
}) {
  return (
    <nav
      className="sticky top-0 hidden w-56 shrink-0 flex-col gap-1 self-start border-r border-black/10
                 bg-white px-3 py-4 lg:flex lg:min-h-screen dark:border-white/10 dark:bg-neutral-900"
    >
      {TABS.map((tab) => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
              isActive
                ? 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300'
                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
            }`}
          >
            <span className="text-lg leading-none">{tab.emoji}</span>
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
