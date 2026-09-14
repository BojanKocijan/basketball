import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/apiClient'

const unlockedKey = (groupId: string) => `u8-trainer-unlocked-${groupId}`
const passcodeKey = (groupId: string) => `u8-trainer-passcode-${groupId}`

/**
 * Gates the write actions (planning/editing/deleting trainings) behind a group's trainer
 * passcode. Each group has its own passcode (a code valid for one group does not unlock
 * another), so unlock state is scoped and stored per groupId — switching groups re-locks
 * unless that group was separately unlocked and remembered on this device. The passcode is
 * checked server-side by sports-training-api (via its verify_passcode RPC) — it never lives
 * anywhere the browser can read it directly.
 */
export function useTrainerAccess(groupId: string) {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return localStorage.getItem(unlockedKey(groupId)) === '1'
    } catch {
      return false
    }
  })
  const [passcodeValue, setPasscodeValue] = useState(() => {
    try {
      return localStorage.getItem(passcodeKey(groupId)) ?? ''
    } catch {
      return ''
    }
  })
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Re-derive from this group's own stored state whenever the active group changes.
  useEffect(() => {
    try {
      setUnlocked(localStorage.getItem(unlockedKey(groupId)) === '1')
      setPasscodeValue(localStorage.getItem(passcodeKey(groupId)) ?? '')
    } catch {
      setUnlocked(false)
      setPasscodeValue('')
    }
    setError(null)
  }, [groupId])

  const tryUnlock = useCallback(
    async (code: string, remember: boolean) => {
      setChecking(true)
      setError(null)
      let valid: boolean
      try {
        const result = await api.post<{ valid: boolean }>('/auth/verify-passcode', {
          groupId,
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
          localStorage.setItem(unlockedKey(groupId), '1')
          localStorage.setItem(passcodeKey(groupId), code)
        } else {
          // Stay unlocked for this session only — nothing written to disk.
          localStorage.removeItem(unlockedKey(groupId))
          localStorage.removeItem(passcodeKey(groupId))
        }
      } catch {
        // storage unavailable; ignore
      }
      setPasscodeValue(code)
      setUnlocked(true)
      return true
    },
    [groupId],
  )

  const lock = useCallback(() => {
    try {
      localStorage.removeItem(unlockedKey(groupId))
      localStorage.removeItem(passcodeKey(groupId))
    } catch {
      // storage unavailable; ignore
    }
    setPasscodeValue('')
    setUnlocked(false)
  }, [groupId])

  const passcode = useCallback(() => passcodeValue, [passcodeValue])

  return { unlocked, checking, error, tryUnlock, lock, passcode }
}
