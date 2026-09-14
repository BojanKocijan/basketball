import { useCallback, useEffect, useState } from 'react'
import { api, isApiConfigured } from '../lib/apiClient'
import { toLocalIso } from '../utils/format'

export interface TrainingPlan {
  id: string
  group_id: string
  training_date: string // YYYY-MM-DD
  title: string
  emoji: string
  exercise_ids: string[]
  created_at: string
  updated_at: string
}

/** Shared, dated training plans for one group — synced through sports-training-api so every trainer sees the same calendar. */
export function usePlans(groupId: string) {
  const [plans, setPlans] = useState<TrainingPlan[]>([])
  const [loading, setLoading] = useState(isApiConfigured)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!isApiConfigured) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const data = await api.get<TrainingPlan[]>(`/plans?groupId=${encodeURIComponent(groupId)}`)
      setError(null)
      setPlans(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load plans')
    } finally {
      setLoading(false)
    }
  }, [groupId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const today = toLocalIso(new Date())
  const upcoming = plans.filter((p) => p.training_date >= today)
  const past = plans.filter((p) => p.training_date < today)
  const nextPlan = upcoming[0] ?? null

  async function createPlan(
    passcode: string,
    trainingDate: string,
    title: string,
    emoji: string,
    exerciseIds: string[],
  ) {
    await api.post('/plans', {
      passcode,
      groupId,
      trainingDate,
      title,
      emoji,
      exerciseIds,
    })
    await refresh()
  }

  async function updatePlan(
    passcode: string,
    id: string,
    trainingDate: string,
    title: string,
    emoji: string,
    exerciseIds: string[],
  ) {
    await api.put(`/plans/${id}`, {
      passcode,
      trainingDate,
      title,
      emoji,
      exerciseIds,
    })
    await refresh()
  }

  async function deletePlan(passcode: string, id: string) {
    await api.delete(`/plans/${id}`, { passcode })
    await refresh()
  }

  return { plans, upcoming, past, nextPlan, loading, error, refresh, createPlan, updatePlan, deletePlan }
}
