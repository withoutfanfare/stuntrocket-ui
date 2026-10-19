import { ref, onScopeDispose, type Ref } from 'vue'

export interface UseClipboardReturn {
  copy: (text: string) => Promise<boolean>
  copied: Ref<boolean>
}

/**
 * Copy text to the clipboard with a reactive `copied` flag for UI feedback.
 *
 * Tries the modern Clipboard API first, falling back to a temporary textarea
 * with `document.execCommand('copy')` for environments without secure-context
 * access. The `copied` ref becomes `true` after a successful copy and resets
 * to `false` after 2 000 ms.
 */
export function useClipboard(): UseClipboardReturn {
  const copied = ref(false)
  let resetTimeout: ReturnType<typeof setTimeout> | null = null

  /**
   * Copy the given text to the system clipboard.
   *
   * @returns `true` if the copy succeeded, `false` otherwise.
   */
  async function copy(text: string): Promise<boolean> {
    let success: boolean

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        success = true
      } else {
        success = fallbackCopy(text)
      }
    } catch {
      success = fallbackCopy(text)
    }

    if (success) {
      copied.value = true

      if (resetTimeout) clearTimeout(resetTimeout)
      resetTimeout = setTimeout(() => {
        copied.value = false
        resetTimeout = null
      }, 2000)
    }

    return success
  }

  onScopeDispose(() => {
    if (resetTimeout) {
      clearTimeout(resetTimeout)
    }
  })

  return { copy, copied }
}

/**
 * Legacy fallback using a temporary textarea and execCommand.
 * Returns `false` in any environment without a `document` (SSR, workers).
 */
function fallbackCopy(text: string): boolean {
  if (typeof document === 'undefined') return false

  const textarea = document.createElement('textarea')
  textarea.value = text

  // Move off-screen so it is invisible
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  textarea.style.top = '-9999px'
  textarea.style.opacity = '0'

  document.body.appendChild(textarea)
  textarea.select()

  let success = false
  try {
    success = document.execCommand('copy')
  } catch {
    // execCommand not supported
  }

  document.body.removeChild(textarea)
  return success
}
