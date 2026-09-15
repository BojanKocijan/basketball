import { useGroups } from '../hooks/useGroups'
import type { useTrainerAccess } from '../hooks/useTrainerAccess'
import { GroupProgressSummary } from './GroupProgressSummary'
import { GroupSwitcher } from './GroupSwitcher'
import { PlayersSection } from './PlayersSection'
import { TrainerAccessBar } from './TrainerAccessBar'

export function PlayersScreen({
  groupId,
  setGroupId,
  trainerAccess,
}: {
  groupId: string
  setGroupId: (id: string) => void
  trainerAccess: ReturnType<typeof useTrainerAccess>
}) {
  const { groups } = useGroups()
  // Always unlocked here — the app-level gate in App.tsx (see LockScreen) never renders this
  // screen otherwise.
  const { lock, passcode } = trainerAccess

  return (
    <div className="mx-auto max-w-md space-y-4 px-4 pb-28 pt-4">
      <header>
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">Players</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          The kids in this group — nickname only, no real names — and how their training's going.
        </p>
      </header>

      <GroupSwitcher groups={groups} groupId={groupId} setGroupId={setGroupId} />

      <TrainerAccessBar onLock={lock} />

      <PlayersSection groupId={groupId} passcode={passcode} />

      <GroupProgressSummary groupId={groupId} />
    </div>
  )
}
