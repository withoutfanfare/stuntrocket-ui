<script setup lang="ts">
import { useId } from 'vue'

export interface STextareaProps {
  modelValue?: string
  placeholder?: string
  rows?: number
  disabled?: boolean
  label?: string
  error?: string
  hint?: string
  required?: boolean
}

withDefaults(defineProps<STextareaProps>(), {
  modelValue: '',
  placeholder: '',
  rows: 4,
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputId = `s-textarea-${useId()}`
const hintId = `s-textarea-hint-${useId()}`
const errorId = `s-textarea-error-${useId()}`
</script>

<template>
  <div class="space-y-1.5">
    <label v-if="label" :for="inputId" class="block text-[13px] font-medium leading-snug text-text-primary">
      {{ label }}
      <span v-if="required" class="text-danger ml-0.5">*</span>
    </label>
    <textarea
      :id="inputId"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      :required="required"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error ? errorId : hint ? hintId : undefined"
      :class="[
        'w-full rounded-md border bg-surface-secondary/40 px-3 py-2 text-sm leading-relaxed text-text-primary placeholder:text-text-secondary/50 outline-none transition-[border-color,box-shadow] duration-150 focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-50 disabled:cursor-not-allowed resize-y',
        error ? 'border-danger' : 'border-border/70',
      ]"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <p v-if="hint && !error" :id="hintId" class="text-[12px] leading-snug text-text-tertiary">
      {{ hint }}
    </p>
    <p v-if="error" :id="errorId" class="text-[12px] leading-snug text-danger" role="alert">
      {{ error }}
    </p>
  </div>
</template>
