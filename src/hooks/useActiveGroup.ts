import { useEffect, useState } from 'react'

const STORAGE_KEY = 'u8-active-group'
const DEFAULT_GROUP_ID = 'u8'

/** Which group's trainings this device is currently viewing/planning — just an id; look up
 * its display info (name/emoji/status) via useGroups() once groups are loaded. */
export function useActiveGroup() {
  const [groupId, setGroupId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_GROUP_ID
    } catch {
      return DEFAULT_GROUP_ID
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, groupId)
    } catch {
      // storage unavailable; ignore
    }
  }, [groupId])

  return { groupId, setGroupId }
}
