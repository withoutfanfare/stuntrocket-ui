<script setup lang="ts">
import { useId } from 'vue'

export interface SInputProps {
  modelValue?: string | number
  placeholder?: string
  type?: string
  disabled?: boolean
  label?: string
  error?: string
  hint?: string
  required?: boolean
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<SInputProps>(), {
  modelValue: '',
  placeholder: '',
  type: 'text',
  disabled: false,
  required: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const inputId = `s-input-${useId()}`
const hintId = `s-input-hint-${useId()}`
const errorId = `s-input-error-${useId()}`

function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  // Coerce to number when type="number" so consumers don't have to.
  if (props.type === 'number') {
    emit('update:modelValue', target.value === '' ? '' : Number(target.value))
  } else {
    emit('update:modelValue', target.value)
  }
}
</script>

<template>
  <!-- Single-root wrapper so the input never unmounts when an error appears
       mid-typing (the old fragment + v-if pattern lost focus & caret). -->
  <div class="space-y-1.5">
    <label v-if="label" :for="inputId" class="block text-[13px] font-medium leading-snug text-text-primary">
      {{ label }}
      <span v-if="required" class="text-danger ml-0.5">*</span>
    </label>
    <input
      :id="inputId"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error ? errorId : hint ? hintId : undefined"
      :class="[
        'w-full rounded-md border bg-surface leading-snug text-text-primary placeholder:text-text-secondary/50 outline-none transition-[border-color,box-shadow] duration-150 focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-50 disabled:cursor-not-allowed',
        size === 'sm' ? 'min-h-8 px-2.5 py-1 text-xs' : 'px-3 py-[7px] text-sm',
        error ? 'border-danger' : 'border-border',
      ]"
      @input="onInput"
    />
    <p v-if="hint && !error" :id="hintId" class="text-[12px] leading-snug text-text-tertiary">
      {{ hint }}
    </p>
    <p v-if="error" :id="errorId" class="text-[12px] leading-snug text-danger" role="alert">
      {{ error }}
    </p>
  </div>
</template>
