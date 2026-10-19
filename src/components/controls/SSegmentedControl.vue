<script setup lang="ts">
import { ref } from 'vue'

export interface SSegmentedControlProps {
  options: { value: string; label: string }[]
  modelValue: string
}

const props = defineProps<SSegmentedControlProps>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const buttonRefs = ref<HTMLButtonElement[]>([])

function setButtonRef(el: Element | unknown, i: number) {
  if (el) buttonRefs.value[i] = el as HTMLButtonElement
}

function onKeydown(e: KeyboardEvent) {
  const currentIndex = props.options.findIndex(o => o.value === props.modelValue)
  if (currentIndex === -1) return

  let nextIndex = -1
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault()
    nextIndex = (currentIndex + 1) % props.options.length
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault()
    nextIndex = (currentIndex - 1 + props.options.length) % props.options.length
  } else if (e.key === 'Home') {
    e.preventDefault()
    nextIndex = 0
  } else if (e.key === 'End') {
    e.preventDefault()
    nextIndex = props.options.length - 1
  }

  if (nextIndex >= 0) {
    emit('update:modelValue', props.options[nextIndex].value)
    buttonRefs.value[nextIndex]?.focus()
  }
}
</script>

<template>
  <div
    role="radiogroup"
    class="inline-flex rounded-md p-0.5 gap-px outline-none"
    :style="{
      background: 'var(--color-surface-hover)',
      border: '1px solid var(--color-border-subtle)',
    }"
    @keydown="onKeydown"
  >
    <button
      v-for="(option, i) in options"
      :key="option.value"
      :ref="(el) => setButtonRef(el, i)"
      type="button"
      role="radio"
      :aria-checked="option.value === modelValue"
      :tabindex="option.value === modelValue ? 0 : -1"
      :class="[
        'px-3 h-6 text-[11px] font-medium leading-none tracking-[0.01em] rounded transition-all duration-100 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
        option.value === modelValue
          ? 'bg-surface text-text-primary shadow-sm'
          : 'text-text-secondary hover:text-text-primary',
      ]"
      @click="emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
