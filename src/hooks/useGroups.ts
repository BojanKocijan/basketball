import { useEffect, useState } from 'react'
import { api, isApiConfigured } from '../lib/apiClient'

export interface ApiGroup {
  id: string
  name: string
  emoji: string
  status: 'available' | 'coming_soon'
}

interface RawGroup {
  id: string
  name: string
  group_templates: { label: string; emoji: string; status: 'available' | 'coming_soon' } | null
}

/** The club's groups (see sports-training-api's /groups), replacing the old hardcoded
 * src/data/groups.ts list — a new group (e.g. U10, or a future U12) shows up here as soon as
 * it exists in the database, no app deploy needed. */
export function useGroups() {
  const [groups, setGroups] = useState<ApiGroup[]>([])
  const [loading, setLoading] = useState(isApiConfigured)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isApiConfigured) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    api
      .get<RawGroup[]>('/groups')
      .then((data) => {
        if (cancelled) return
        setGroups(
          data.map((g) => ({
            id: g.id,
            name: g.name,
            emoji: g.group_templates?.emoji ?? '🏀',
            status: g.group_templates?.status ?? 'available',
          })),
        )
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load groups')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { groups, loading, error }
}
