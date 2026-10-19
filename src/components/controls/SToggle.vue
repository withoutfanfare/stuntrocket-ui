<script setup lang="ts">
import { computed, useId } from 'vue'

export interface SToggleProps {
  modelValue: boolean
  label?: string
  description?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<SToggleProps>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const accessibleName = computed(() =>
  [props.label, props.description].filter(Boolean).join(', '),
)

const toggleId = `s-toggle-${useId()}`

function toggle() {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}
</script>

<template>
  <div
    :class="[
      'flex items-start gap-3 select-none',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    ]"
    @click="toggle"
  >
    <button
      :id="toggleId"
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :aria-label="accessibleName"
      :class="[
        'relative inline-flex h-[22px] w-[40px] flex-shrink-0 rounded-full',
        'transition-colors duration-200 ease-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2',
        modelValue ? 'bg-accent' : 'bg-border',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
      ]"
      :disabled="disabled"
      @click.stop="toggle"
    >
      <span
        :class="[
          'pointer-events-none inline-block h-[18px] w-[18px] rounded-full bg-white shadow-sm',
          'transform transition-transform duration-200 ease-out',
          modelValue ? 'translate-x-[20px]' : 'translate-x-[2px]',
        ]"
        style="margin-top: 2px"
      />
    </button>

    <div v-if="label || description" class="flex-1 min-w-0">
      <label v-if="label" :for="toggleId" class="text-[13px] font-medium text-text-primary">
        {{ label }}
      </label>
      <p v-if="description" class="text-[11px] text-text-secondary mt-0.5">
        {{ description }}
      </p>
    </div>
  </div>
</template>
