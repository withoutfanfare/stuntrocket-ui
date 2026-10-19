import { ref, type Ref } from 'vue'

export interface UseSidebarCollapseReturn {
  collapsed: Ref<boolean>
  toggle: () => void
  collapse: () => void
  expand: () => void
}

/**
 * Composable for sidebar collapsed/expanded state.
 *
 * Persists the collapsed boolean to localStorage so it survives page reloads.
 */
export function useSidebarCollapse(
  storageKey = 'sidebar-collapsed',
): UseSidebarCollapseReturn {
  function readStored(): boolean {
    try {
      return localStorage.getItem(storageKey) === 'true'
    } catch {
      return false /* localStorage unavailable (server rendering, blocked storage) */
    }
  }

  function persist(value: boolean) {
    try { localStorage.setItem(storageKey, String(value)) } catch { /* localStorage unavailable */ }
  }

  const collapsed = ref(readStored())

  /** Toggle between collapsed and expanded states. */
  function toggle() {
    collapsed.value = !collapsed.value
    persist(collapsed.value)
  }

  /** Collapse the sidebar. */
  function collapse() {
    collapsed.value = true
    persist(true)
  }

  /** Expand the sidebar. */
  function expand() {
    collapsed.value = false
    persist(false)
  }

  return { collapsed, toggle, collapse, expand }
}
