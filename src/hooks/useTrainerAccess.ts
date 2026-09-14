import { useCallback, useState } from 'react'
import { api } from '../lib/apiClient'

const UNLOCKED_KEY = 'u8-trainer-unlocked'
const PASSCODE_KEY = 'u8-trainer-passcode'

/**
 * Gates the write actions (planning/editing/deleting trainings) behind the shared trainer
 * passcode. The passcode is checked server-side by sports-training-api (via its
 * verify_passcode RPC) — it never lives anywhere the browser can read it directly.
 */
export function useTrainerAccess() {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return localStorage.getItem(UNLOCKED_KEY) === '1'
    } catch {
      return false
    }
  })
  const [passcodeValue, setPasscodeValue] = useState(() => {
    try {
      return localStorage.getItem(PASSCODE_KEY) ?? ''
    } catch {
      return ''
    }
  })
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const tryUnlock = useCallback(async (code: string, remember: boolean) => {
    setChecking(true)
    setError(null)
    let valid: boolean
    try {
      const result = await api.post<{ valid: boolean }>('/auth/verify-passcode', {
        passcode: code,
      })
      valid = result.valid
    } catch {
      setChecking(false)
      setError('Could not check the code — is the API set up yet?')
      return false
    }
    setChecking(false)
    if (!valid) {
      setError('Wrong code, try again.')
      return false
    }
    try {
      if (remember) {
        localStorage.setItem(UNLOCKED_KEY, '1')
        localStorage.setItem(PASSCODE_KEY, code)
      } else {
        // Stay unlocked for this session only — nothing written to disk.
        localStorage.removeItem(UNLOCKED_KEY)
        localStorage.removeItem(PASSCODE_KEY)
      }
    } catch {
      // storage unavailable; ignore
    }
    setPasscodeValue(code)
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
    setPasscodeValue('')
    setUnlocked(false)
  }, [])

  const passcode = useCallback(() => passcodeValue, [passcodeValue])

  return { unlocked, checking, error, tryUnlock, lock, passcode }
}
