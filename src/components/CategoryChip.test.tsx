import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CategoryChip } from './CategoryChip'

describe('CategoryChip', () => {
  it('renders the category label and emoji', () => {
    render(<CategoryChip categoryId="shooting" active={false} onToggle={() => {}} />)
    expect(screen.getByRole('button', { name: /shooting/i })).toBeInTheDocument()
  })

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn()
    render(<CategoryChip categoryId="passing" active={false} onToggle={onToggle} />)
    fireEvent.click(screen.getByRole('button', { name: /passing/i }))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('applies the active styling when active', () => {
    render(<CategoryChip categoryId="dribbling" active onToggle={() => {}} />)
    expect(screen.getByRole('button', { name: /dribbling/i }).className).toContain('border-orange-500')
  })
})
