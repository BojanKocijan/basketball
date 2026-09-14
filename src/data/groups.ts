export interface Group {
  id: string
  label: string
  emoji: string
}

/** Age groups this app plans trainings for. Add more here as the club grows. */
export const GROUPS: Group[] = [{ id: 'u8', label: 'U8', emoji: '🏀' }]

export function groupInfo(id: string): Group {
  return GROUPS.find((g) => g.id === id) ?? GROUPS[0]
}
