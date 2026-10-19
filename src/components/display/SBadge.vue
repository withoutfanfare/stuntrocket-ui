<script setup lang="ts">
export interface SBadgeProps {
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'count'
}

withDefaults(defineProps<SBadgeProps>(), {
  variant: 'default',
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded-full leading-none px-2 py-1 text-[11px] font-medium tracking-[0.01em]',
      {
        'bg-surface-secondary text-text-secondary': variant === 'default',
        'bg-accent/10 text-accent': variant === 'accent' || variant === 'info',
        'bg-success/10 text-success': variant === 'success',
        'bg-warning/10 text-warning': variant === 'warning',
        'bg-danger/10 text-danger': variant === 'error',
        'px-1.5 py-0.5 text-[10px] border border-border/40 bg-surface-secondary/30 text-text-secondary tabular-nums': variant === 'count',
      },
    ]"
  >
    <slot />
  </span>
</template>
