import type { SportId } from './sports'
import { DEFAULT_SPORT_ID } from './sports'

interface CategoryDef {
  id: string
  label: string
  emoji: string
}

/** Training categories, per sport — what a session can focus on. Basketball is the only
 * sport with content today; add a new key here when a sport (see ./sports) gets exercises. */
const CATEGORIES_BY_SPORT: Record<SportId, CategoryDef[]> = {
  basketball: [
    { id: 'warmup', label: 'Warm-up & Fun', emoji: '🔥' },
    { id: 'dribbling', label: 'Dribbling', emoji: '⛹️' },
    { id: 'passing', label: 'Passing', emoji: '🤝' },
    { id: 'shooting', label: 'Shooting', emoji: '🎯' },
    { id: 'defense', label: 'Defense & Movement', emoji: '🛡️' },
    { id: 'agility', label: 'Agility & Coordination', emoji: '🏃' },
    { id: 'teamplay', label: 'Team Play & Game', emoji: '🏆' },
  ],
}

/** Categories for the app's current sport. Once a club can run more than one sport at a
 * time, this becomes a lookup by the active group's sportId instead of the default. */
export const CATEGORIES = CATEGORIES_BY_SPORT[DEFAULT_SPORT_ID]

export type CategoryId = (typeof CATEGORIES)[number]['id']

export function categoriesForSport(sportId: SportId): CategoryDef[] {
  return CATEGORIES_BY_SPORT[sportId] ?? []
}

export function categoryInfo(id: CategoryId) {
  return CATEGORIES.find((c) => c.id === id)!
}
