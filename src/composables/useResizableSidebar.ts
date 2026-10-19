import { ref, onScopeDispose, type Ref } from 'vue'

export interface UseResizableSidebarOptions {
  /** Default sidebar width in pixels */
  defaultWidth?: number
  /** Minimum allowed width in pixels */
  minWidth?: number
  /** Maximum allowed width in pixels */
  maxWidth?: number
  /** localStorage key for persisting width */
  storageKey?: string
}

export interface UseResizableSidebarReturn {
  width: Ref<number>
  isResizing: Ref<boolean>
  startResize: (e: MouseEvent) => void
  resetWidth: () => void
}

/**
 * Composable for a resizable sidebar with drag handle.
 *
 * Persists the width to localStorage and clamps it between min/max bounds.
 * Uses requestAnimationFrame for smooth, throttled resize updates.
 */
export function useResizableSidebar(
  options?: UseResizableSidebarOptions,
): UseResizableSidebarReturn {
  const {
    defaultWidth = 280,
    minWidth = 180,
    maxWidth = 480,
    storageKey = 'sidebar-width',
  } = options ?? {}

  function readStoredWidth(): number {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored === null) return defaultWidth
      const parsed = Number(stored)
      if (Number.isNaN(parsed)) return defaultWidth
      return Math.min(Math.max(parsed, minWidth), maxWidth)
    } catch {
      return defaultWidth
    }
  }

  const width = ref(readStoredWidth())
  const isResizing = ref(false)

  let rafId: number | null = null
  let pendingWidth: number | null = null

  function onMouseMove(e: MouseEvent) {
    pendingWidth = Math.min(Math.max(e.clientX, minWidth), maxWidth)

    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        if (pendingWidth !== null) {
          width.value = pendingWidth
          pendingWidth = null
        }
        rafId = null
      })
    }
  }

  function onMouseUp() {
    isResizing.value = false
    try { localStorage.setItem(storageKey, String(width.value)) } catch { /* storage unavailable */ }
    removeListeners()
  }

  function addListeners() {
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  function removeListeners() {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)

    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  /**
   * Call from a mousedown handler on the drag handle element.
   * Begins tracking mouse movement to resize the sidebar.
   */
  function startResize(e: MouseEvent) {
    e.preventDefault()
    isResizing.value = true
    addListeners()
  }

  /** Reset the sidebar width to its default value, clamped to min/max. */
  function resetWidth() {
    width.value = Math.min(Math.max(defaultWidth, minWidth), maxWidth)
    try { localStorage.setItem(storageKey, String(width.value)) } catch { /* storage unavailable */ }
  }

  onScopeDispose(() => {
    removeListeners()
  })

  return { width, isResizing, startResize, resetWidth }
}
