import { useMemo, useState } from 'react'
import { BottomNav, type Tab } from './components/BottomNav'
import { ClubHeader } from './components/ClubHeader'
import { ExercisesScreen } from './components/ExercisesScreen'
import { GroupsScreen } from './components/GroupsScreen'
import { SessionScreen } from './components/SessionScreen'
import { SetupScreen } from './components/SetupScreen'
import { VocabularyScreen } from './components/VocabularyScreen'
import { findExercise } from './data/exercises'
import { groupInfo } from './data/groups'
import { useActiveGroup } from './hooks/useActiveGroup'
import { useActivePlan } from './hooks/useActivePlan'
import { usePlans } from './hooks/usePlans'
import { useTrainerAccess } from './hooks/useTrainerAccess'
import { formatDate } from './utils/format'

function App() {
  const [tab, setTab] = useState<Tab>('groups')
  const activePlan = useActivePlan()
  const { groupId } = useActiveGroup()
  const { nextPlan } = usePlans(groupId)
  // Shared across tabs so a trainer code entered on Groups also unlocks session controls.
  const trainerAccess = useTrainerAccess()

  // Prefer the shared, dated plan for this group (set up on the Groups tab) once one exists;
  // otherwise fall back to the default full session.
  const sessionPlan = useMemo(() => {
    if (!nextPlan) return activePlan
    const planExercises = nextPlan.exercise_ids
      .map(findExercise)
      .filter((e): e is NonNullable<typeof e> => Boolean(e))
    return {
      ...activePlan,
      planTitle: `${groupInfo(nextPlan.group_id).label} · ${formatDate(nextPlan.training_date)}`,
      planEmoji: nextPlan.emoji,
      planExercises,
      totalMinutes: planExercises.reduce((sum, e) => sum + e.durationMinutes, 0),
    }
  }, [nextPlan, activePlan])

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <ClubHeader />
      {tab === 'setup' && <SetupScreen />}
      {tab === 'groups' && <GroupsScreen trainerAccess={trainerAccess} />}
      {tab === 'library' && <ExercisesScreen />}
      {tab === 'session' && (
        <SessionScreen
          activePlan={sessionPlan}
          groupId={groupId}
          trainerAccess={trainerAccess}
          onBuildPlan={() => setTab('groups')}
        />
      )}
      {tab === 'vocabulary' && <VocabularyScreen />}
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}

export default App
