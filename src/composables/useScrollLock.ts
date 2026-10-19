import { onBeforeUnmount, watch, type WatchSource } from 'vue'

// Shared across every overlay, so stacked overlays keep the page locked until
// the last one closes.
let lockCount = 0
let previousOverflow = ''

function lock() {
  if (lockCount === 0) {
    previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  lockCount++
}

function unlock() {
  if (lockCount === 0) return
  lockCount--
  if (lockCount === 0) document.body.style.overflow = previousOverflow
}

/**
 * Stops the page behind an overlay from scrolling while `active` is true.
 *
 * Safe to use in several overlays at once, and does nothing during server rendering.
 */
export function useScrollLock(active: WatchSource<boolean>): void {
  if (typeof document === 'undefined') return

  let held = false
  function set(on: boolean) {
    if (on === held) return
    held = on
    if (on) lock()
    else unlock()
  }

  watch(active, set, { immediate: true })
  onBeforeUnmount(() => set(false))
}
