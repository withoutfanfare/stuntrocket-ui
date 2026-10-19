<script setup lang="ts">
export interface SToolbarProps {
  /** Wrap items when they overflow */
  wrap?: boolean
}

withDefaults(defineProps<SToolbarProps>(), {
  wrap: true,
})
</script>

<template>
  <div
    :class="[
      'flex items-center gap-2',
      wrap ? 'flex-wrap' : '',
    ]"
  >
    <slot />
    <div v-if="$slots.actions" class="ml-auto flex items-center gap-1.5">
      <slot name="actions" />
    </div>
  </div>
</template>
