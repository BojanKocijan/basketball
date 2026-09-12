export const CATEGORIES = [
  { id: 'warmup', label: 'Warm-up & Fun', emoji: '🔥' },
  { id: 'dribbling', label: 'Dribbling', emoji: '⛹️' },
  { id: 'passing', label: 'Passing', emoji: '🤝' },
  { id: 'shooting', label: 'Shooting', emoji: '🎯' },
  { id: 'defense', label: 'Defense & Movement', emoji: '🛡️' },
  { id: 'agility', label: 'Agility & Coordination', emoji: '🏃' },
  { id: 'teamplay', label: 'Team Play & Game', emoji: '🏆' },
] as const

export type CategoryId = (typeof CATEGORIES)[number]['id']

export function categoryInfo(id: CategoryId) {
  return CATEGORIES.find((c) => c.id === id)!
}
