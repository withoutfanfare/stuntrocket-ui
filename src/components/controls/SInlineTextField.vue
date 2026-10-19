<script setup lang="ts">
import { ref, nextTick } from 'vue'

export interface SInlineTextFieldProps {
  modelValue: string
  placeholder?: string
  error?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<SInlineTextFieldProps>(), {
  placeholder: '',
  error: '',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isEditing = ref(false)
const editValue = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const cancelled = ref(false)

function enterEditMode() {
  if (props.disabled) return
  editValue.value = props.modelValue ?? ''
  isEditing.value = true
  nextTick(() => {
    inputRef.value?.focus()
    inputRef.value?.select()
  })
}

function save() {
  if (cancelled.value) { cancelled.value = false; return }
  isEditing.value = false
  if (editValue.value !== props.modelValue) {
    emit('update:modelValue', editValue.value)
  }
}

function cancel() {
  cancelled.value = true
  isEditing.value = false
  editValue.value = props.modelValue
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault()
    // Remove input from DOM via isEditing, which triggers blur.
    // The cancelled flag prevents blur from double-emitting.
    cancelled.value = true
    isEditing.value = false
    if (editValue.value !== props.modelValue) {
      emit('update:modelValue', editValue.value)
    }
  } else if (event.key === 'Escape') {
    event.preventDefault()
    cancel()
  }
}
</script>

<template>
  <div class="inline-flex flex-col">
    <!-- Edit mode -->
    <input
      v-if="isEditing"
      ref="inputRef"
      v-model="editValue"
      type="text"
      :placeholder="placeholder"
      class="rounded-md border border-border bg-surface-secondary/40 px-1.5 py-1 text-[13px] leading-snug text-text-primary placeholder:text-text-secondary/50 outline-none transition-[border-color,box-shadow] duration-150 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:bg-surface"
      @blur="save"
      @keydown="onKeydown"
    />

    <!-- Display mode -->
    <span
      v-else
      role="button"
      :tabindex="disabled ? -1 : 0"
      :aria-disabled="disabled || undefined"
      :class="[
        'rounded-md px-1.5 py-1 text-[13px] leading-snug transition-colors duration-150',
        disabled
          ? 'opacity-50 cursor-not-allowed text-text-primary'
          : 'cursor-pointer text-text-primary hover:bg-surface-secondary/60',
      ]"
      @click="enterEditMode"
      @keydown.enter="enterEditMode"
      @keydown.space.prevent="enterEditMode"
    >
      <template v-if="modelValue">{{ modelValue }}</template>
      <span v-else class="text-text-secondary/50">{{ placeholder }}</span>
    </span>

    <!-- Error message -->
    <span v-if="error" class="mt-0.5 text-[11px] text-danger">
      {{ error }}
    </span>
  </div>
</template>
