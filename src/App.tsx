import { useState } from 'react'
import { BottomNav, type Tab } from './components/BottomNav'
import { ExercisesScreen } from './components/ExercisesScreen'
import { SessionScreen } from './components/SessionScreen'
import { SetupScreen } from './components/SetupScreen'
import { VocabularyScreen } from './components/VocabularyScreen'
import { useActivePlan } from './hooks/useActivePlan'

function App() {
  const [tab, setTab] = useState<Tab>('session')
  const activePlan = useActivePlan()

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {tab === 'setup' && <SetupScreen />}
      {tab === 'exercises' && (
        <ExercisesScreen activePlan={activePlan} onStartTraining={() => setTab('session')} />
      )}
      {tab === 'session' && (
        <SessionScreen activePlan={activePlan} onBuildPlan={() => setTab('exercises')} />
      )}
      {tab === 'vocabulary' && <VocabularyScreen />}
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}

export default App
