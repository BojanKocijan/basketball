import { describe, expect, it } from 'vitest'
import { DEFAULT_SPORT_ID, sportInfo, SPORTS } from './sports'

describe('sportInfo', () => {
  it('returns the matching sport', () => {
    expect(sportInfo('basketball')).toEqual({ id: 'basketball', label: 'Basketball', emoji: '🏀' })
  })

  it('falls back to the first sport for an unknown id', () => {
    expect(sportInfo('curling')).toBe(SPORTS[0])
  })
})

describe('DEFAULT_SPORT_ID', () => {
  it('is a real, registered sport', () => {
    expect(SPORTS.some((s) => s.id === DEFAULT_SPORT_ID)).toBe(true)
  })
})
