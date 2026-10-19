import { watch, onScopeDispose, type Ref } from 'vue'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not(:disabled)',
  'input:not(:disabled)',
  'select:not(:disabled)',
  'textarea:not(:disabled)',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
}

export function useFocusTrap(
  containerRef: Ref<HTMLElement | null>,
  active: Ref<boolean>,
): void {
  let previouslyFocused: HTMLElement | null = null
  let listenerAttached = false

  function onKeydown(e: KeyboardEvent) {
    if (e.key !== 'Tab') return

    const container = containerRef.value
    if (!container) return

    const focusable = getFocusableElements(container)
    if (focusable.length === 0) {
      e.preventDefault()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey) {
      // Shift+Tab: wrap from first to last
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      // Tab: wrap from last to first
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  function activate(container: HTMLElement) {
    // Store currently focused element to restore later
    previouslyFocused = document.activeElement as HTMLElement | null

    // Focus the first focusable element; if none, focus the container itself
    // so focus enters the overlay either way.
    const focusable = getFocusableElements(container)
    if (focusable.length > 0) {
      focusable[0].focus()
    } else {
      container.focus()
    }

    if (!listenerAttached) {
      container.addEventListener('keydown', onKeydown)
      listenerAttached = true
    }
  }

  function deactivate() {
    const container = containerRef.value
    if (container && listenerAttached) {
      container.removeEventListener('keydown', onKeydown)
      listenerAttached = false
    }

    // Restore focus to the previously focused element
    if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
      previouslyFocused.focus()
      previouslyFocused = null
    }
  }

  // Watch both `active` and `containerRef` so that:
  //   - opening (active: false → true) waits for the v-if'd container to mount
  //     (flush: 'post' runs after DOM updates)
  //   - mounting while already open (active starts true) still installs the trap
  //     once containerRef resolves
  //   - closing (active: true → false) tears the trap down
  // `immediate: true` covers the initial-open-on-mount case.
  watch(
    [active, containerRef] as const,
    ([isActive, container]) => {
      if (isActive && container) {
        activate(container)
      } else if (!isActive) {
        deactivate()
      }
    },
    { flush: 'post', immediate: true },
  )

  // Ensure listener is removed and focus restored even if the host unmounts
  // while the trap is still active.
  onScopeDispose(() => {
    deactivate()
  })
}
