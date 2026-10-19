<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * SDistributionChart — horizontal or vertical bar chart for categorical distributions.
 * Displays labelled categories with proportional bars, ideal for dashboards
 * showing counts across buckets (e.g. PR age distribution, severity breakdown).
 */
export interface SDistributionChartProps {
  /** The categories to display with label, value, and optional colour */
  items: { label: string; value: number; color?: string }[]
  /** Bar direction — horizontal renders rows, vertical renders columns */
  orientation?: 'horizontal' | 'vertical'
  /** Show numeric values alongside bars */
  showValues?: boolean
  /** Override the maximum value for bar proportions (auto-calculated from items by default) */
  maxValue?: number
  /** Animate bars on mount */
  animated?: boolean
}

const props = withDefaults(defineProps<SDistributionChartProps>(), {
  orientation: 'horizontal',
  showValues: true,
  maxValue: undefined,
  animated: true,
})

const mounted = ref(false)
let rafId: number | null = null

onMounted(() => {
  if (props.animated) {
    rafId = requestAnimationFrame(() => {
      mounted.value = true
      rafId = null
    })
  } else {
    mounted.value = true
  }
})

// Cancel the RAF if the component unmounts before it fires — otherwise it
// would write to a destroyed reactive instance.
onBeforeUnmount(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
})

// Reduce-based max so we (a) don't overflow the stack on large arrays and
// (b) can filter NaN/Infinity so a single bad value can't poison everything.
const resolvedMax = computed(() => {
  if (typeof props.maxValue === 'number' && Number.isFinite(props.maxValue)) {
    return Math.max(props.maxValue, 1)
  }
  let max = 1
  for (const item of props.items) {
    if (Number.isFinite(item.value) && item.value > max) max = item.value
  }
  return max
})

function barPercent(value: number): string {
  // Coerce non-finite values to 0 so we never emit width:"NaN%".
  const v = Number.isFinite(value) ? value : 0
  const pct = (v / resolvedMax.value) * 100
  return `${Math.min(100, Math.max(pct, 1))}%`
}

function barColour(index: number, color?: string): string {
  if (color) return color
  // Generate varying opacities of the accent colour for items without explicit colours
  const opacities = [1, 0.8, 0.65, 0.5, 0.4, 0.3, 0.25, 0.2]
  const opacity = opacities[index % opacities.length]
  return `color-mix(in srgb, var(--color-accent) ${opacity * 100}%, transparent)`
}
</script>

<template>
  <div
    role="img"
    :aria-label="`Distribution chart with ${items.length} categories`"
    :class="[
      orientation === 'horizontal'
        ? 'flex flex-col gap-1.5'
        : 'flex items-end gap-1.5',
    ]"
  >
    <!-- Horizontal orientation: each row is label | bar | value -->
    <template v-if="orientation === 'horizontal'">
      <div
        v-for="(item, index) in items"
        :key="item.label"
        class="flex items-center gap-2"
        role="group"
        :aria-label="`${item.label}: ${item.value}`"
      >
        <span class="w-[5rem] shrink-0 text-right text-[11px] font-medium text-text-secondary truncate">
          {{ item.label }}
        </span>

        <div class="flex-1 h-2.5 rounded-full bg-border/20 overflow-hidden">
          <div
            class="h-full rounded-full transition-[width] duration-500 ease-out"
            :style="{
              width: mounted ? barPercent(item.value) : '0%',
              backgroundColor: barColour(index, item.color),
            }"
          />
        </div>

        <span
          v-if="showValues"
          class="w-8 shrink-0 text-right text-[12px] font-bold font-mono tabular-nums text-text-secondary"
        >
          {{ item.value }}
        </span>
      </div>
    </template>

    <!-- Vertical orientation: columns with bars growing upward -->
    <template v-else>
      <div
        v-for="(item, index) in items"
        :key="item.label"
        class="flex flex-col items-center gap-1 flex-1 min-w-0"
        role="group"
        :aria-label="`${item.label}: ${item.value}`"
      >
        <span
          v-if="showValues"
          class="text-[11px] font-bold font-mono tabular-nums text-text-secondary"
        >
          {{ item.value }}
        </span>

        <div class="w-full h-24 rounded-t bg-border/20 overflow-hidden flex items-end">
          <div
            class="w-full rounded-t transition-[height] duration-500 ease-out"
            :style="{
              height: mounted ? barPercent(item.value) : '0%',
              backgroundColor: barColour(index, item.color),
            }"
          />
        </div>

        <span class="text-[10px] font-medium text-text-secondary text-center leading-tight truncate w-full">
          {{ item.label }}
        </span>
      </div>
    </template>
  </div>
</template>
