<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

export interface SBarChartProps {
  data: { label: string; value: number }[]
  height?: number
  highlightLast?: boolean
}

const props = withDefaults(defineProps<SBarChartProps>(), {
  height: 120,
  highlightLast: false,
})

const containerRef = ref<HTMLElement | null>(null)
const containerWidth = ref(600)

let observer: ResizeObserver | null = null

onMounted(() => {
  if (containerRef.value) {
    containerWidth.value = containerRef.value.clientWidth || 600
    observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        containerWidth.value = entry.contentRect.width || 600
      }
    })
    observer.observe(containerRef.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
})

// Use reduce instead of `Math.max(...spread)` so very large arrays don't
// overflow the call stack. Filter NaN/Infinity so a single bad value can't
// poison every bar.
const maxValue = computed(() => {
  let max = 1
  for (const d of props.data) {
    if (Number.isFinite(d.value) && d.value > max) max = d.value
  }
  return max
})

const barWidth = computed(() => {
  const count = props.data.length
  if (count === 0) return 0
  return Math.max(Math.min(containerWidth.value / count - 2, 20), 4)
})

const svgWidth = computed(() => props.data.length * (barWidth.value + 2))

// Clamp per-bar height so NaN/Infinity/negative values never produce invalid
// SVG attributes (silent empty bars were the symptom).
function barHeight(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 0
  return Math.max(0, (value / maxValue.value) * (props.height - 4))
}
</script>

<template>
  <div ref="containerRef" class="overflow-x-auto">
    <svg v-if="data.length" :width="svgWidth" :height="height" :viewBox="'0 0 ' + svgWidth + ' ' + height" role="img" aria-label="Bar chart">
      <rect
        v-for="(item, i) in data"
        :key="item.label"
        :x="i * (barWidth + 2)"
        :y="height - barHeight(item.value)"
        :width="barWidth"
        :height="barHeight(item.value)"
        rx="2"
        :class="highlightLast && i === data.length - 1 ? 'fill-accent' : 'fill-accent/40'"
      >
        <title>{{ item.label }}: {{ item.value }}</title>
      </rect>
    </svg>
  </div>
</template>
