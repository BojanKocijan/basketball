import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/apiClient'

const unlockedKey = (groupId: string) => `u8-trainer-unlocked-${groupId}`
const passcodeKey = (groupId: string) => `u8-trainer-passcode-${groupId}`

function readStoredUnlocked(groupId: string): boolean {
  try {
    return localStorage.getItem(unlockedKey(groupId)) === '1'
  } catch {
    return false
  }
}

function readStoredPasscode(groupId: string): string {
  try {
    return localStorage.getItem(passcodeKey(groupId)) ?? ''
  } catch {
    return ''
  }
}

/**
 * Gates the write actions (planning/editing/deleting trainings) behind a group's trainer
 * passcode. Each group has its own passcode (a code valid for one group does not unlock
 * another), so unlock state is scoped per groupId. `unlocked` and `passcode` are derived
 * straight from `(groupId, sessionOverrides)` on every render — never from state that only
 * catches up to a new groupId via an effect — so switching the active group can never render
 * a stale frame where the *previous* group's unlock (or its passcode) briefly still applies.
 * `sessionOverrides` covers two cases plain localStorage reads can't: an unlock the user chose
 * not to remember (session-only, never written to storage) and an explicit `lock()`.
 */
export function useTrainerAccess(groupId: string) {
  const [sessionOverrides, setSessionOverrides] = useState<
    Record<string, { unlocked: boolean; passcode: string }>
  >({})
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Clear a stale error (e.g. "wrong code") left over from a different group's attempt.
  useEffect(() => {
    setError(null)
  }, [groupId])

  const override = sessionOverrides[groupId]
  const unlocked = override ? override.unlocked : readStoredUnlocked(groupId)
  const passcodeValue = override ? override.passcode : readStoredPasscode(groupId)

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
      setSessionOverrides((prev) => ({ ...prev, [groupId]: { unlocked: true, passcode: code } }))
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
    setSessionOverrides((prev) => ({ ...prev, [groupId]: { unlocked: false, passcode: '' } }))
  }, [groupId])

  const passcode = useCallback(() => passcodeValue, [passcodeValue])

  return { unlocked, checking, error, tryUnlock, lock, passcode }
}
