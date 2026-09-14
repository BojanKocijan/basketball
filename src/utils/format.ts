export function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = Math.floor(totalSeconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

/** Formats a `YYYY-MM-DD` training date as e.g. "Sat, 20 Sep". */
export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })
}

/** Local-date ISO string (YYYY-MM-DD) for a Date — unlike `toISOString()`, this doesn't shift
 * the date when the browser's timezone is ahead of UTC (e.g. Europe/Amsterdam). */
export function toLocalIso(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
