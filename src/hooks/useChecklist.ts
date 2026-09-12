import { useEffect, useState } from 'react'

export function useChecklist(key: string, size: number) {
  const [checked, setChecked] = useState<boolean[]>(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) {
        const parsed = JSON.parse(raw) as boolean[]
        if (Array.isArray(parsed) && parsed.length === size) return parsed
      }
    } catch {
      // ignore malformed storage
    }
    return Array(size).fill(false)
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(checked))
    } catch {
      // storage unavailable; ignore
    }
  }, [key, checked])

  function toggle(index: number) {
    setChecked((prev) => prev.map((v, i) => (i === index ? !v : v)))
  }

  function resetAll() {
    setChecked(Array(size).fill(false))
  }

  return { checked, toggle, resetAll }
}
