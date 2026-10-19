<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

export interface SButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'icon'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  to?: string
}

const props = withDefaults(defineProps<SButtonProps>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
})

const borderRadius = computed(() => {
  if (props.variant === 'icon') return '10px'
  return props.size === 'sm' ? '6px' : '10px'
})

// `<a>` (RouterLink) ignores the `disabled` attribute — so when a disabled or
// loading link is requested, render a `<button disabled>` instead. Otherwise
// the link would remain fully clickable.
const isDisabled = computed(() => props.disabled || props.loading)
const renderAs = computed(() => (props.to && !isDisabled.value) ? RouterLink : 'button')
</script>

<template>
  <component
    :is="renderAs"
    :to="renderAs === 'button' ? undefined : props.to"
    :type="renderAs === 'button' ? 'button' : undefined"
    :class="[
      'inline-flex items-center justify-center font-medium tracking-[-0.01em] transition-all duration-150 outline-none',
      {
        // Variants
        'bg-accent text-white hover:opacity-90 active:opacity-85': variant === 'primary',
        'border border-border text-text-primary hover:bg-surface-secondary hover:border-border-strong': variant === 'secondary',
        'bg-danger text-white hover:opacity-90 active:opacity-85': variant === 'danger',
        'text-text-secondary hover:bg-surface-secondary/60 hover:text-text-primary': variant === 'ghost',
        'w-7 h-7 text-text-secondary hover:bg-surface-secondary/80 hover:text-text-primary': variant === 'icon',

        // Sizes (non-icon)
        'px-3 py-1.5 text-xs leading-snug gap-1.5 min-h-8': size === 'sm' && variant !== 'icon',
        'px-4 py-1.5 text-sm leading-snug gap-2': size === 'md' && variant !== 'icon',
        'px-5 py-2 text-sm leading-snug gap-2': size === 'lg' && variant !== 'icon',

        // Focus
        'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface': true,

        // States
        'opacity-50 cursor-not-allowed pointer-events-none': disabled || loading,
      },
    ]"
    :style="{ borderRadius }"
    :disabled="renderAs === 'button' ? isDisabled : undefined"
    :aria-disabled="renderAs !== 'button' && isDisabled ? 'true' : undefined"
  >
    <span
      v-if="loading"
      class="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-current/30 border-t-current"
      aria-hidden="true"
    />
    <slot />
  </component>
</template>
