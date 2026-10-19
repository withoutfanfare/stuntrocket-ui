import { ref, watch, onScopeDispose, type Ref } from 'vue'

/** Ease-out cubic: decelerates towards the end. */
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3)

export interface UseCountUpOptions {
  /** Animation duration in milliseconds (default 400) */
  duration?: number
  /** Easing function mapping progress [0..1] to [0..1] (default easeOutCubic) */
  easing?: (t: number) => number
}

export interface UseCountUpReturn {
  displayValue: Ref<number>
}

/**
 * Composable that animates a numeric value from its current display
 * to a new target using requestAnimationFrame.
 *
 * Returns a rounded integer `displayValue` that smoothly transitions
 * whenever the `target` ref changes.
 */
export function useCountUp(
  target: Ref<number>,
  options?: UseCountUpOptions,
): UseCountUpReturn {
  const { duration = 400, easing = easeOutCubic } = options ?? {}

  const displayValue = ref(target.value)
  let rafId: number | null = null

  function animate(from: number, to: number) {
    // Cancel any in-flight animation
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }

    const start = performance.now()

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = easing(progress)

      displayValue.value = Math.round(from + (to - from) * eased)

      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        rafId = null
      }
    }

    rafId = requestAnimationFrame(tick)
  }

  watch(target, (newVal, oldVal) => {
    if (newVal === oldVal) return
    // Animate from whatever is currently displayed to the new target
    animate(displayValue.value, newVal)
  })

  onScopeDispose(() => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  })

  return { displayValue }
}
