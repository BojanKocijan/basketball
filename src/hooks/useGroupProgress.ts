import { useCallback, useEffect, useState } from 'react'
import { api, isApiConfigured } from '../lib/apiClient'

interface RawProgressRow {
  rating: number
  created_at: string
  skill_categories: { id: string; label: string; emoji: string } | null
}

export interface CategoryProgress {
  categoryId: string
  label: string
  emoji: string
  average: number
  count: number
  lastRatedAt: string
}

/** Rolls up every rating logged for a group's current players into one average per skill
 * category — the "individual players as a team" payoff (see sports-training-api's
 * GET /groups/:id/progress). Raw rows in, aggregate out; the API deliberately doesn't
 * pre-aggregate so this is where that shape gets decided. */
export function useGroupProgress(groupId: string) {
  const [rows, setRows] = useState<RawProgressRow[]>([])
  const [loading, setLoading] = useState(isApiConfigured)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!isApiConfigured) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const data = await api.get<RawProgressRow[]>(`/groups/${encodeURIComponent(groupId)}/progress`)
      setError(null)
      setRows(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load progress')
    } finally {
      setLoading(false)
    }
  }, [groupId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const byCategory: CategoryProgress[] = Array.from(
    rows.reduce((map, row) => {
      const cat = row.skill_categories
      if (!cat) return map
      const entry = map.get(cat.id) ?? {
        categoryId: cat.id,
        label: cat.label,
        emoji: cat.emoji,
        sum: 0,
        count: 0,
        lastRatedAt: row.created_at,
      }
      entry.sum += row.rating
      entry.count += 1
      if (row.created_at > entry.lastRatedAt) entry.lastRatedAt = row.created_at
      map.set(cat.id, entry)
      return map
    }, new Map<string, { categoryId: string; label: string; emoji: string; sum: number; count: number; lastRatedAt: string }>())
      .values(),
  )
    .map((v) => ({
      categoryId: v.categoryId,
      label: v.label,
      emoji: v.emoji,
      average: v.sum / v.count,
      count: v.count,
      lastRatedAt: v.lastRatedAt,
    }))
    .sort((a, b) => b.average - a.average)

  return { byCategory, loading, error, refresh }
}
