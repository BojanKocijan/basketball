import type { ApiGroup } from '../hooks/useGroups'

/** Shared group-picker chip row — used by every trainer-gated screen that's scoped to one
 * group (Groups, Players), so switching groups behaves identically everywhere. */
export function GroupSwitcher({
  groups,
  groupId,
  setGroupId,
}: {
  groups: ApiGroup[]
  groupId: string
  setGroupId: (id: string) => void
}) {
  // Available groups only — a coming_soon one has no content to switch into yet.
  const availableGroups = groups.filter((g) => g.status === 'available')

  return (
    <div className="flex flex-wrap gap-2">
      {availableGroups.map((g) => (
        <button
          key={g.id}
          type="button"
          onClick={() => setGroupId(g.id)}
          className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors ${
            g.id === groupId
              ? 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300'
              : 'border-black/10 bg-white text-neutral-600 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300'
          }`}
        >
          {g.emoji} {g.name}
        </button>
      ))}
    </div>
  )
}
