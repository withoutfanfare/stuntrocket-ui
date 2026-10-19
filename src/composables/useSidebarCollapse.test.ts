import { describe, it, expect, beforeEach } from 'vitest'
import { useSidebarCollapse } from './useSidebarCollapse'

const STORAGE_KEY = 'test-sidebar-collapsed'

describe('useSidebarCollapse', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY)
  })

  it('defaults to expanded (false)', () => {
    const { collapsed } = useSidebarCollapse(STORAGE_KEY)
    expect(collapsed.value).toBe(false)
  })

  it('reads initial state from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    const { collapsed } = useSidebarCollapse(STORAGE_KEY)
    expect(collapsed.value).toBe(true)
  })

  it('toggles state and persists', () => {
    const { collapsed, toggle } = useSidebarCollapse(STORAGE_KEY)

    toggle()
    expect(collapsed.value).toBe(true)
    expect(localStorage.getItem(STORAGE_KEY)).toBe('true')

    toggle()
    expect(collapsed.value).toBe(false)
    expect(localStorage.getItem(STORAGE_KEY)).toBe('false')
  })

  it('collapse() sets to true', () => {
    const { collapsed, collapse } = useSidebarCollapse(STORAGE_KEY)

    collapse()
    expect(collapsed.value).toBe(true)
    expect(localStorage.getItem(STORAGE_KEY)).toBe('true')
  })

  it('expand() sets to false', () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    const { collapsed, expand } = useSidebarCollapse(STORAGE_KEY)

    expand()
    expect(collapsed.value).toBe(false)
    expect(localStorage.getItem(STORAGE_KEY)).toBe('false')
  })
})
