<script setup lang="ts">
import { ref, type ComponentPublicInstance } from 'vue'

export interface SViewToggleProps {
  modelValue: string
  options: { value: string; label: string }[]
}

const props = defineProps<SViewToggleProps>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const buttonRefs = ref<HTMLButtonElement[]>([])

function setButtonRef(
  el: Element | ComponentPublicInstance | null,
  i: number,
) {
  if (el instanceof HTMLButtonElement) buttonRefs.value[i] = el
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
  <div role="radiogroup" class="inline-flex rounded-lg border border-border/60 p-0.5 gap-0.5 outline-none" @keydown="onKeydown">
    <button
      v-for="(option, i) in options"
      :ref="(el) => setButtonRef(el as Element | ComponentPublicInstance | null, i)"
      :key="option.value"
      type="button"
      role="radio"
      :aria-checked="option.value === modelValue"
      :tabindex="option.value === modelValue ? 0 : -1"
      :class="[
        'px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-all duration-100 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface whitespace-nowrap inline-flex items-center justify-center',
        option.value === modelValue
          ? 'bg-accent/10 text-accent'
          : 'text-text-secondary hover:text-text-primary',
      ]"
      @click="emit('update:modelValue', option.value)"
    >
      <slot name="option" :option="option" :active="option.value === modelValue">
        {{ option.label }}
      </slot>
    </button>
  </div>
</template>
