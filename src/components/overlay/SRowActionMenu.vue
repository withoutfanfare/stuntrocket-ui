<script setup lang="ts">
import SDropdownMenu from './SDropdownMenu.vue'

export interface SRowActionMenuProps {
  actions: { label: string; value: string; danger?: boolean; disabled?: boolean }[]
  align?: 'left' | 'right'
  /** Accessible label for the trigger button (default "Row actions"). */
  label?: string
}

withDefaults(defineProps<SRowActionMenuProps>(), {
  align: 'right',
  label: 'Row actions',
})

const emit = defineEmits<{
  select: [value: string]
}>()

function onSelect(value: string) {
  emit('select', value)
}
</script>

<template>
  <SDropdownMenu :items="actions" :align="align" @select="onSelect">
    <template #trigger="{ toggle, open }">
      <button
        type="button"
        :aria-label="label"
        aria-haspopup="menu"
        :aria-expanded="open"
        :class="[
          'w-7 h-7 flex items-center justify-center rounded-md text-text-secondary/60 hover:text-text-primary hover:bg-surface-secondary/60 transition-colors duration-150 outline-none',
          open && 'bg-surface-secondary/60 text-text-primary',
        ]"
        @click="toggle"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
          <path d="M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM11.5 15.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
        </svg>
      </button>
    </template>
  </SDropdownMenu>
</template>
