<script setup lang="ts">
export interface STextProps {
  /** Size variant: body (default 15px), compact (13px), small (12px), xs (11px) */
  size?: 'body' | 'compact' | 'small' | 'xs'
  /** Colour variant: primary, secondary, tertiary, accent, success, warning, danger */
  color?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'danger'
  /** Render as a different element */
  as?: 'p' | 'span' | 'div' | 'label'
  /** Apply medium font weight */
  medium?: boolean
  /** Apply mono font */
  mono?: boolean
  /** Leading: relaxed (prose), snug (UI), none (badges) */
  leading?: 'relaxed' | 'snug' | 'none'
}

withDefaults(defineProps<STextProps>(), {
  size: 'body',
  color: 'primary',
  as: 'p',
  medium: false,
  mono: false,
  leading: undefined,
})
</script>

<template>
  <component
    :is="as"
    :class="[
      'tracking-[-0.01em]',
      {
        // Size
        'text-[15px]': size === 'body',
        'text-[13px]': size === 'compact',
        'text-[12px]': size === 'small',
        'text-[11px]': size === 'xs',

        // Colour
        'text-text-primary': color === 'primary',
        'text-text-secondary': color === 'secondary',
        'text-text-tertiary': color === 'tertiary',
        'text-accent': color === 'accent',
        'text-success': color === 'success',
        'text-warning': color === 'warning',
        'text-danger': color === 'danger',

        // Weight
        'font-medium': medium,

        // Mono
        'font-mono': mono,

        // Leading
        'leading-relaxed': leading === 'relaxed' || (!leading && size === 'body'),
        'leading-snug': leading === 'snug' || (!leading && (size === 'compact' || size === 'small')),
        'leading-none': leading === 'none' || (!leading && size === 'xs'),
      },
    ]"
  >
    <slot />
  </component>
</template>
