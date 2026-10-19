<script setup lang="ts">
export interface SSkeletonProps {
  width?: string
  height?: string
  variant?: 'bar' | 'text' | 'card' | 'list'
}

withDefaults(defineProps<SSkeletonProps>(), {
  width: '100%',
  height: '1rem',
  variant: 'bar',
})
</script>

<template>
  <!-- bar (default): single bar with width/height -->
  <div
    v-if="variant === 'bar'"
    class="ui-skeleton-bar animate-pulse"
    :style="{ width, height }"
  />

  <!-- text: 3 bars of varying widths stacked vertically -->
  <div v-else-if="variant === 'text'" class="flex flex-col gap-2">
    <div class="ui-skeleton-bar animate-pulse h-3.5 w-full" />
    <div class="ui-skeleton-bar animate-pulse h-3.5 w-[85%]" />
    <div class="ui-skeleton-bar animate-pulse h-3.5 w-[60%]" />
  </div>

  <!-- card: rounded container with title bar, spacer, and text lines -->
  <div v-else-if="variant === 'card'" class="rounded-xl border border-border/40 p-4 flex flex-col gap-2.5">
    <div class="ui-skeleton-bar animate-pulse h-4 w-[40%]" />
    <div class="flex-1" />
    <div class="ui-skeleton-bar animate-pulse h-3 w-full" />
    <div class="ui-skeleton-bar animate-pulse h-3 w-[90%]" />
    <div class="ui-skeleton-bar animate-pulse h-3 w-[65%]" />
  </div>

  <!-- list: 4 rows, each with a circle avatar and a bar -->
  <div v-else-if="variant === 'list'" class="flex flex-col">
    <div class="flex gap-3 items-center py-2">
      <div class="ui-skeleton-bar animate-pulse w-8 h-8 rounded-full shrink-0" />
      <div class="ui-skeleton-bar animate-pulse flex-1 h-3.5 max-w-[80%]" />
    </div>
    <div class="flex gap-3 items-center py-2">
      <div class="ui-skeleton-bar animate-pulse w-8 h-8 rounded-full shrink-0" />
      <div class="ui-skeleton-bar animate-pulse flex-1 h-3.5 max-w-[65%]" />
    </div>
    <div class="flex gap-3 items-center py-2">
      <div class="ui-skeleton-bar animate-pulse w-8 h-8 rounded-full shrink-0" />
      <div class="ui-skeleton-bar animate-pulse flex-1 h-3.5 max-w-[90%]" />
    </div>
    <div class="flex gap-3 items-center py-2">
      <div class="ui-skeleton-bar animate-pulse w-8 h-8 rounded-full shrink-0" />
      <div class="ui-skeleton-bar animate-pulse flex-1 h-3.5 max-w-[50%]" />
    </div>
  </div>
</template>
