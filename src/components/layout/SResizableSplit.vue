<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

export interface SResizableSplitProps {
  /** Layout direction — 'horizontal' places panes side by side, 'vertical' stacks them */
  direction?: 'horizontal' | 'vertical'
  /** Initial size of the first pane as a percentage (default: 50) */
  initialSize?: number
  /** Minimum allowed size as a percentage (default: 20) */
  minSize?: number
  /** Maximum allowed size as a percentage (default: 80) */
  maxSize?: number
  /** localStorage key for persisting the divider position */
  storageKey?: string
}

const props = withDefaults(defineProps<SResizableSplitProps>(), {
  direction: 'horizontal',
  initialSize: 50,
  minSize: 20,
  maxSize: 80,
})

const size = ref(props.initialSize)
const isDragging = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const isHorizontal = computed(() => props.direction === 'horizontal')

const containerClass = computed(() => [
  'flex h-full w-full',
  isHorizontal.value ? 'flex-row' : 'flex-col',
  isDragging.value ? 'select-none' : '',
])

const firstPaneStyle = computed(() =>
  isHorizontal.value
    ? { width: size.value + '%' }
    : { height: size.value + '%' },
)

const dividerBarClass = computed(() => [
  'bg-border transition-colors duration-150 flex-shrink-0',
  isHorizontal.value
    ? 'w-px group-hover:w-0.5 h-full group-hover:bg-accent'
    : 'h-px group-hover:h-0.5 w-full group-hover:bg-accent',
])

const dividerHitAreaClass = computed(() => [
  'group flex-shrink-0 flex items-center justify-center',
  isHorizontal.value
    ? 'px-1 cursor-col-resize'
    : 'py-1 cursor-row-resize',
])

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function startDrag(e: MouseEvent) {
  e.preventDefault()
  isDragging.value = true
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

function startDragTouch(e: TouchEvent) {
  // Only react to the first touch — multi-touch shouldn't start a drag.
  if (e.touches.length !== 1) return
  e.preventDefault()
  isDragging.value = true
  document.addEventListener('touchmove', onDragTouch, { passive: false })
  document.addEventListener('touchend', stopDragTouch)
  document.addEventListener('touchcancel', stopDragTouch)
}

function onDrag(e: MouseEvent) {
  if (!isDragging.value || !containerRef.value) return

  const rect = containerRef.value.getBoundingClientRect()
  let newSize: number

  if (isHorizontal.value) {
    newSize = ((e.clientX - rect.left) / rect.width) * 100
  } else {
    newSize = ((e.clientY - rect.top) / rect.height) * 100
  }

  size.value = clamp(newSize, props.minSize, props.maxSize)
}

function onDragTouch(e: TouchEvent) {
  if (!isDragging.value || !containerRef.value || e.touches.length !== 1) return
  const touch = e.touches[0]
  const rect = containerRef.value.getBoundingClientRect()
  let newSize: number
  if (isHorizontal.value) {
    newSize = ((touch.clientX - rect.left) / rect.width) * 100
  } else {
    newSize = ((touch.clientY - rect.top) / rect.height) * 100
  }
  size.value = clamp(newSize, props.minSize, props.maxSize)
}

function stopDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  saveSize()
}

function stopDragTouch() {
  isDragging.value = false
  document.removeEventListener('touchmove', onDragTouch)
  document.removeEventListener('touchend', stopDragTouch)
  document.removeEventListener('touchcancel', stopDragTouch)
  saveSize()
}

// Keyboard support: nudge the divider by 2% on arrow keys. Required for WAI-ARIA
// `separator` operability.
const KEYBOARD_STEP = 2

function onKeydown(e: KeyboardEvent) {
  const horizontal = isHorizontal.value
  const increase = horizontal ? 'ArrowRight' : 'ArrowDown'
  const decrease = horizontal ? 'ArrowLeft' : 'ArrowUp'
  if (e.key === increase) {
    e.preventDefault()
    size.value = clamp(size.value + KEYBOARD_STEP, props.minSize, props.maxSize)
  } else if (e.key === decrease) {
    e.preventDefault()
    size.value = clamp(size.value - KEYBOARD_STEP, props.minSize, props.maxSize)
  } else if (e.key === 'Home') {
    e.preventDefault()
    size.value = props.minSize
  } else if (e.key === 'End') {
    e.preventDefault()
    size.value = props.maxSize
  } else if (e.key === 'Enter') {
    e.preventDefault()
    resetSize()
  }
}

function resetSize() {
  size.value = props.initialSize
  saveSize()
}

function saveSize() {
  if (!props.storageKey) return
  try {
    localStorage.setItem(props.storageKey, String(size.value))
  } catch { /* localStorage unavailable */ }
}

function restoreSize() {
  if (!props.storageKey) return
  try {
    const saved = localStorage.getItem(props.storageKey)
    if (saved !== null) {
      const parsed = Number(saved)
      if (!Number.isNaN(parsed)) {
        size.value = clamp(parsed, props.minSize, props.maxSize)
      }
    }
  } catch { /* localStorage unavailable */ }
}

onMounted(() => {
  restoreSize()
})

// Re-clamp size when min/max props change
watch(
  [() => props.minSize, () => props.maxSize],
  ([min, max]) => { size.value = clamp(size.value, min, max) },
)

onBeforeUnmount(() => {
  if (isDragging.value) {
    isDragging.value = false
    saveSize()
  }
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDragTouch)
  document.removeEventListener('touchend', stopDragTouch)
  document.removeEventListener('touchcancel', stopDragTouch)
})
</script>

<template>
  <div ref="containerRef" :class="containerClass">
    <!-- First pane -->
    <div class="overflow-auto" :style="firstPaneStyle">
      <slot name="first" />
    </div>

    <!-- Draggable divider — keyboard-operable separator with explicit role -->
    <div
      :class="dividerHitAreaClass"
      role="separator"
      :aria-orientation="isHorizontal ? 'vertical' : 'horizontal'"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="Math.round(size)"
      tabindex="0"
      @mousedown="startDrag"
      @touchstart="startDragTouch"
      @keydown="onKeydown"
      @dblclick="resetSize"
    >
      <div :class="dividerBarClass" />
    </div>

    <!-- Second pane -->
    <div class="overflow-auto flex-1">
      <slot name="second" />
    </div>
  </div>
</template>
