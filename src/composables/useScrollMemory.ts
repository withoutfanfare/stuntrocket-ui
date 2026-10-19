import type { Router } from 'vue-router'

const scrollPositions = new Map<string, number>()
const MAX_ENTRIES = 100

export interface UseScrollMemoryReturn {
  /** Remove all router hooks and clear stored positions. */
  dispose: () => void
}

/**
 * Remember scroll position per route and restore it on back/forward navigation.
 *
 * Returns a `dispose()` function that removes the registered router hooks —
 * call it from a top-level component's `onBeforeUnmount` (or use it in tests)
 * to avoid stacking duplicate guards on HMR or re-mount.
 */
export function useScrollMemory(router: Router, selector = 'main'): UseScrollMemoryReturn {
  function getContainer(): HTMLElement | null {
    return document.querySelector(selector)
  }

  function save(path: string) {
    const container = getContainer()
    if (!container) return
    if (scrollPositions.size > MAX_ENTRIES) {
      const firstKey = scrollPositions.keys().next().value
      if (firstKey) scrollPositions.delete(firstKey)
    }
    scrollPositions.set(path, container.scrollTop)
  }

  function restore(path: string) {
    const container = getContainer()
    if (!container) return
    const saved = scrollPositions.get(path)
    requestAnimationFrame(() => {
      container.scrollTop = saved ?? 0
    })
  }

  const beforeEachRemover = router.beforeEach((_to, from) => { save(from.fullPath) })
  const afterEachRemover = router.afterEach((to) => { restore(to.fullPath) })

  return {
    dispose: () => {
      beforeEachRemover()
      afterEachRemover()
      scrollPositions.clear()
    },
  }
}
