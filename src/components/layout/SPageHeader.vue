<script setup lang="ts">
export interface SPageHeaderProps {
  sticky?: boolean
}

withDefaults(defineProps<SPageHeaderProps>(), {
  sticky: true,
})
</script>

<template>
  <div
    :class="[
      'flex items-center justify-between gap-4 px-5 h-[52px]',
      sticky && 'sticky top-0 z-20 bg-surface-app/80 backdrop-blur-sm',
    ]"
  >
    <div class="flex items-center gap-3 min-w-0">
      <slot name="prepend" />
    </div>
    <div class="flex items-center gap-2 flex-shrink-0">
      <slot name="actions" />
    </div>
  </div>
</template>
