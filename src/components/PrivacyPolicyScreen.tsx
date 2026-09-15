import { buildPrivacySections } from '../data/privacyPolicy'

const LAST_UPDATED = '2026-09-15'

/** Full-screen privacy/GDPR notice, opened from a "Privacy" link (see ClubHeader) rather than
 * shipped as a markdown file — parents and coaches can read it inside the app, before or after
 * unlocking a group. Same fixed-overlay pattern as PlanTrainingWizard. */
export function PrivacyPolicyScreen({ clubName, onClose }: { clubName: string; onClose: () => void }) {
  const sections = buildPrivacySections(clubName)

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-neutral-50 dark:bg-neutral-950">
      <header className="shrink-0 border-b border-black/10 bg-white px-4 py-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] dark:border-white/10 dark:bg-neutral-900">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-50">
              Privacy &amp; data (GDPR)
            </h2>
            <p className="text-xs text-neutral-400">Last updated {LAST_UPDATED}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-neutral-600 dark:border-white/10 dark:text-neutral-300"
          >
            Close
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto max-w-2xl space-y-5">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            This page explains what data {clubName} collects through this app, why, and what
            rights a parent or guardian has over it.
          </p>
          {sections.map((section) => (
            <section key={section.heading}>
              <h3 className="mb-1.5 text-sm font-bold text-neutral-900 dark:text-neutral-50">
                {section.heading}
              </h3>
              <div className="space-y-2">
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {p}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-600 dark:text-neutral-300">
                    {section.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}
