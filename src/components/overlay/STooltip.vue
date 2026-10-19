<script setup lang="ts">
import { ref, useId, onBeforeUnmount } from 'vue'

export interface STooltipProps {
  text: string
  position?: 'top' | 'bottom'
  delay?: number
}

const props = withDefaults(defineProps<STooltipProps>(), {
  position: 'top',
  delay: 400,
})

const isVisible = ref(false)
const tooltipId = useId()
let timer: ReturnType<typeof setTimeout> | null = null

function onMouseEnter() {
  timer = setTimeout(() => {
    isVisible.value = true
  }, props.delay)
}

function onMouseLeave() {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  isVisible.value = false
}

// Show on keyboard focus too — mouse-only tooltips are invisible to Tab users.
function onFocusIn() {
  isVisible.value = true
}

function onFocusOut() {
  isVisible.value = false
}

// Clear any pending show timer if the host unmounts mid-delay, otherwise the
// callback would fire against an unmounted component.
onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
})
</script>

<template>
  <span
    class="relative inline-flex"
    :aria-describedby="isVisible ? tooltipId : undefined"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <slot />

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-show="isVisible"
        :id="tooltipId"
        role="tooltip"
        :class="[
          'absolute left-1/2 -translate-x-1/2 px-2 py-1 text-[11px] leading-none font-medium text-text-inverse bg-text-primary rounded-md whitespace-nowrap pointer-events-none shadow-sm',
          position === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5',
        ]"
      >
        {{ text }}
      </div>
    </Transition>
  </span>
</template>
