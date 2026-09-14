export interface Sport {
  id: string
  label: string
  emoji: string
}

/** Sports this app can run training plans for. Basketball is the first; add more here as
 * the club/product grows into other sports (see the "Generalize to any-sport" milestone). */
export const SPORTS: Sport[] = [{ id: 'basketball', label: 'Basketball', emoji: '🏀' }]

export type SportId = (typeof SPORTS)[number]['id']

/** The sport this deployment runs today. Once a club's sport comes from the database
 * (clubs.sport_id) instead of being implicit, this becomes that lookup's fallback. */
export const DEFAULT_SPORT_ID: SportId = 'basketball'

export function sportInfo(id: SportId): Sport {
  return SPORTS.find((s) => s.id === id) ?? SPORTS[0]
}
