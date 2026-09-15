import { useCallback, useEffect, useState } from 'react'

export type ThemePreference = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'u8-theme'

function readStored(): ThemePreference {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'light' || v === 'dark' || v === 'system') return v
  } catch {
    // storage unavailable; ignore
  }
  return 'system'
}

function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(preference: ThemePreference) {
  const dark = preference === 'dark' || (preference === 'system' && systemPrefersDark())
  document.documentElement.classList.toggle('dark', dark)
}

/**
 * Trainer's Light/Dark/System theme preference. An explicit Light or Dark choice overrides the
 * device's OS setting (see index.css's `@custom-variant dark` — every `dark:` utility now needs
 * the `.dark` class this hook manages, not prefers-color-scheme directly); System (the default)
 * follows the OS live, same behavior as before this existed. index.html has a small blocking
 * script applying the same stored preference before React mounts, so there's no flash of the
 * wrong theme on load.
 */
export function useTheme() {
  const [preference, setPreferenceState] = useState<ThemePreference>(readStored)

  useEffect(() => {
    applyTheme(preference)
  }, [preference])

  // Only while the preference is 'system' does an OS-level change need to update the page live
  // — an explicit Light/Dark choice should stay put regardless of what the OS does.
  useEffect(() => {
    if (preference !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme('system')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [preference])

  const setPreference = useCallback((next: ThemePreference) => {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // storage unavailable; ignore
    }
    setPreferenceState(next)
  }, [])

  return { preference, setPreference }
}
