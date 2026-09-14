import { useCallback, useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'
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

/** Shared, dated training plans for one group — synced through Supabase so every trainer sees the same calendar. */
export function usePlans(groupId: string) {
  const [plans, setPlans] = useState<TrainingPlan[]>([])
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('group_id', groupId)
      .order('training_date', { ascending: true })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setError(null)
    setPlans(data ?? [])
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
    const { error } = await supabase.rpc('create_plan', {
      passcode,
      p_group_id: groupId,
      p_training_date: trainingDate,
      p_title: title,
      p_emoji: emoji,
      p_exercise_ids: exerciseIds,
    })
    if (error) throw new Error(error.message)
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
    const { error } = await supabase.rpc('update_plan', {
      passcode,
      p_id: id,
      p_training_date: trainingDate,
      p_title: title,
      p_emoji: emoji,
      p_exercise_ids: exerciseIds,
    })
    if (error) throw new Error(error.message)
    await refresh()
  }

  async function deletePlan(passcode: string, id: string) {
    const { error } = await supabase.rpc('delete_plan', { passcode, p_id: id })
    if (error) throw new Error(error.message)
    await refresh()
  }

  return { plans, upcoming, past, nextPlan, loading, error, refresh, createPlan, updatePlan, deletePlan }
}
