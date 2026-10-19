<script setup lang="ts">
export interface SFormFieldProps {
  label?: string
  error?: string
  required?: boolean
  hint?: string
}

withDefaults(defineProps<SFormFieldProps>(), {
  required: false,
})
</script>

<template>
  <div class="space-y-1.5">
    <label v-if="label" class="block text-[13px] font-medium leading-snug text-text-primary">
      {{ label }}
      <span v-if="required" class="text-danger ml-0.5">*</span>
    </label>
    <slot />
    <p v-if="hint && !error" class="text-[12px] leading-snug text-text-tertiary">
      {{ hint }}
    </p>
    <p v-if="error" class="text-[12px] leading-snug text-danger">
      {{ error }}
    </p>
  </div>
</template>
