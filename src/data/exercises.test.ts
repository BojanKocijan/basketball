import { describe, expect, it } from 'vitest'
import { exercises, exercisesForSport, findExercise } from './exercises'
import { DEFAULT_SPORT_ID } from './sports'

describe('exercisesForSport', () => {
  it('returns the default sport library, matching exercises', () => {
    expect(exercisesForSport(DEFAULT_SPORT_ID)).toEqual(exercises)
  })

  it('returns an empty array for a sport with no content yet', () => {
    expect(exercisesForSport('korfball')).toEqual([])
  })
})

describe('findExercise', () => {
  it('finds an exercise by id', () => {
    expect(findExercise('welcome')?.title).toBe('Welcome circle')
  })

  it('returns undefined for an unknown id', () => {
    expect(findExercise('does-not-exist')).toBeUndefined()
  })
})
