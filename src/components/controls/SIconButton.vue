<script setup lang="ts">
export interface SIconButtonProps {
  variant?: 'ghost' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  tooltip?: string
  active?: boolean
}

const props = withDefaults(defineProps<SIconButtonProps>(), {
  variant: 'ghost',
  size: 'md',
  disabled: false,
  loading: false,
  active: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

if (import.meta.env.DEV && !props.tooltip) {
  console.warn('[SIconButton] Icon-only buttons should have a tooltip prop for accessibility.')
}

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    type="button"
    :class="[
      'inline-flex items-center justify-center rounded-lg outline-none select-none transition-all duration-150',
      'focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      // Size
      {
        'w-7 h-7': size === 'sm',
        'w-8 h-8': size === 'md',
        'w-10 h-10': size === 'lg',
      },
      // Variant
      variant === 'ghost' && !active && 'text-text-secondary hover:bg-[var(--color-surface-hover)] hover:text-text-primary active:scale-95',
      variant === 'ghost' && active && 'bg-[var(--color-surface-hover)] text-text-primary',
      variant === 'secondary' && !active && 'bg-surface-secondary/50 text-text-secondary border border-border/60 hover:bg-surface-secondary hover:text-text-primary hover:border-border active:scale-95',
      variant === 'secondary' && active && 'bg-surface-secondary text-text-primary border border-border',
      variant === 'danger' && !active && 'text-text-secondary hover:bg-[var(--color-danger-subtle)] hover:text-danger active:scale-95',
      variant === 'danger' && active && 'bg-[var(--color-danger-subtle)] text-danger',
      variant === 'success' && !active && 'text-text-secondary hover:bg-[var(--color-success-subtle)] hover:text-success active:scale-95',
      variant === 'success' && active && 'bg-[var(--color-success-subtle)] text-success',
      loading && 'cursor-wait',
    ]"
    :disabled="disabled || loading"
    :title="tooltip"
    :aria-label="tooltip"
    @click="handleClick"
  >
    <!-- Loading spinner -->
    <svg
      v-if="loading"
      :class="[
        'animate-spin',
        { 'w-3.5 h-3.5': size === 'sm', 'w-4 h-4': size === 'md', 'w-5 h-5': size === 'lg' },
      ]"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>

    <!-- Icon slot -->
    <span
      v-else
      :class="{
        'w-3.5 h-3.5': size === 'sm',
        'w-4 h-4': size === 'md',
        'w-5 h-5': size === 'lg',
      }"
    >
      <slot />
    </span>
  </button>
</template>
