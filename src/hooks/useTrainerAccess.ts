import { useCallback, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const UNLOCKED_KEY = 'u8-trainer-unlocked'
const PASSCODE_KEY = 'u8-trainer-passcode'

/**
 * Gates the write actions (planning/editing/deleting trainings) behind the shared trainer
 * passcode. The passcode is checked server-side via the verify_passcode RPC — it never lives
 * in a Supabase table the browser can read, only in app_config which has no select policy.
 */
export function useTrainerAccess() {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return localStorage.getItem(UNLOCKED_KEY) === '1'
    } catch {
      return false
    }
  })
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const tryUnlock = useCallback(async (code: string) => {
    setChecking(true)
    setError(null)
    const { data, error } = await supabase.rpc('verify_passcode', { input: code })
    setChecking(false)
    if (error) {
      setError('Could not check the code — is Supabase set up yet?')
      return false
    }
    if (!data) {
      setError('Wrong code, try again.')
      return false
    }
    try {
      localStorage.setItem(UNLOCKED_KEY, '1')
      localStorage.setItem(PASSCODE_KEY, code)
    } catch {
      // storage unavailable; ignore
    }
    setUnlocked(true)
    return true
  }, [])

  const lock = useCallback(() => {
    try {
      localStorage.removeItem(UNLOCKED_KEY)
      localStorage.removeItem(PASSCODE_KEY)
    } catch {
      // storage unavailable; ignore
    }
    setUnlocked(false)
  }, [])

  const passcode = () => {
    try {
      return localStorage.getItem(PASSCODE_KEY) ?? ''
    } catch {
      return ''
    }
  }

  return { unlocked, checking, error, tryUnlock, lock, passcode }
}
