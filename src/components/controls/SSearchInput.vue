<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'

export interface SSearchInputProps {
  modelValue?: string
  placeholder?: string
  compact?: boolean
  clearable?: boolean
  /** Accessible name for the input. Falls back to `placeholder`. */
  label?: string
  /** Visual size variant — 'sm' renders a compact 32px-height input */
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<SSearchInputProps>(), {
  modelValue: '',
  placeholder: 'Search...',
  compact: false,
  clearable: true,
  size: 'md',
})

const isCompact = computed(() => props.compact || props.size === 'sm')
const accessibleName = computed(() => props.label ?? props.placeholder)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'keydown': [event: KeyboardEvent]
}>()

const inputRef = ref<HTMLInputElement | null>(null)

function clear() {
  emit('update:modelValue', '')
  // Restore focus so keyboard flow isn't broken (clearing shouldn't drop Tab).
  nextTick(() => inputRef.value?.focus())
}
</script>

<template>
  <div class="relative">
    <!-- Search icon -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      class="pointer-events-none absolute top-1/2 -translate-y-1/2 text-text-secondary/50"
      :style="{ left: isCompact ? '8px' : '10px', width: '14px', height: '14px' }"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
        clip-rule="evenodd"
      />
    </svg>

    <!-- Input -->
    <input
      ref="inputRef"
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      :aria-label="accessibleName"
      class="w-full border border-border bg-surface-secondary/40 leading-snug text-text-primary placeholder:text-text-secondary/50 outline-none transition-[border-color,box-shadow] duration-150 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:bg-surface"
      :style="{
        height: isCompact ? '32px' : '34px',
        fontSize: isCompact ? '12px' : '13px',
        paddingLeft: '32px',
        paddingRight: '32px',
        borderRadius: isCompact ? '6px' : '10px',
      }"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @keydown="emit('keydown', $event)"
    />

    <!-- Clear button -->
    <button
      v-if="clearable && modelValue"
      type="button"
      aria-label="Clear search"
      class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-text-secondary/40 hover:text-text-secondary transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
      @click="clear"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="w-3.5 h-3.5"
        aria-hidden="true"
      >
        <path
          d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
        />
      </svg>
    </button>
  </div>
</template>
