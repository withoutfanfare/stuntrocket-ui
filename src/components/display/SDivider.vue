<script setup lang="ts">
export interface SDividerProps {
  orientation?: 'horizontal' | 'vertical'
  subtle?: boolean
}

withDefaults(defineProps<SDividerProps>(), {
  orientation: 'horizontal',
  subtle: false,
})
</script>

<template>
  <div
    role="separator"
    :aria-orientation="orientation"
    :class="[
      {
        'h-px w-full': orientation === 'horizontal',
        'w-px self-stretch': orientation === 'vertical',
      },
      {
        'bg-border/40': subtle,
        'bg-border/60': !subtle,
      },
    ]"
  />
</template>
