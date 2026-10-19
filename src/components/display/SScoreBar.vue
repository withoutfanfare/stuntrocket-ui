<script setup lang="ts">
import { computed } from 'vue'

export interface SScoreBarProps {
  value: number
  label?: string
  showValue?: boolean
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<SScoreBarProps>(), {
  size: 'md',
  showValue: false,
})

// Guard against NaN/Infinity input. `Math.max(0, NaN)` is `NaN`, which would
// produce an invalid `width="NaN%"` and the bar would silently vanish.
const clampedValue = computed(() => {
  const v = Number.isFinite(props.value) ? props.value : 0
  return Math.min(1, Math.max(0, v))
})

const fillColour = computed(() => {
  if (clampedValue.value >= 0.7) return 'bg-success'
  if (clampedValue.value >= 0.4) return 'bg-warning'
  return 'bg-danger'
})

const displayValue = computed(() => Math.round(clampedValue.value * 100) + '%')
</script>

<template>
  <div class="flex items-center gap-2">
    <span
      v-if="label"
      class="text-[12px] text-text-secondary whitespace-nowrap"
    >
      {{ label }}
    </span>

    <div
      role="meter"
      :aria-valuenow="clampedValue"
      aria-valuemin="0"
      aria-valuemax="1"
      :aria-label="label || 'Score'"
      :aria-valuetext="displayValue"
      :class="[
        'flex-1 overflow-hidden rounded-full bg-border/30',
        {
          'h-1.5': size === 'sm',
          'h-2': size === 'md',
        },
      ]"
    >
      <div
        :class="[
          'h-full rounded-full',
          fillColour,
          'transition-[width] duration-300 ease-out',
        ]"
        :style="{ width: (clampedValue * 100) + '%' }"
      />
    </div>

    <span
      v-if="showValue"
      class="text-[12px] text-text-secondary tabular-nums min-w-[2.5rem] text-right"
    >
      {{ displayValue }}
    </span>
  </div>
</template>
