<script setup lang="ts">
import { computed, useId } from 'vue'

export interface SSparklineProps {
  values: number[]
  width?: number
  height?: number
  color?: string
  gradient?: boolean
  strokeWidth?: number
}

const props = withDefaults(defineProps<SSparklineProps>(), {
  width: 120,
  height: 32,
  color: 'var(--color-accent)',
  gradient: false,
  strokeWidth: 1.5,
})

const gradientId = useId()

const padding = 2

const points = computed(() => {
  if (props.values.length === 0) return ''

  // Filter NaN/Infinity so a single bad reading doesn't produce points="NaN,NaN".
  const safe = props.values.filter(Number.isFinite)
  if (safe.length === 0) return ''

  let min = Infinity
  let max = -Infinity
  for (const v of safe) {
    if (v < min) min = v
    if (v > max) max = v
  }
  const range = max - min
  const usableHeight = props.height - padding * 2
  const step = safe.length > 1 ? props.width / (safe.length - 1) : 0

  return safe
    .map((v, i) => {
      const x = safe.length === 1 ? props.width / 2 : i * step
      const y =
        range === 0
          ? props.height / 2
          : padding + usableHeight - ((v - min) / range) * usableHeight
      return `${x},${y}`
    })
    .join(' ')
})

const polygonPoints = computed(() => {
  if (props.values.length === 0) return ''

  const safe = props.values.filter(Number.isFinite)
  if (safe.length === 0) return ''

  let min = Infinity
  let max = -Infinity
  for (const v of safe) {
    if (v < min) min = v
    if (v > max) max = v
  }
  const range = max - min
  const usableHeight = props.height - padding * 2
  const step = safe.length > 1 ? props.width / (safe.length - 1) : 0

  const linePoints = safe.map((v, i) => {
    const x = safe.length === 1 ? props.width / 2 : i * step
    const y =
      range === 0
        ? props.height / 2
        : padding + usableHeight - ((v - min) / range) * usableHeight
    return `${x},${y}`
  })

  const lastX = safe.length === 1 ? props.width / 2 : (safe.length - 1) * step
  const firstX = safe.length === 1 ? props.width / 2 : 0

  return [...linePoints, `${lastX},${props.height}`, `${firstX},${props.height}`].join(' ')
})

const ariaLabel = computed(() => {
  if (props.values.length === 0) return 'Sparkline'
  const safe = props.values.filter(Number.isFinite)
  if (safe.length === 0) return 'Sparkline (no data)'
  let min = Infinity
  let max = -Infinity
  let sum = 0
  for (const v of safe) { if (v < min) min = v; if (v > max) max = v; sum += v }
  return `Sparkline: ${safe.length} points, min ${Math.round(min)}, max ${Math.round(max)}, avg ${Math.round(sum / safe.length)}`
})
</script>

<template>
  <svg
    v-if="values.length > 0"
    :width="width"
    :height="height"
    :viewBox="'0 0 ' + width + ' ' + height"
    preserveAspectRatio="none"
    class="block"
    role="img"
    :aria-label="ariaLabel"
  >
    <defs v-if="gradient">
      <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" :stop-color="color" stop-opacity="0.2" />
        <stop offset="100%" :stop-color="color" stop-opacity="0" />
      </linearGradient>
    </defs>

    <polygon
      v-if="gradient"
      :points="polygonPoints"
      :fill="`url(#${gradientId})`"
    />

    <polyline
      :points="points"
      fill="none"
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
