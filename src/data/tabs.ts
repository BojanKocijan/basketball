export type Tab = 'setup' | 'groups' | 'players' | 'library' | 'session' | 'vocabulary'

export const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'setup', label: 'Setup', emoji: '📋' },
  { id: 'groups', label: 'Groups', emoji: '👥' },
  { id: 'players', label: 'Players', emoji: '🧒' },
  { id: 'library', label: 'Library', emoji: '🏀' },
  { id: 'session', label: 'Session', emoji: '⏱️' },
  { id: 'vocabulary', label: 'Words', emoji: '💬' },
]
