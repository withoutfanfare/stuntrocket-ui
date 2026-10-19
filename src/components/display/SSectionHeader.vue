<script setup lang="ts">
export interface SSectionHeaderProps {
  title: string
  count?: number
  actionLabel?: string
}

withDefaults(defineProps<SSectionHeaderProps>(), {
  count: undefined,
  actionLabel: undefined,
})

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div class="flex items-center justify-between py-2">
    <div class="flex items-center gap-1.5">
      <h3 class="text-[11px] font-semibold uppercase tracking-[0.06em] leading-none text-text-secondary select-none">
        {{ title }}
      </h3>
      <span
        v-if="count !== undefined"
        class="inline-flex items-center h-4 min-w-[16px] justify-center px-1 rounded-full border border-border/70 bg-surface-secondary/30 text-[10px] font-medium leading-none text-text-secondary tabular-nums"
      >
        {{ count }}
      </span>
    </div>
    <button
      v-if="actionLabel"
      class="text-[11px] font-medium text-accent hover:opacity-80 transition-colors"
      @click="emit('action')"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>
