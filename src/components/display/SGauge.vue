<script setup lang="ts">
import { computed } from 'vue'

/**
 * SGauge — radial/circular SVG gauge indicator.
 * Displays a value from 0–100 as a circular arc (donut style).
 */
export interface SGaugeProps {
  /** Value between 0 and 100 */
  value: number
  /** Label displayed beneath the gauge */
  label?: string
  /** Size preset */
  size?: 'sm' | 'md' | 'lg'
  /** Colour variant — if omitted, auto-determined from value ranges */
  variant?: 'default' | 'success' | 'warning' | 'danger'
  /** Invert auto-variant thresholds so high values map to danger and low to success.
   *  Useful for risk/danger gauges. Has no effect when an explicit `variant` is set. */
  invertVariant?: boolean
}

const props = withDefaults(defineProps<SGaugeProps>(), {
  size: 'md',
  variant: undefined,
  invertVariant: false,
})

// Guard against NaN/Infinity input — `Math.max(0, NaN)` is `NaN`, which would
// propagate into the SVG and render the gauge at full circumference.
const clampedValue = computed(() => {
  const v = Number.isFinite(props.value) ? props.value : 0
  return Math.min(100, Math.max(0, v))
})

const sizeConfig = computed(() => {
  const configs = {
    sm: { dimension: 48, strokeWidth: 4, fontSize: '11px', labelSize: '9px' },
    md: { dimension: 72, strokeWidth: 5, fontSize: '15px', labelSize: '11px' },
    lg: { dimension: 96, strokeWidth: 6, fontSize: '20px', labelSize: '12px' },
  }
  return configs[props.size]
})

const radius = computed(() => (sizeConfig.value.dimension - sizeConfig.value.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashOffset = computed(() => circumference.value * (1 - clampedValue.value / 100))

const resolvedVariant = computed(() => {
  if (props.variant) return props.variant
  if (props.invertVariant) {
    if (clampedValue.value >= 67) return 'danger'
    if (clampedValue.value >= 34) return 'warning'
    return 'success'
  }
  if (clampedValue.value >= 70) return 'success'
  if (clampedValue.value >= 40) return 'warning'
  return 'danger'
})

const strokeColour = computed(() => {
  const colours: Record<string, string> = {
    default: 'var(--color-accent)',
    success: 'var(--color-success, #10b981)',
    warning: 'var(--color-warning, #f59e0b)',
    danger: 'var(--color-danger, #ef4444)',
  }
  return colours[resolvedVariant.value]
})

const displayValue = computed(() => Math.round(clampedValue.value))

const ariaValueText = computed(() => {
  const pct = `${displayValue.value}%`
  // Always include a qualitative level so non-inverted gauges get context too.
  const level = resolvedVariant.value === 'success'
    ? props.invertVariant ? 'low' : 'good'
    : resolvedVariant.value === 'danger'
      ? props.invertVariant ? 'high' : 'poor'
      : 'moderate'
  if (props.invertVariant && !props.variant) {
    return `${pct} — ${level} risk`
  }
  return `${pct} — ${level}`
})
</script>

<template>
  <div
    class="inline-flex flex-col items-center gap-1"
    role="meter"
    :aria-valuenow="clampedValue"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="label || 'Gauge'"
    :aria-valuetext="ariaValueText"
  >
    <svg
      :width="sizeConfig.dimension"
      :height="sizeConfig.dimension"
      :viewBox="`0 0 ${sizeConfig.dimension} ${sizeConfig.dimension}`"
    >
      <!-- Background track -->
      <circle
        :cx="sizeConfig.dimension / 2"
        :cy="sizeConfig.dimension / 2"
        :r="radius"
        fill="none"
        class="stroke-border/30"
        :stroke-width="sizeConfig.strokeWidth"
      />
      <!-- Filled arc -->
      <circle
        :cx="sizeConfig.dimension / 2"
        :cy="sizeConfig.dimension / 2"
        :r="radius"
        fill="none"
        :stroke="strokeColour"
        :stroke-width="sizeConfig.strokeWidth"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        :transform="`rotate(-90 ${sizeConfig.dimension / 2} ${sizeConfig.dimension / 2})`"
        class="transition-[stroke-dashoffset] duration-500 ease-out"
      />
      <!-- Centre value text -->
      <text
        :x="sizeConfig.dimension / 2"
        :y="sizeConfig.dimension / 2"
        text-anchor="middle"
        dominant-baseline="central"
        class="fill-text-primary font-semibold"
        :style="{ fontSize: sizeConfig.fontSize }"
      >
        {{ displayValue }}
      </text>
    </svg>
    <span
      v-if="label"
      class="text-text-secondary text-center leading-tight"
      :style="{ fontSize: sizeConfig.labelSize }"
    >
      {{ label }}
    </span>
  </div>
</template>
