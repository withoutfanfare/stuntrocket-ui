<script setup lang="ts">
import { useId } from 'vue'

export interface SSelectProps {
  modelValue?: string
  disabled?: boolean
  size?: 'sm' | 'md'
  label?: string
  error?: string
  hint?: string
  required?: boolean
}

withDefaults(defineProps<SSelectProps>(), {
  modelValue: '',
  disabled: false,
  size: 'md',
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputId = `s-select-${useId()}`
const hintId = `s-select-hint-${useId()}`
const errorId = `s-select-error-${useId()}`
</script>

<template>
  <div class="space-y-1.5">
    <label v-if="label" :for="inputId" class="block text-[13px] font-medium leading-snug text-text-primary">
      {{ label }}
      <span v-if="required" class="text-danger ml-0.5">*</span>
    </label>
    <select
      :id="inputId"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error ? errorId : hint ? hintId : undefined"
      :class="[
        'ui-select',
        { 'ui-select-sm': size === 'sm' },
        error ? 'border-danger' : '',
      ]"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <slot />
    </select>
    <p v-if="hint && !error" :id="hintId" class="text-[12px] leading-snug text-text-tertiary">
      {{ hint }}
    </p>
    <p v-if="error" :id="errorId" class="text-[12px] leading-snug text-danger" role="alert">
      {{ error }}
    </p>
  </div>
</template>
