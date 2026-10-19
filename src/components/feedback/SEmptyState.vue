<script setup lang="ts">
export interface SEmptyStateProps {
  title?: string
  description?: string
}

withDefaults(defineProps<SEmptyStateProps>(), {
  title: '',
  description: '',
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12 text-center">
    <div class="mb-3 text-text-secondary/40">
      <slot name="icon">
        <svg class="w-10 h-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      </slot>
    </div>
    <p v-if="title" class="text-[15px] font-semibold tracking-tight text-text-primary mb-1">{{ title }}</p>
    <p v-if="description" class="text-[13px] leading-relaxed text-text-secondary max-w-[260px]">{{ description }}</p>
    <div v-if="$slots.action" class="mt-4">
      <slot name="action" />
    </div>
  </div>
</template>
