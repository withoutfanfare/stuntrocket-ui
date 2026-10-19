import { ref, computed, watch, onScopeDispose, type Ref, type ComputedRef } from 'vue'

export interface SearchHighlight {
  before: string
  match: string
  after: string
  hasMatch: boolean
}

export interface UseSearchOptions {
  /** Debounce delay in milliseconds before the filtered list updates. */
  debounceMs?: number
}

export interface UseSearchReturn<T> {
  query: Ref<string>
  filtered: ComputedRef<T[]>
  clearQuery: () => void
  highlightMatch: (text: string) => SearchHighlight
}

/**
 * Generic search composable that filters a reactive list of items using a
 * caller-supplied predicate.
 *
 * @param items    - Reactive array of items to search over
 * @param searchFn - Predicate that returns `true` when `item` matches `query`
 * @param options  - Optional configuration (debounce delay)
 */
export function useSearch<T>(
  items: Ref<T[]>,
  searchFn: (item: T, query: string) => boolean,
  options?: UseSearchOptions,
): UseSearchReturn<T> {
  const query = ref('')
  const debounceMs = options?.debounceMs

  // When debouncing we keep a separate ref that trails the live query
  const debouncedQuery = ref('')
  let debounceTimeout: ReturnType<typeof setTimeout> | null = null

  if (debounceMs && debounceMs > 0) {
    watch(query, (value) => {
      if (debounceTimeout) clearTimeout(debounceTimeout)
      debounceTimeout = setTimeout(() => {
        debouncedQuery.value = value
        debounceTimeout = null
      }, debounceMs)
    })
  } else {
    // No debounce — keep debouncedQuery in sync immediately
    watch(query, (value) => {
      debouncedQuery.value = value
    })
  }

  const filtered = computed<T[]>(() => {
    const q = debouncedQuery.value.trim()
    if (q === '') return items.value
    return items.value.filter((item) => searchFn(item, q))
  })

  /** Reset the search query to an empty string. */
  function clearQuery() {
    query.value = ''
    debouncedQuery.value = ''

    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
      debounceTimeout = null
    }
  }

  /**
   * Locate the first case-insensitive occurrence of the current query within
   * `text` and return the surrounding segments. Useful for safe template
   * rendering without `innerHTML` or XSS risk.
   */
  function highlightMatch(text: string): SearchHighlight {
    const q = query.value.trim()

    if (q === '') {
      return { before: text, match: '', after: '', hasMatch: false }
    }

    const lowerText = text.toLowerCase()
    const lowerQuery = q.toLowerCase()
    const index = lowerText.indexOf(lowerQuery)

    if (index === -1) {
      return { before: text, match: '', after: '', hasMatch: false }
    }

    return {
      before: text.slice(0, index),
      match: text.slice(index, index + q.length),
      after: text.slice(index + q.length),
      hasMatch: true,
    }
  }

  onScopeDispose(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }
  })

  return { query, filtered, clearQuery, highlightMatch }
}
