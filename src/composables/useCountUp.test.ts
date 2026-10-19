import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, effectScope } from 'vue'
import { useCountUp } from './useCountUp'

describe('useCountUp', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initialises displayValue to the target value', () => {
    const scope = effectScope()
    scope.run(() => {
      const target = ref(42)
      const { displayValue } = useCountUp(target)

      expect(displayValue.value).toBe(42)
    })
    scope.stop()
  })
})
