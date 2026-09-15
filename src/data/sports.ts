export interface Sport {
  id: string
  label: string
  emoji: string
}

/** Sports this app can run training plans for. Basketball is the first; add more here as
 * the product grows into other sports (see the "Generalize to any-sport" milestone). */
export const SPORTS: Sport[] = [{ id: 'basketball', label: 'Basketball', emoji: '🏀' }]

export type SportId = (typeof SPORTS)[number]['id']

/** The sport this deployment runs today, used wherever there's no active group yet to read
 * sportId from (see useGroups/group_templates, which is where sport actually lives per group). */
export const DEFAULT_SPORT_ID: SportId = 'basketball'

export function sportInfo(id: SportId): Sport {
  return SPORTS.find((s) => s.id === id) ?? SPORTS[0]
}
