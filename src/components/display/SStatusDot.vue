<script setup lang="ts">
export interface SStatusDotProps {
  variant?: 'success' | 'warning' | 'danger' | 'accent' | 'neutral'
  size?: 'sm' | 'md'
}

withDefaults(defineProps<SStatusDotProps>(), {
  variant: 'neutral',
  size: 'md',
})
</script>

<template>
  <span
    :class="[
      'rounded-full flex-shrink-0 inline-block',
      {
        'w-1.5 h-1.5': size === 'sm',
        'w-2 h-2': size === 'md',
      },
      {
        'bg-success': variant === 'success',
        'bg-warning': variant === 'warning',
        'bg-danger': variant === 'danger',
        'bg-accent': variant === 'accent',
        'bg-text-secondary': variant === 'neutral',
      },
    ]"
  />
</template>
