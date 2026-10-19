<script setup lang="ts">
import { computed } from 'vue'

export interface SProgressBarProps {
  value: number
  variant?: 'accent' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md'
  indeterminate?: boolean
}

const props = withDefaults(defineProps<SProgressBarProps>(), {
  variant: 'accent',
  size: 'sm',
  indeterminate: false,
})

// Clamp value to [0, 100] and coerce NaN/Infinity to 0 so we never emit
// invalid `width:"NaN%"` or `width:"-10%"` CSS.
const clampedValue = computed(() => {
  const v = Number.isFinite(props.value) ? props.value : 0
  return Math.min(100, Math.max(0, v))
})
</script>

<template>
  <div
    role="progressbar"
    :aria-valuenow="indeterminate ? undefined : clampedValue"
    aria-valuemin="0"
    aria-valuemax="100"
    :class="[
      'w-full overflow-hidden rounded-full bg-border/30',
      {
        'h-1': size === 'sm',
        'h-1.5': size === 'md',
      },
    ]"
  >
    <div
      :class="[
        'h-full rounded-full',
        {
          'bg-accent': variant === 'accent',
          'bg-success': variant === 'success',
          'bg-warning': variant === 'warning',
          'bg-danger': variant === 'danger',
        },
        indeterminate
          ? 's-progress-bar-indeterminate'
          : 'transition-[width] duration-300 ease-out',
      ]"
      :style="{ width: indeterminate ? '40%' : clampedValue + '%' }"
    />
  </div>
</template>

<style>
@keyframes s-progress-indeterminate {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(350%);
  }
}

.s-progress-bar-indeterminate {
  animation: s-progress-indeterminate 1.5s ease-in-out infinite;
}
</style>
