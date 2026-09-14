import { useState } from 'react'
import { GROUPS } from '../data/groups'
import { useActiveGroup } from '../hooks/useActiveGroup'
import { usePlans, type TrainingPlan } from '../hooks/usePlans'
import { useTrainerAccess } from '../hooks/useTrainerAccess'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import { formatDate } from '../utils/format'
import { PlanTrainingWizard } from './PlanTrainingWizard'

export function GroupsScreen() {
  const { groupId, setGroupId, group } = useActiveGroup()
  const { unlocked, checking, error: authError, tryUnlock, lock, passcode } = useTrainerAccess()
  const { upcoming, past, loading, error, createPlan, updatePlan, deletePlan } = usePlans(groupId)

  const [codeInput, setCodeInput] = useState('')
  const [rememberCode, setRememberCode] = useState(true)
  const [codeModalSkipped, setCodeModalSkipped] = useState(false)
  const [planning, setPlanning] = useState(false)
  const [editingPlan, setEditingPlan] = useState<TrainingPlan | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const [nextTraining, ...restUpcoming] = upcoming
  const formOpen = planning || editingPlan !== null

  function startPlanning() {
    setEditingPlan(null)
    setPlanning(true)
    setSaveError(null)
  }

  function startEditing(plan: TrainingPlan) {
    setPlanning(false)
    setEditingPlan(plan)
    setSaveError(null)
  }

  function closeForm() {
    setPlanning(false)
    setEditingPlan(null)
  }

  async function savePlan(date: string, exerciseIds: string[]) {
    setSaving(true)
    setSaveError(null)
    try {
      if (editingPlan) {
        await updatePlan(passcode(), editingPlan.id, date, `${group.label} training`, group.emoji, exerciseIds)
      } else {
        await createPlan(passcode(), date, `${group.label} training`, group.emoji, exerciseIds)
      }
      closeForm()
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Could not save training')
    } finally {
      setSaving(false)
    }
  }

  async function removePlan(id: string) {
    setRemovingId(id)
    try {
      await deletePlan(passcode(), id)
      if (editingPlan?.id === id) closeForm()
    } catch {
      // surfaced via the shared `error` from usePlans on next refresh
    } finally {
      setRemovingId(null)
    }
  }

  async function handleUnlock() {
    const ok = await tryUnlock(codeInput, rememberCode)
    if (ok) {
      setCodeInput('')
      setCodeModalSkipped(false)
    }
  }

  const showCodeModal = !unlocked && !codeModalSkipped

  return (
    <div className="mx-auto max-w-md space-y-4 px-4 pb-28 pt-4">
      <header>
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">Groups</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Pick a group, then plan next week's training together with the other trainers.
        </p>
      </header>

      {!isSupabaseConfigured && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
          Shared planning isn't set up yet — add <code>VITE_SUPABASE_URL</code> and{' '}
          <code>VITE_SUPABASE_ANON_KEY</code> (see <code>.env.example</code>) to connect a Supabase
          project.
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {GROUPS.map((g) => (
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
            {g.emoji} {g.label}
          </button>
        ))}
      </div>

      {!unlocked ? (
        <div className="flex items-center justify-between rounded-2xl border border-black/10 bg-white px-4 py-2.5 dark:border-white/10 dark:bg-neutral-900">
          <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
            🔒 Viewing only
          </span>
          <button
            type="button"
            onClick={() => setCodeModalSkipped(false)}
            className="text-xs font-bold text-orange-600"
          >
            Enter trainer code
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-2xl border border-black/10 bg-white px-4 py-2.5 dark:border-white/10 dark:bg-neutral-900">
          <span className="text-sm font-semibold text-green-700 dark:text-green-400">
            ✓ Trainer access unlocked
          </span>
          <button type="button" onClick={lock} className="text-xs font-semibold text-neutral-400">
            Lock
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600">Could not load plans: {error}</p>}

      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Next training
        </h2>
        {loading ? (
          <p className="text-sm text-neutral-400">Loading…</p>
        ) : !nextTraining ? (
          <p className="text-sm text-neutral-400">Nothing scheduled yet.</p>
        ) : (
          <div className="rounded-3xl border-2 border-orange-500 bg-orange-50 p-4 dark:bg-orange-500/10">
            <p className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
              {nextTraining.emoji} {formatDate(nextTraining.training_date)}
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              {nextTraining.exercise_ids.length} exercises · plan this with the other trainer
            </p>
            {unlocked && (
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => startEditing(nextTraining)}
                  className="text-xs font-bold text-orange-700 dark:text-orange-300"
                >
                  Edit
                </button>
                <button
                  type="button"
                  disabled={removingId === nextTraining.id}
                  onClick={() => removePlan(nextTraining.id)}
                  className="text-xs font-semibold text-red-500 disabled:opacity-50"
                >
                  {removingId === nextTraining.id ? '…' : 'Remove'}
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Also upcoming
          </h2>
          {unlocked && !formOpen && (
            <button type="button" onClick={startPlanning} className="text-xs font-bold text-orange-600">
              + Plan a training
            </button>
          )}
        </div>

        {!loading && restUpcoming.length === 0 ? (
          <p className="text-sm text-neutral-400">No other trainings scheduled.</p>
        ) : (
          <div className="space-y-2">
            {restUpcoming.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-2xl border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-neutral-900"
              >
                <div>
                  <p className="text-sm font-bold text-neutral-900 dark:text-neutral-50">
                    {p.emoji} {formatDate(p.training_date)}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {p.exercise_ids.length} exercises
                  </p>
                </div>
                {unlocked && (
                  <div className="flex shrink-0 gap-3">
                    <button
                      type="button"
                      onClick={() => startEditing(p)}
                      className="text-xs font-bold text-orange-600"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={removingId === p.id}
                      onClick={() => removePlan(p.id)}
                      className="text-xs font-semibold text-red-500 disabled:opacity-50"
                    >
                      {removingId === p.id ? '…' : 'Remove'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {formOpen && (
        <PlanTrainingWizard
          key={editingPlan?.id ?? 'new'}
          mode={editingPlan ? 'edit' : 'create'}
          initialDate={editingPlan?.training_date ?? ''}
          initialExerciseIds={editingPlan?.exercise_ids ?? []}
          groupLabel={group.label}
          saving={saving}
          saveError={saveError}
          onCancel={closeForm}
          onSave={savePlan}
        />
      )}

      {past.length > 0 && (
        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">Past</h2>
          <div className="space-y-2 opacity-60">
            {past
              .slice()
              .reverse()
              .map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-neutral-900"
                >
                  <p className="text-sm font-bold text-neutral-900 dark:text-neutral-50">
                    {p.emoji} {formatDate(p.training_date)}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {p.exercise_ids.length} exercises
                  </p>
                </div>
              ))}
          </div>
        </section>
      )}

      {showCodeModal && (
        <div className="fixed inset-0 z-20 flex items-end justify-center bg-black/40 px-4 pb-20 sm:items-center sm:pb-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-lg dark:bg-neutral-900">
            <p className="text-lg font-bold text-neutral-900 dark:text-neutral-50">Trainer code</p>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Enter the shared trainer code to plan or remove trainings. You can browse the
              upcoming trainings without it.
            </p>
            <input
              type="password"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="Code"
              autoFocus
              className="mt-3 w-full rounded-xl border border-black/10 px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-800"
            />
            <label className="mt-2 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <input
                type="checkbox"
                checked={rememberCode}
                onChange={(e) => setRememberCode(e.target.checked)}
              />
              Remember this code on this device
            </label>
            {authError && <p className="mt-1.5 text-xs font-semibold text-red-600">{authError}</p>}

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setCodeModalSkipped(true)}
                className="flex-1 rounded-xl border border-black/10 py-2.5 text-sm font-semibold text-neutral-600 dark:border-white/10 dark:text-neutral-300"
              >
                Skip for now
              </button>
              <button
                type="button"
                disabled={checking || !codeInput}
                onClick={handleUnlock}
                className="flex-1 rounded-xl bg-orange-500 py-2.5 text-sm font-bold text-white disabled:opacity-50"
              >
                {checking ? '…' : 'Unlock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
