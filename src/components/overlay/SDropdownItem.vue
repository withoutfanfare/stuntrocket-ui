<script setup lang="ts">
export interface SDropdownItemProps {
  label?: string
  danger?: boolean
  disabled?: boolean
}

withDefaults(defineProps<SDropdownItemProps>(), {
  label: undefined,
  danger: false,
  disabled: false,
})
</script>

<template>
  <button
    type="button"
    :class="[
      'w-full px-2.5 py-[6px] text-[13px] leading-snug text-left rounded-md transition-colors outline-none',
      {
        'text-danger hover:bg-[var(--color-danger-subtle)]': danger && !disabled,
        'text-text-primary hover:bg-[var(--color-surface-hover)]': !danger && !disabled,
        'opacity-50 cursor-not-allowed pointer-events-none': disabled,
      },
    ]"
    :disabled="disabled"
  >
    <slot>{{ label }}</slot>
  </button>
</template>
