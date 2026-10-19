import { describe, it, expect, vi, afterEach } from 'vitest'
import { formatRelativeTime } from './useRelativeTime'

describe('formatRelativeTime', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns "just now" for dates less than a minute ago', () => {
    const now = new Date()
    expect(formatRelativeTime(now)).toBe('just now')
  })

  it('returns minutes ago', () => {
    vi.useFakeTimers()
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000)
    expect(formatRelativeTime(fiveMinAgo)).toBe('5m ago')
    vi.useRealTimers()
  })

  it('returns hours ago', () => {
    vi.useFakeTimers()
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000)
    expect(formatRelativeTime(threeHoursAgo)).toBe('3h ago')
    vi.useRealTimers()
  })

  it('returns "yesterday" for 1 day ago', () => {
    vi.useFakeTimers()
    const yesterday = new Date(Date.now() - 30 * 60 * 60 * 1000)
    expect(formatRelativeTime(yesterday)).toBe('yesterday')
    vi.useRealTimers()
  })

  it('returns days ago', () => {
    vi.useFakeTimers()
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    expect(formatRelativeTime(threeDaysAgo)).toBe('3 days ago')
    vi.useRealTimers()
  })

  it('returns weeks ago', () => {
    vi.useFakeTimers()
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    expect(formatRelativeTime(twoWeeksAgo)).toBe('2 weeks ago')
    vi.useRealTimers()
  })

  it('returns months ago', () => {
    vi.useFakeTimers()
    const threeMonthsAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    expect(formatRelativeTime(threeMonthsAgo)).toBe('3 months ago')
    vi.useRealTimers()
  })

  it('returns years ago', () => {
    vi.useFakeTimers()
    const twoYearsAgo = new Date(Date.now() - 730 * 24 * 60 * 60 * 1000)
    expect(formatRelativeTime(twoYearsAgo)).toBe('2 years ago')
    vi.useRealTimers()
  })

  it('accepts ISO date strings', () => {
    vi.useFakeTimers()
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    expect(formatRelativeTime(fiveMinAgo)).toBe('5m ago')
    vi.useRealTimers()
  })
})
