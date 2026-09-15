import { useCallback, useEffect, useState } from 'react'
import { api, isApiConfigured } from '../lib/apiClient'

export const JERSEY_COLORS = [
  'orange',
  'blue',
  'red',
  'green',
  'purple',
  'black',
  'white',
  'yellow',
] as const

export type JerseyColor = (typeof JERSEY_COLORS)[number]

export interface Player {
  id: string
  group_id: string
  nickname: string
  jersey_number: number | null
  jersey_color: JerseyColor | null
  created_at: string
  updated_at: string
}

/** A group's roster — kids are tracked only by a self-chosen nickname (see the GDPR note in
 * supabase/schema.sql), synced through sports-training-api so every trainer sees the same list. */
export function usePlayers(groupId: string) {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(isApiConfigured)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!isApiConfigured) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const data = await api.get<Player[]>(`/players?groupId=${encodeURIComponent(groupId)}`)
      setError(null)
      setPlayers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load players')
    } finally {
      setLoading(false)
    }
  }, [groupId])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function createPlayer(
    passcode: string,
    nickname: string,
    jerseyNumber: number | null,
    jerseyColor: JerseyColor | null,
  ) {
    await api.post('/players', {
      passcode,
      groupId,
      nickname,
      jerseyNumber,
      jerseyColor,
    })
    await refresh()
  }

  async function updatePlayer(
    passcode: string,
    id: string,
    nickname: string,
    jerseyNumber: number | null,
    jerseyColor: JerseyColor | null,
  ) {
    await api.put(`/players/${id}`, {
      passcode,
      groupId,
      nickname,
      jerseyNumber,
      jerseyColor,
    })
    await refresh()
  }

  async function deletePlayer(passcode: string, id: string) {
    await api.delete(`/players/${id}`, { passcode })
    await refresh()
  }

  return { players, loading, error, refresh, createPlayer, updatePlayer, deletePlayer }
}
