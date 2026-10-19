<script setup lang="ts">
import { computed, useId } from 'vue'

export interface SCheckboxProps {
  modelValue: boolean
  label?: string
  description?: string
  disabled?: boolean
  danger?: boolean
}

const props = withDefaults(defineProps<SCheckboxProps>(), {
  disabled: false,
  danger: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// Combine label + description into the accessible name so screen-reader users
// hear both. (Just `label` misses the descriptive context.)
const accessibleName = computed(() =>
  [props.label, props.description].filter(Boolean).join(', '),
)

const checkboxId = `s-checkbox-${useId()}`

function toggle() {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}
</script>

<template>
  <div
    :class="['flex items-start gap-3 select-none group', disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer']"
    @click="toggle"
  >
    <div class="flex-shrink-0 mt-0.5">
      <button
        :id="checkboxId"
        type="button"
        role="checkbox"
        :aria-checked="modelValue"
        :aria-label="accessibleName"
        :class="[
          'w-4 h-4 rounded border flex items-center justify-center transition-all duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2',
          modelValue
            ? danger ? 'bg-danger border-danger' : 'bg-accent border-accent'
            : 'bg-surface border-border group-hover:border-border-strong',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        ]"
        :disabled="disabled"
        @click.stop="toggle"
      >
        <svg v-if="modelValue" class="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M2 6l3 3 5-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
    <div v-if="label || description" class="flex-1 min-w-0">
      <label
        v-if="label"
        :for="checkboxId"
        :class="['text-[13px] font-medium', danger && modelValue ? 'text-danger' : 'text-text-primary']"
      >{{ label }}</label>
      <p v-if="description" class="text-[11px] text-text-secondary mt-0.5">{{ description }}</p>
    </div>
  </div>
</template>
