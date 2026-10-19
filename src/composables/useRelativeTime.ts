import { ref, computed, onScopeDispose, type Ref, type ComputedRef } from 'vue'

export interface UseRelativeTimeReturn {
  relative: ComputedRef<string | null>
  full: ComputedRef<string | null>
}

const MINUTE = 60
const HOUR = 3600
const DAY = 86400
const WEEK = 604800
const MONTH = 2592000
const YEAR = 31536000

/**
 * Format an ISO date string or Date to a relative time string.
 *
 * Returns human-readable strings such as "just now", "2m ago",
 * "3h ago", "yesterday", "3 days ago", "2 weeks ago", "3 months ago",
 * or "1 year ago". Returns an empty string for invalid dates.
 */
export function formatRelativeTime(date: string | Date): string {
  const then = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(then.getTime())) return ''

  const now = Date.now()
  const diffSeconds = Math.floor((now - then.getTime()) / 1000)

  if (diffSeconds < MINUTE) return 'just now'
  if (diffSeconds < HOUR) return `${Math.floor(diffSeconds / MINUTE)}m ago`
  if (diffSeconds < DAY) return `${Math.floor(diffSeconds / HOUR)}h ago`
  if (diffSeconds < DAY * 2) return 'yesterday'
  if (diffSeconds < WEEK) return `${Math.floor(diffSeconds / DAY)} days ago`
  if (diffSeconds < MONTH) return `${Math.floor(diffSeconds / WEEK)} weeks ago`
  if (diffSeconds < YEAR) return `${Math.floor(diffSeconds / MONTH)} months ago`
  const years = Math.floor(diffSeconds / YEAR)
  return `${years} ${years === 1 ? 'year' : 'years'} ago`
}

const fullDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

/**
 * Reactive composable that returns a relative time string and a full
 * formatted date. The relative string updates on a configurable interval
 * (default 60 000 ms) so timestamps stay fresh in the UI.
 *
 * @param date       - Reactive date value (ISO string, Date, or null)
 * @param updateInterval - Re-evaluation interval in milliseconds (default 60000)
 */
export function useRelativeTime(
  date: Ref<string | Date | null>,
  updateInterval = 60000,
): UseRelativeTimeReturn {
  // A counter ref that we bump on each interval tick to force recomputation
  const tick = ref(0)

  const intervalId = setInterval(() => {
    tick.value++
  }, updateInterval)

  const relative = computed<string | null>(() => {
    // Access tick so Vue tracks it as a dependency
    void tick.value

    if (date.value === null) return null
    return formatRelativeTime(date.value)
  })

  const full = computed<string | null>(() => {
    if (date.value === null) return null

    const d = date.value instanceof Date ? date.value : new Date(date.value)
    return fullDateFormatter.format(d)
  })

  onScopeDispose(() => {
    clearInterval(intervalId)
  })

  return { relative, full }
}
