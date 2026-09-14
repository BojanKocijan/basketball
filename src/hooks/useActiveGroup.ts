import { useEffect, useState } from 'react'
import { GROUPS, groupInfo } from '../data/groups'

const STORAGE_KEY = 'u8-active-group'

/** Which age group's trainings this device is currently viewing/planning. */
export function useActiveGroup() {
  const [groupId, setGroupId] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored && GROUPS.some((g) => g.id === stored)) return stored
    } catch {
      // storage unavailable; ignore
    }
    return GROUPS[0].id
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, groupId)
    } catch {
      // storage unavailable; ignore
    }
  }, [groupId])

  return { groupId, setGroupId, group: groupInfo(groupId) }
}
