<script setup lang="ts">
/**
 * STimeline — vertical timeline container.
 * Wraps STimelineItem children with a connecting vertical line.
 */
export interface STimelineProps {
  /** Optional compact mode with tighter spacing */
  compact?: boolean
}

withDefaults(defineProps<STimelineProps>(), {
  compact: false,
})
</script>

<template>
  <div
    :class="[
      'relative',
      compact ? 'space-y-2' : 'space-y-4',
    ]"
    role="list"
    aria-label="Timeline"
  >
    <!-- Vertical connecting line -->
    <div
      class="absolute top-0 bottom-0 w-px bg-border/60"
      :class="compact ? 'left-[7px]' : 'left-[9px]'"
      aria-hidden="true"
    />
    <slot />
  </div>
</template>
