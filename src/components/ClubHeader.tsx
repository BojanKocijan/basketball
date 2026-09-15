import { useState } from 'react'
import { useClub } from '../hooks/useClub'
import { DEFAULT_SPORT_ID, sportInfo } from '../data/sports'
import { ThemeToggle } from './ThemeToggle'

export function ClubHeader() {
  const club = useClub()
  const [logoFailed, setLogoFailed] = useState(false)

  return (
    <div className="flex items-center justify-between gap-2 border-b border-black/10 bg-white px-4 py-2 pt-[calc(env(safe-area-inset-top)+0.5rem)] dark:border-white/10 dark:bg-neutral-950">
      <div className="flex min-w-0 items-center gap-2">
        {club.logoUrl && !logoFailed ? (
          <img
            src={`${import.meta.env.BASE_URL}${club.logoUrl}`}
            alt={`${club.name} logo`}
            className="h-6 w-6 shrink-0 rounded-full object-contain"
            onError={() => setLogoFailed(true)}
          />
        ) : (
          <span className="shrink-0 text-base leading-none">{sportInfo(DEFAULT_SPORT_ID).emoji}</span>
        )}
        <span className="truncate text-xs font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          {club.name}
        </span>
      </div>
      <ThemeToggle />
    </div>
  )
}
