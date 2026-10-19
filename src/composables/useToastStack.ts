import { ref, type Ref } from 'vue'

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
let nextId = 0

// Toasts belong to the app, not to the component that raised them, so they
// outlive navigation and are removed only by their own timer or by the user.
export function useToastStack(): UseToastStackReturn {
  function addToast(
    message: string,
    variant: Toast['variant'] = 'info',
    duration: number = DEFAULT_DURATION,
  ) {
    const id = `toast-${++nextId}`
    const toast: Toast = { id, message, variant, duration }

    toasts.value.push(toast)

    const timeout = setTimeout(() => {
      removeToast(id)
    }, duration)

    timeouts.set(id, timeout)
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
