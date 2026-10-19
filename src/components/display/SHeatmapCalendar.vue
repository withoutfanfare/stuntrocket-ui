<script setup lang="ts">
import { computed, ref } from 'vue'

export interface SHeatmapCalendarProps {
  counts: Record<string, number>
  weeks?: number
  cellSize?: number
  tooltipSuffix?: string
  tooltipFormatter?: (date: string, count: number) => string
  interactive?: boolean
  /** Reference "today" — defaults to `new Date()` at mount. Useful for tests. */
  today?: Date
}

const props = withDefaults(defineProps<SHeatmapCalendarProps>(), {
  weeks: 16,
  cellSize: 10,
  tooltipSuffix: 'events',
  tooltipFormatter: undefined,
  interactive: false,
  today: undefined,
})

const emit = defineEmits<{
  'cell-click': [payload: { date: string; count: number }]
}>()

const focusedCell = ref<{ week: number; day: number } | null>(null)

// Capture today once at setup so the heatmap doesn't drift across re-renders
// (and so tests can pass a frozen value via the `today` prop).
const today = props.today ? new Date(props.today.getTime()) : new Date()

/** Format a Date as a local YYYY-MM-DD string. Avoids `toISOString()` which
 *  returns UTC and produces wrong-day cells for users in negative offsets. */
function toLocalDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function handleCellClick(date: string, count: number) {
  if (!date || !props.interactive) return
  emit('cell-click', { date, count })
}

function cellTooltip(date: string, count: number): string {
  if (props.tooltipFormatter) return props.tooltipFormatter(date, count)
  return `${date}: ${count} ${props.tooltipSuffix}`
}

function onKeydown(e: KeyboardEvent) {
  if (!props.interactive) return
  const fc = focusedCell.value
  if (!fc) {
    if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault()
      focusedCell.value = { week: 0, day: 0 }
    }
    return
  }

  const maxWeek = weekData.value.length - 1
  const maxDay = 6

  switch (e.key) {
    case 'ArrowRight':
      e.preventDefault()
      if (fc.week < maxWeek) focusedCell.value = { week: fc.week + 1, day: fc.day }
      break
    case 'ArrowLeft':
      e.preventDefault()
      if (fc.week > 0) focusedCell.value = { week: fc.week - 1, day: fc.day }
      break
    case 'ArrowDown':
      e.preventDefault()
      if (fc.day < maxDay) focusedCell.value = { week: fc.week, day: fc.day + 1 }
      break
    case 'ArrowUp':
      e.preventDefault()
      if (fc.day > 0) focusedCell.value = { week: fc.week, day: fc.day - 1 }
      break
    case 'Enter':
    case ' ': {
      e.preventDefault()
      const cell = weekData.value[fc.week]?.[fc.day]
      if (cell?.date) handleCellClick(cell.date, cell.count)
      break
    }
    case 'Escape':
      e.preventDefault()
      focusedCell.value = null
      break
  }
}

const GAP = 2

const weekData = computed(() => {
  const entries = Object.entries(props.counts)
  // Reduce-based max so a single NaN can't poison everything and large arrays
  // don't overflow the call stack.
  let max = 1
  for (const [, v] of entries) {
    if (Number.isFinite(v) && v > max) max = v
  }

  const totalDays = props.weeks * 7
  const result: Array<Array<{ date: string; count: number; opacity: number }>> = []

  for (let w = props.weeks - 1; w >= 0; w--) {
    const week: typeof result[0] = []
    for (let d = 0; d < 7; d++) {
      const daysAgo = totalDays - 1 - (props.weeks - 1 - w) * 7 - d
      if (daysAgo < 0) {
        week.push({ date: '', count: 0, opacity: 0 })
        continue
      }
      const date = new Date(today)
      date.setDate(date.getDate() - daysAgo)
      const dateStr = toLocalDateKey(date)
      const count = props.counts[dateStr] || 0
      const opacity = count === 0 ? 0.04 : 0.15 + (count / max) * 0.65
      week.push({ date: dateStr, count, opacity })
    }
    result.push(week)
  }

  return result
})

const svgWidth = computed(() => weekData.value.length * (props.cellSize + GAP))
const svgHeight = computed(() => 7 * (props.cellSize + GAP))
</script>

<template>
  <div class="overflow-x-auto" :tabindex="interactive ? 0 : undefined" @keydown="onKeydown" @blur="focusedCell = null">
    <svg v-if="weekData.length" :width="svgWidth" :height="svgHeight" :viewBox="'0 0 ' + svgWidth + ' ' + svgHeight" role="img" aria-label="Activity heatmap">
      <g v-for="(week, wi) in weekData" :key="wi">
        <rect
          v-for="(day, di) in week"
          :key="di"
          :x="wi * (cellSize + GAP)"
          :y="di * (cellSize + GAP)"
          :width="cellSize"
          :height="cellSize"
          rx="2"
          class="fill-accent"
          :class="{ 'cursor-pointer': interactive && day.date }"
          :style="{
            opacity: day.opacity,
            stroke: focusedCell?.week === wi && focusedCell?.day === di ? 'var(--color-accent)' : 'none',
            strokeWidth: focusedCell?.week === wi && focusedCell?.day === di ? 1.5 : 0,
          }"
          @click="handleCellClick(day.date, day.count)"
        >
          <title v-if="day.date">{{ cellTooltip(day.date, day.count) }}</title>
        </rect>
      </g>
    </svg>
  </div>
</template>
