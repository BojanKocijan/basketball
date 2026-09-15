import { useCallback, useEffect, useState } from 'react'
import { api, isApiConfigured } from '../lib/apiClient'

interface RawRatingRow {
  id: string
  player_id: string
  plan_id: string
  category_id: string
  rating: number
  created_at: string
}

export interface PlayerCategoryStat {
  categoryId: string
  average: number
  count: number
  lastRatedAt: string
}

/** One player's rating history, rolled up per category — the detail view behind a jersey card,
 * so a trainer can see how a specific kid's skills have trended before adding a new rating.
 * Uses sports-training-api's GET /players/:id/progress (existing, previously unused in the UI —
 * the group-level rollup on the Players tab uses the separate GET /groups/:id/progress). */
export function usePlayerProgress(playerId: string) {
  const [rows, setRows] = useState<RawRatingRow[]>([])
  const [loading, setLoading] = useState(isApiConfigured)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!isApiConfigured) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const data = await api.get<RawRatingRow[]>(`/players/${encodeURIComponent(playerId)}/progress`)
      setError(null)
      setRows(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load progress')
    } finally {
      setLoading(false)
    }
  }, [playerId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const byCategory: PlayerCategoryStat[] = Array.from(
    rows
      .reduce((map, row) => {
        const entry = map.get(row.category_id) ?? {
          categoryId: row.category_id,
          sum: 0,
          count: 0,
          lastRatedAt: row.created_at,
        }
        entry.sum += row.rating
        entry.count += 1
        if (row.created_at > entry.lastRatedAt) entry.lastRatedAt = row.created_at
        map.set(row.category_id, entry)
        return map
      }, new Map<string, { categoryId: string; sum: number; count: number; lastRatedAt: string }>())
      .values(),
  ).map((v) => ({
    categoryId: v.categoryId,
    average: v.sum / v.count,
    count: v.count,
    lastRatedAt: v.lastRatedAt,
  }))

  return { byCategory, loading, error, refresh }
}
