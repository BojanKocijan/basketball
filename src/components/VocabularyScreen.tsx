import { useMemo, useState } from 'react'
import { vocabulary } from '../data/session'

export function VocabularyScreen() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return vocabulary
    return vocabulary.filter(
      (v) => v.nl.toLowerCase().includes(q) || v.en.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <div className="mx-auto max-w-md space-y-4 px-4 pb-24 pt-[calc(env(safe-area-inset-top)+1rem)]">
      <header>
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
          Core bilingual vocabulary
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Nederlands · English</p>
      </header>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search a word…"
        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-100"
      />

      <ul className="space-y-2">
        {filtered.map((v) => (
          <li
            key={v.nl}
            className="flex items-center justify-between rounded-2xl border border-black/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-neutral-900"
          >
            <span className="font-semibold text-neutral-900 dark:text-neutral-50">{v.nl}</span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">{v.en}</span>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="py-8 text-center text-sm text-neutral-400">No matches.</li>
        )}
      </ul>
    </div>
  )
}
