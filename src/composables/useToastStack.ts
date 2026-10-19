import { ref, onScopeDispose, type Ref } from 'vue'

export interface Toast {
  id: string
  message: string
  variant: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

export interface UseToastStackReturn {
  toasts: Ref<Toast[]>
  addToast: (message: string, variant?: Toast['variant'], duration?: number) => void
  removeToast: (id: string) => void
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
}

const DEFAULT_DURATION = 4000

// Module-level singleton state so all consumers share the same stack
const toasts = ref<Toast[]>([])
const timeouts = new Map<string, ReturnType<typeof setTimeout>>()

export function useToastStack(): UseToastStackReturn {
  // Track timeouts created during this scope for cleanup
  const scopeTimeoutIds: string[] = []

  function addToast(
    message: string,
    variant: Toast['variant'] = 'info',
    duration: number = DEFAULT_DURATION,
  ) {
    const id = crypto.randomUUID()
    const toast: Toast = { id, message, variant, duration }

    toasts.value.push(toast)

    const timeout = setTimeout(() => {
      removeToast(id)
    }, duration)

    timeouts.set(id, timeout)
    scopeTimeoutIds.push(id)
  }

  function removeToast(id: string) {
    const timeout = timeouts.get(id)
    if (timeout) {
      clearTimeout(timeout)
      timeouts.delete(id)
    }

    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  onScopeDispose(() => {
    for (const id of scopeTimeoutIds) {
      const timeout = timeouts.get(id)
      if (timeout) {
        clearTimeout(timeout)
        timeouts.delete(id)
      }
      // Also splice the toast out of the shared singleton array — otherwise it
      // has no timer left to remove it and renders forever.
      const index = toasts.value.findIndex((t) => t.id === id)
      if (index !== -1) {
        toasts.value.splice(index, 1)
      }
    }
  })

  return {
    toasts,
    addToast,
    removeToast,
    success: (message: string, duration?: number) => addToast(message, 'success', duration),
    error: (message: string, duration?: number) => addToast(message, 'error', duration),
    info: (message: string, duration?: number) => addToast(message, 'info', duration),
    warning: (message: string, duration?: number) => addToast(message, 'warning', duration),
  }
}
