import { useState } from 'react'
import { CATEGORIES, type CategoryId } from '../data/categories'
import { exercises } from '../data/exercises'
import { GROUPS } from '../data/groups'
import { useActiveGroup } from '../hooks/useActiveGroup'
import { usePlans } from '../hooks/usePlans'
import { useTrainerAccess } from '../hooks/useTrainerAccess'
import { isSupabaseConfigured } from '../lib/supabaseClient'

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })
}

export function GroupsScreen() {
  const { groupId, setGroupId, group } = useActiveGroup()
  const { unlocked, checking, error: authError, tryUnlock, lock, passcode } = useTrainerAccess()
  const { upcoming, past, loading, error, createPlan, deletePlan } = usePlans(groupId)

  const [codeInput, setCodeInput] = useState('')
  const [planning, setPlanning] = useState(false)
  const [date, setDate] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [activeCategories, setActiveCategories] = useState<CategoryId[]>([])
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const trainable = exercises.filter((e) => !e.isBreak)
  const filtered =
    activeCategories.length === 0
      ? trainable
      : trainable.filter((e) => e.categories.some((c) => activeCategories.includes(c)))
  const selectedMinutes = trainable
    .filter((e) => selected.has(e.id))
    .reduce((sum, e) => sum + e.durationMinutes, 0)

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function startPlanning() {
    setPlanning(true)
    setDate('')
    setSelected(new Set())
    setSaveError(null)
  }

  async function savePlan() {
    if (!date || selected.size === 0) return
    setSaving(true)
    setSaveError(null)
    try {
      await createPlan(passcode(), date, `${group.label} training`, group.emoji, [...selected], '')
      setPlanning(false)
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
    } catch {
      // surfaced via the shared `error` from usePlans on next refresh
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4 px-4 pb-28 pt-[calc(env(safe-area-inset-top)+1rem)]">
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
        <div className="rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
          <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Trainer code</p>
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
            Enter the shared trainer code to plan or remove trainings.
          </p>
          <div className="mt-2 flex gap-2">
            <input
              type="password"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="Code"
              className="min-w-0 flex-1 rounded-xl border border-black/10 px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-800"
            />
            <button
              type="button"
              disabled={checking || !codeInput}
              onClick={() => tryUnlock(codeInput)}
              className="shrink-0 rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
            >
              {checking ? '…' : 'Unlock'}
            </button>
          </div>
          {authError && <p className="mt-1.5 text-xs font-semibold text-red-600">{authError}</p>}
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
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Upcoming</h2>
          {unlocked && !planning && (
            <button type="button" onClick={startPlanning} className="text-xs font-bold text-orange-600">
              + Plan a training
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-sm text-neutral-400">Loading…</p>
        ) : upcoming.length === 0 && !planning ? (
          <p className="text-sm text-neutral-400">No trainings scheduled yet.</p>
        ) : (
          <div className="space-y-2">
            {upcoming.map((p) => (
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
                  <button
                    type="button"
                    disabled={removingId === p.id}
                    onClick={() => removePlan(p.id)}
                    className="shrink-0 text-xs font-semibold text-red-500 disabled:opacity-50"
                  >
                    {removingId === p.id ? '…' : 'Remove'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {planning && (
        <section className="space-y-3 rounded-3xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Training date
            </label>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 text-sm dark:border-white/10 dark:bg-neutral-800"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = activeCategories.includes(cat.id)
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    setActiveCategories((prev) =>
                      prev.includes(cat.id) ? prev.filter((c) => c !== cat.id) : [...prev, cat.id],
                    )
                  }
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300'
                      : 'border-black/10 bg-white text-neutral-600 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300'
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              )
            })}
          </div>

          <div className="max-h-64 space-y-1.5 overflow-y-auto">
            {filtered.map((ex) => (
              <label
                key={ex.id}
                className="flex items-center gap-2 rounded-xl border border-black/10 px-3 py-2 text-sm dark:border-white/10"
              >
                <input
                  type="checkbox"
                  checked={selected.has(ex.id)}
                  onChange={() => toggleSelect(ex.id)}
                  className="shrink-0"
                />
                <span>{ex.emoji}</span>
                <span className="min-w-0 flex-1 truncate">{ex.title}</span>
                <span className="shrink-0 text-xs text-neutral-400">{ex.durationMinutes}′</span>
              </label>
            ))}
          </div>

          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {selected.size} selected · {selectedMinutes}′
          </p>
          {saveError && <p className="text-xs font-semibold text-red-600">{saveError}</p>}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPlanning(false)}
              className="flex-1 rounded-xl border border-black/10 py-2.5 text-sm font-semibold text-neutral-600 dark:border-white/10 dark:text-neutral-300"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!date || selected.size === 0 || saving}
              onClick={savePlan}
              className="flex-1 rounded-xl bg-orange-500 py-2.5 text-sm font-bold text-white disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save training'}
            </button>
          </div>
        </section>
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
    </div>
  )
}
