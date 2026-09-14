import { coachRoles, coachingPrinciples, setupChecklist } from '../data/coaching'
import { useChecklist } from '../hooks/useChecklist'

export function SetupScreen() {
  const { checked, toggle, resetAll } = useChecklist('u8-setup-checklist', setupChecklist.length)
  const doneCount = checked.filter(Boolean).length

  return (
    <div className="mx-auto max-w-md space-y-6 px-4 pb-24 pt-[calc(env(safe-area-inset-top)+1rem)]">
      <header>
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
          Before the children arrive
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Group: 8–10 children · Main goals: have fun, learn names, dribble, pass, shoot, finish
          as a team.
        </p>
      </header>

      <section className="rounded-3xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-neutral-900 dark:text-neutral-50">Set up checklist</h2>
          <span className="text-xs font-semibold text-neutral-400">
            {doneCount}/{setupChecklist.length}
          </span>
        </div>
        <ul className="mt-3 space-y-2">
          {setupChecklist.map((item, i) => (
            <li key={item}>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl px-2 py-2 active:bg-neutral-100 dark:active:bg-neutral-800">
                <input
                  type="checkbox"
                  checked={checked[i]}
                  onChange={() => toggle(i)}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-orange-500"
                />
                <span
                  className={`text-sm ${checked[i] ? 'text-neutral-400 line-through' : 'text-neutral-700 dark:text-neutral-200'}`}
                >
                  {item}
                </span>
              </label>
            </li>
          ))}
        </ul>
        {doneCount > 0 && (
          <button
            type="button"
            onClick={resetAll}
            className="mt-2 text-xs font-semibold text-neutral-400 active:text-neutral-600"
          >
            Clear checklist
          </button>
        )}
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
        <h2 className="font-semibold text-neutral-900 dark:text-neutral-50">Coach roles</h2>
        <ul className="mt-3 space-y-2">
          {coachRoles.map((r) => (
            <li key={r.role} className="text-sm text-neutral-700 dark:text-neutral-200">
              <span className="font-semibold text-orange-600 dark:text-orange-400">{r.role}:</span>{' '}
              {r.description}
            </li>
          ))}
        </ul>
        <p className="mt-3 rounded-xl bg-orange-50 px-3 py-2 text-sm font-medium text-orange-800 dark:bg-orange-500/10 dark:text-orange-300">
          Demonstrate first; speak second. Use the same hand signals and key words in both
          languages.
        </p>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
        <h2 className="font-semibold text-neutral-900 dark:text-neutral-50">
          Coaching principles
        </h2>
        <ul className="mt-3 space-y-1.5">
          {coachingPrinciples.map((p) => (
            <li key={p} className="flex gap-2 text-sm text-neutral-700 dark:text-neutral-200">
              <span className="text-orange-500">•</span>
              {p}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-neutral-900">
        <h2 className="font-semibold text-neutral-900 dark:text-neutral-50">Privacy</h2>
        <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-200">
          This app stores no names, photos, or any information about the children who attend
          training. Shared training plans (just a date, a group, and which exercises) live in a
          shared database, unlocked by a team-wide trainer code — not a personal account.
          Everything else (ratings, your setup checklist) stays only on your own device.
        </p>
        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          Full details in <code>PRIVACY.md</code> in the project repository.
        </p>
      </section>
    </div>
  )
}
