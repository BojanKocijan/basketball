import { describe, expect, it } from 'vitest'
import { formatClock, formatDate, toLocalIso } from './format'

describe('formatClock', () => {
  it('pads single-digit seconds', () => {
    expect(formatClock(65)).toBe('1:05')
  })

  it('formats zero as 0:00', () => {
    expect(formatClock(0)).toBe('0:00')
  })

  it('floors fractional seconds', () => {
    expect(formatClock(90.9)).toBe('1:30')
  })

  it('handles durations over an hour as raw minutes', () => {
    expect(formatClock(3661)).toBe('61:01')
  })
})

describe('formatDate', () => {
  it('formats an ISO date as weekday, day, month', () => {
    // 2026-09-19 is a Saturday.
    expect(formatDate('2026-09-19')).toBe(
      new Date('2026-09-19T00:00:00').toLocaleDateString(undefined, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }),
    )
  })
})

describe('toLocalIso', () => {
  it('round-trips through formatDate without shifting the date', () => {
    const d = new Date(2026, 8, 19) // month is 0-indexed: September
    expect(toLocalIso(d)).toBe('2026-09-19')
  })

  it('pads single-digit month and day', () => {
    const d = new Date(2026, 0, 5) // Jan 5
    expect(toLocalIso(d)).toBe('2026-01-05')
  })
})
