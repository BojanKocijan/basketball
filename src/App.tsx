import { useMemo, useState } from 'react'
import { BottomNav, type Tab } from './components/BottomNav'
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

function App() {
  const [tab, setTab] = useState<Tab>('groups')
  const activePlan = useActivePlan()
  const { groupId } = useActiveGroup()
  const { nextPlan } = usePlans(groupId)

  // Prefer the shared, dated plan for this group (set up on the Groups tab) once one exists;
  // otherwise fall back to the local ad-hoc plan built on the Exercises tab.
  const sessionPlan = useMemo(() => {
    if (!nextPlan) return activePlan
    const planExercises = nextPlan.exercise_ids
      .map(findExercise)
      .filter((e): e is NonNullable<typeof e> => Boolean(e))
    return {
      ...activePlan,
      planTitle: `${groupInfo(nextPlan.group_id).label} · ${nextPlan.training_date}`,
      planEmoji: nextPlan.emoji,
      planExercises,
      totalMinutes: planExercises.reduce((sum, e) => sum + e.durationMinutes, 0),
    }
  }, [nextPlan, activePlan])

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {tab === 'setup' && <SetupScreen />}
      {tab === 'groups' && <GroupsScreen />}
      {tab === 'exercises' && (
        <ExercisesScreen activePlan={activePlan} onStartTraining={() => setTab('session')} />
      )}
      {tab === 'session' && (
        <SessionScreen activePlan={sessionPlan} onBuildPlan={() => setTab('exercises')} />
      )}
      {tab === 'vocabulary' && <VocabularyScreen />}
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}

export default App
