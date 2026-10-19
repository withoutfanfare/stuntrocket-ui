<script setup lang="ts">
/**
 * STimelineItem — individual item within an STimeline.
 * Renders a dot, optional timestamp, and content.
 */
export interface STimelineItemProps {
  /** Timestamp or date string displayed beside the dot */
  timestamp?: string
  /** Variant controls the dot colour */
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'danger'
}

withDefaults(defineProps<STimelineItemProps>(), {
  variant: 'default',
})
</script>

<template>
  <div class="relative flex gap-3 pl-6" role="listitem">
    <!-- Dot -->
    <div
      :class="[
        'absolute left-0 top-1.5 z-10 flex-shrink-0 rounded-full ring-2 ring-[var(--color-surface)]',
        {
          'w-[10px] h-[10px]': !$slots.icon,
          'w-5 h-5 flex items-center justify-center': $slots.icon,
        },
        {
          'bg-border': variant === 'default' && !$slots.icon,
          'bg-accent': variant === 'accent' && !$slots.icon,
          'bg-success': variant === 'success' && !$slots.icon,
          'bg-warning': variant === 'warning' && !$slots.icon,
          'bg-danger': variant === 'danger' && !$slots.icon,
          'text-text-secondary': $slots.icon,
        },
      ]"
      aria-hidden="true"
    >
      <slot name="icon" />
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0 pb-1">
      <span
        v-if="timestamp"
        class="block text-[11px] text-text-secondary/70 mb-0.5 leading-snug"
      >
        {{ timestamp }}
      </span>
      <slot />
    </div>
  </div>
</template>
