<script setup lang="ts">
export interface SSkeletonTextProps {
  /** Number of skeleton lines to render */
  lines?: number
  /** Height of each skeleton line */
  size?: 'xs' | 'sm' | 'md' | 'lg'
  /** Width behaviour: full = all lines 100%, varied = natural width variation, short = all lines 50% */
  width?: 'full' | 'varied' | 'short'
}

const props = withDefaults(defineProps<SSkeletonTextProps>(), {
  lines: 3,
  size: 'md',
  width: 'varied',
})

const heightMap: Record<string, string> = {
  xs: 'h-2',
  sm: 'h-2.5',
  md: 'h-3.5',
  lg: 'h-4',
}

const variedWidths = ['w-full', 'w-11/12', 'w-4/5', 'w-3/4', 'w-2/3']

function getWidthClass(index: number): string {
  if (props.width === 'full') return 'w-full'
  if (props.width === 'short') return 'w-1/2'
  // Varied: cycle through widths, last line always shorter
  if (index === props.lines - 1 && props.lines > 1) return 'w-2/3'
  return variedWidths[index % variedWidths.length]
}
</script>

<template>
  <div class="flex flex-col gap-2" role="status" aria-label="Loading text">
    <div
      v-for="i in lines"
      :key="i"
      :class="[
        'ui-skeleton-bar animate-pulse',
        heightMap[size],
        getWidthClass(i - 1),
      ]"
    />
  </div>
</template>
