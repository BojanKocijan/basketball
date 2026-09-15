import { useEffect, useRef, useState } from 'react'
import type { ApiGroup } from '../hooks/useGroups'

/** Top-left dropdown for switching the active group — replaces what used to be a row of chips
 * repeated inline on both the Players and Groups/Training-planner screens. Shown once, globally,
 * in ClubHeader instead. Only relevant once unlocked (see App.tsx) — pre-unlock, LockScreen has
 * its own group picker for a different purpose (choosing which group's passcode to enter). */
export function GroupMenu({
  groups,
  groupId,
  setGroupId,
}: {
  groups: ApiGroup[]
  groupId: string
  setGroupId: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const active = groups.find((g) => g.id === groupId)
  const availableGroups = groups.filter((g) => g.status === 'available')

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  if (groups.length === 0) return null

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full border border-black/10 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-200"
      >
        <span>{active?.emoji ?? '🏀'}</span>
        {active?.name ?? groupId}
        <span className="text-neutral-400">▾</span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-30 mt-1 min-w-full overflow-hidden rounded-2xl border border-black/10 bg-white py-1 shadow-lg dark:border-white/10 dark:bg-neutral-900"
        >
          {availableGroups.map((g) => (
            <li key={g.id}>
              <button
                type="button"
                role="option"
                aria-selected={g.id === groupId}
                onClick={() => {
                  setGroupId(g.id)
                  setOpen(false)
                }}
                className={`flex w-full items-center gap-2 whitespace-nowrap px-3 py-2 text-left text-sm font-semibold transition-colors ${
                  g.id === groupId
                    ? 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300'
                    : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-800'
                }`}
              >
                <span>{g.emoji}</span>
                {g.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
