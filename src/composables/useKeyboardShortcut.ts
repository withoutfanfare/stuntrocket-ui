import { onMounted, onUnmounted } from 'vue'

export interface KeyboardShortcutOptions {
  meta?: boolean
  shift?: boolean
  preventDefault?: boolean
}

export interface UseKeyboardShortcutReturn {
  unregister: () => void
}

const EDITABLE_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT'])

function isEditableTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false
  if (EDITABLE_TAGS.has(target.tagName)) return true
  if (target.isContentEditable) return true
  return false
}

export function useKeyboardShortcut(
  key: string,
  handler: () => void,
  options: KeyboardShortcutOptions = {},
): UseKeyboardShortcutReturn {
  const { meta = false, shift = false, preventDefault = true } = options

  function onKeydown(e: KeyboardEvent) {
    // Skip editable elements unless the key is Escape
    if (e.key !== 'Escape' && isEditableTarget(e.target)) return

    // Check modifier requirements
    const metaPressed = e.metaKey || e.ctrlKey
    if (meta && !metaPressed) return
    if (!meta && metaPressed) return

    if (shift && !e.shiftKey) return
    if (!shift && e.shiftKey) return

    // Case-insensitive comparison for single letters
    const matches =
      key.length === 1
        ? e.key.toLowerCase() === key.toLowerCase()
        : e.key === key

    if (!matches) return

    if (preventDefault) {
      e.preventDefault()
    }

    handler()
  }

  function unregister() {
    window.removeEventListener('keydown', onKeydown)
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeydown)
  })

  onUnmounted(() => {
    unregister()
  })

  return { unregister }
}

/** Detect if running on macOS */
export function usePlatform(): { isMac: boolean } {
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent)
  return { isMac }
}

/** Format a shortcut for display, using platform-appropriate symbols */
export function formatShortcut(key: string, options?: { meta?: boolean; shift?: boolean; alt?: boolean }): string {
  const { isMac } = usePlatform()
  const parts: string[] = []

  if (options?.meta) {
    parts.push(isMac ? '⌘' : 'Ctrl+')
  }
  if (options?.shift) {
    parts.push(isMac ? '⇧' : 'Shift+')
  }
  if (options?.alt) {
    parts.push(isMac ? '⌥' : 'Alt+')
  }

  const displayKey = key.length === 1 ? key.toUpperCase() : key
  parts.push(displayKey)

  return parts.join('')
}
