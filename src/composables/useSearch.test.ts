import { describe, it, expect, vi, afterEach } from 'vitest'
import { ref, effectScope, nextTick } from 'vue'
import { useSearch } from './useSearch'

describe('useSearch', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns all items when query is empty', () => {
    const scope = effectScope()
    scope.run(() => {
      const items = ref(['apple', 'banana', 'cherry'])
      const { filtered } = useSearch(items, (item, q) =>
        item.toLowerCase().includes(q.toLowerCase()),
      )

      expect(filtered.value).toEqual(['apple', 'banana', 'cherry'])
    })
    scope.stop()
  })

  it('filters items based on query', async () => {
    const scope = effectScope()
    await scope.run(async () => {
      const items = ref(['apple', 'banana', 'cherry'])
      const { query, filtered } = useSearch(items, (item, q) =>
        item.toLowerCase().includes(q.toLowerCase()),
      )

      query.value = 'an'
      await nextTick()

      expect(filtered.value).toEqual(['banana'])
    })
    scope.stop()
  })

  it('clears query and shows all items', async () => {
    const scope = effectScope()
    await scope.run(async () => {
      const items = ref(['apple', 'banana'])
      const { query, filtered, clearQuery } = useSearch(items, (item, q) =>
        item.includes(q),
      )

      query.value = 'apple'
      await nextTick()
      expect(filtered.value).toHaveLength(1)

      clearQuery()
      await nextTick()
      expect(filtered.value).toHaveLength(2)
    })
    scope.stop()
  })

  it('highlightMatch returns correct segments', () => {
    const scope = effectScope()
    scope.run(() => {
      const items = ref(['hello world'])
      const { query, highlightMatch } = useSearch(items, () => true)

      query.value = 'world'
      const result = highlightMatch('hello world')

      expect(result).toEqual({
        before: 'hello ',
        match: 'world',
        after: '',
        hasMatch: true,
      })
    })
    scope.stop()
  })

  it('highlightMatch returns no match when query is empty', () => {
    const scope = effectScope()
    scope.run(() => {
      const items = ref(['test'])
      const { highlightMatch } = useSearch(items, () => true)

      const result = highlightMatch('hello world')
      expect(result.hasMatch).toBe(false)
      expect(result.before).toBe('hello world')
    })
    scope.stop()
  })

  it('highlightMatch is case-insensitive', () => {
    const scope = effectScope()
    scope.run(() => {
      const items = ref(['test'])
      const { query, highlightMatch } = useSearch(items, () => true)

      query.value = 'HELLO'
      const result = highlightMatch('Say Hello There')

      expect(result.hasMatch).toBe(true)
      expect(result.match).toBe('Hello')
    })
    scope.stop()
  })

  it('supports debounced filtering', async () => {
    vi.useFakeTimers()

    const scope = effectScope()
    await scope.run(async () => {
      const items = ref(['apple', 'banana'])
      const { query, filtered } = useSearch(
        items,
        (item, q) => item.includes(q),
        { debounceMs: 200 },
      )

      query.value = 'apple'
      await nextTick()

      // Before debounce fires, still shows all items
      expect(filtered.value).toHaveLength(2)

      vi.advanceTimersByTime(200)
      await nextTick()

      expect(filtered.value).toEqual(['apple'])
    })
    scope.stop()
  })
})
