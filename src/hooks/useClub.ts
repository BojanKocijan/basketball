import { useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

export interface Club {
  name: string
  logoUrl: string | null
}

/**
 * Only one club exists today (Dunckers Hilversum), so this just reads the first row from the
 * `clubs` table. Once the app serves multiple clubs, this becomes "resolve the active club by
 * slug/subdomain" instead — the DB shape already supports that.
 */
const FALLBACK_CLUB: Club = { name: 'Dunckers Hilversum', logoUrl: '/club-logo.png' }

export function useClub() {
  const [club, setClub] = useState<Club>(FALLBACK_CLUB)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    let cancelled = false
    supabase
      .from('clubs')
      .select('name, logo_url')
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data) return
        setClub({ name: data.name, logoUrl: data.logo_url })
      })
    return () => {
      cancelled = true
    }
  }, [])

  return club
}
