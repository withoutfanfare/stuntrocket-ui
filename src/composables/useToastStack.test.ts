import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { effectScope } from 'vue'
import { useToastStack } from './useToastStack'

// The toast stack is a module-level singleton, so we need to drain it between tests
function drainToasts() {
  const { toasts, removeToast } = useToastStack()
  while (toasts.value.length > 0) {
    removeToast(toasts.value[0].id)
  }
}

describe('useToastStack', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    const scope = effectScope()
    scope.run(() => drainToasts())
    scope.stop()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts with an empty stack', () => {
    const scope = effectScope()
    scope.run(() => {
      const { toasts } = useToastStack()
      expect(toasts.value).toHaveLength(0)
    })
    scope.stop()
  })

  it('adds a toast with default variant and duration', () => {
    const scope = effectScope()
    scope.run(() => {
      const { toasts, addToast } = useToastStack()
      addToast('Hello')

      expect(toasts.value).toHaveLength(1)
      expect(toasts.value[0].message).toBe('Hello')
      expect(toasts.value[0].variant).toBe('info')
      expect(toasts.value[0].duration).toBe(4000)
    })
    scope.stop()
  })

  it('adds a toast with a specified variant', () => {
    const scope = effectScope()
    scope.run(() => {
      const { toasts, addToast } = useToastStack()
      addToast('Saved', 'success')

      expect(toasts.value[0].variant).toBe('success')
    })
    scope.stop()
  })

  it('auto-removes toast after duration', () => {
    const scope = effectScope()
    scope.run(() => {
      const { toasts, addToast } = useToastStack()
      addToast('Temporary', 'info', 2000)

      expect(toasts.value).toHaveLength(1)

      vi.advanceTimersByTime(2000)
      expect(toasts.value).toHaveLength(0)
    })
    scope.stop()
  })

  it('removes a specific toast by id', () => {
    const scope = effectScope()
    scope.run(() => {
      const { toasts, addToast, removeToast } = useToastStack()
      addToast('First')
      addToast('Second')

      const firstId = toasts.value[0].id
      removeToast(firstId)

      expect(toasts.value).toHaveLength(1)
      expect(toasts.value[0].message).toBe('Second')
    })
    scope.stop()
  })

  it('provides convenience methods for each variant', () => {
    const scope = effectScope()
    scope.run(() => {
      const { toasts, success, error, info, warning } = useToastStack()

      success('ok')
      error('fail')
      info('note')
      warning('caution')

      expect(toasts.value.map((t) => t.variant)).toEqual([
        'success',
        'error',
        'info',
        'warning',
      ])
    })
    scope.stop()
  })

  it('shares state across multiple calls (singleton)', () => {
    const scope = effectScope()
    scope.run(() => {
      const a = useToastStack()
      const b = useToastStack()

      a.addToast('from a')
      expect(b.toasts.value).toHaveLength(1)
      expect(b.toasts.value[0].message).toBe('from a')
    })
    scope.stop()
  })

  it('keeps a toast after the component that raised it is gone', () => {
    // Typical flow: show "Saved", then navigate away from the page that saved.
    const scope = effectScope()
    scope.run(() => useToastStack().success('Saved'))
    scope.stop()

    const { toasts } = useToastStack()
    expect(toasts.value.map((t) => t.message)).toEqual(['Saved'])
    vi.advanceTimersByTime(4000)
    expect(toasts.value).toHaveLength(0)
  })

  it('creates unique ids without crypto.randomUUID', () => {
    // randomUUID is missing on plain http origins other than localhost.
    vi.stubGlobal('crypto', {})
    try {
      const { info, toasts } = useToastStack()
      info('one')
      info('two')
      expect(new Set(toasts.value.map((t) => t.id)).size).toBe(2)
    } finally {
      vi.unstubAllGlobals()
    }
  })
})
