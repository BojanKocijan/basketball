import { DEFAULT_SPORT_ID, type SportId } from './sports'

export interface Group {
  id: string
  label: string
  emoji: string
  /** Which sport this group trains — a club can run several sport sections at once. */
  sportId: SportId
}

/** Age/sport groups this app plans trainings for. Add more here as the club grows — a new
 * sport section is just another entry with a different sportId. */
export const GROUPS: Group[] = [{ id: 'u8', label: 'U8', emoji: '🏀', sportId: DEFAULT_SPORT_ID }]

export function groupInfo(id: string): Group {
  return GROUPS.find((g) => g.id === id) ?? GROUPS[0]
}
