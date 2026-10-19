<script setup lang="ts">
import SSearchInput from './SSearchInput.vue'

export interface SSearchFilterBarProps {
  modelValue?: string
  filters?: { label: string; value: string }[]
  activeFilter?: string
  placeholder?: string
}

withDefaults(defineProps<SSearchFilterBarProps>(), {
  modelValue: '',
  filters: () => [],
  activeFilter: '',
  placeholder: 'Search...',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:activeFilter': [value: string]
}>()
</script>

<template>
  <div class="flex items-center gap-2">
    <SSearchInput
      :model-value="modelValue"
      :placeholder="placeholder"
      class="flex-1 max-w-xs"
      @update:model-value="emit('update:modelValue', $event)"
    />

    <div
      v-if="filters.length > 0"
      role="group"
      aria-label="Filters"
      class="flex items-center gap-0.5 rounded-md p-0.5"
      :style="{ background: 'var(--color-surface-hover)', border: '1px solid var(--color-border-subtle)' }"
    >
      <button
        v-for="filter in filters"
        :key="filter.value"
        type="button"
        :aria-pressed="filter.value === activeFilter"
        :class="[
          'px-2.5 h-6 text-[11px] font-medium leading-none rounded transition-all duration-100 whitespace-nowrap outline-none',
          filter.value === activeFilter
            ? 'bg-surface text-text-primary shadow-sm'
            : 'text-text-secondary hover:text-text-primary',
        ]"
        @click="emit('update:activeFilter', filter.value)"
      >
        {{ filter.label }}
      </button>
    </div>

    <slot />
  </div>
</template>
