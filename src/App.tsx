import { useState } from 'react'
import { BottomNav, type Tab } from './components/BottomNav'
import { SessionScreen } from './components/SessionScreen'
import { SetupScreen } from './components/SetupScreen'
import { VocabularyScreen } from './components/VocabularyScreen'

function App() {
  const [tab, setTab] = useState<Tab>('session')

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {tab === 'setup' && <SetupScreen />}
      {tab === 'session' && <SessionScreen />}
      {tab === 'vocabulary' && <VocabularyScreen />}
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}

export default App
