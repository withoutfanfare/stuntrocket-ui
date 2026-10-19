<script setup lang="ts">
import { ref, computed } from 'vue'

export interface SListRowProps {
  selected?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<SListRowProps>(), {
  selected: false,
  disabled: false,
})

const emit = defineEmits<{
  click: []
}>()

// Track hover in a ref (rather than mutating `$el.style`) so reactivity owns
// the styling and the override can't be lost mid-hover.
const isHovered = ref(false)

const backgroundColor = computed(() => {
  if (props.selected) return 'var(--color-surface-selected)'
  if (isHovered.value && !props.disabled) return 'var(--color-surface-hover)'
  return undefined
})

function handleClick() {
  emit('click')
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('click')
  }
}
</script>

<template>
  <div
    role="button"
    :tabindex="disabled ? -1 : 0"
    :class="[
      'flex items-center min-h-[34px] px-3 gap-2 rounded-md cursor-pointer select-none transition-colors',
      'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent outline-none',
      {
        'opacity-50 cursor-not-allowed': disabled,
      },
    ]"
    :style="{ backgroundColor }"
    @click="!disabled && handleClick()"
    @keydown="!disabled && handleKeydown($event)"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="flex-1 min-w-0 flex items-center gap-2">
      <slot />
    </div>
    <div class="flex-shrink-0 flex items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
