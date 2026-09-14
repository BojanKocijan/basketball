import { describe, expect, it } from 'vitest'
import { CATEGORIES, categoriesForSport, categoryInfo } from './categories'
import { DEFAULT_SPORT_ID } from './sports'

describe('categoriesForSport', () => {
  it('returns the default sport categories, matching CATEGORIES', () => {
    expect(categoriesForSport(DEFAULT_SPORT_ID)).toEqual(CATEGORIES)
  })

  it('returns an empty array for a sport with no content yet', () => {
    expect(categoriesForSport('korfball')).toEqual([])
  })
})

describe('categoryInfo', () => {
  it('finds a category by id', () => {
    expect(categoryInfo('shooting')).toEqual({ id: 'shooting', label: 'Shooting', emoji: '🎯' })
  })
})
