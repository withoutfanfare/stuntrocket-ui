<script setup lang="ts">
export interface SSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<SSpinnerProps>(), {
  size: 'sm',
})
</script>

<template>
  <div
    :class="[
      'animate-spin rounded-full border-[1.5px] border-text-secondary/30 border-t-text-secondary',
      {
        'h-3.5 w-3.5': size === 'sm',
        'h-5 w-5': size === 'md',
        'h-8 w-8 border-2': size === 'lg',
      },
    ]"
  />
</template>
