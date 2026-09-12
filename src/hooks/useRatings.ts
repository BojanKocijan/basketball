import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'u8-exercise-ratings'

type RatingLog = Record<string, number[]>

function loadRatings(): RatingLog {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as RatingLog
  } catch {
    // ignore malformed storage
  }
  return {}
}

/** Tracks "how much did the kids like it" scores (1-3) per exercise, across every time it's run. */
export function useRatings() {
  const [log, setLog] = useState<RatingLog>(loadRatings)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(log))
    } catch {
      // storage unavailable; ignore
    }
  }, [log])

  const rate = useCallback((exerciseId: string, value: number) => {
    setLog((prev) => ({ ...prev, [exerciseId]: [...(prev[exerciseId] ?? []), value] }))
  }, [])

  const stats = useCallback(
    (exerciseId: string) => {
      const values = log[exerciseId] ?? []
      if (values.length === 0) return { average: null as number | null, count: 0 }
      const average = values.reduce((a, b) => a + b, 0) / values.length
      return { average, count: values.length }
    },
    [log],
  )

  const lastRating = useCallback(
    (exerciseId: string) => {
      const values = log[exerciseId] ?? []
      return values.length > 0 ? values[values.length - 1] : null
    },
    [log],
  )

  return { rate, stats, lastRating }
}
