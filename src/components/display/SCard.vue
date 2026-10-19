<script setup lang="ts">
export interface SCardProps {
  variant?: 'content' | 'sidebar' | 'list' | 'nested' | 'glass'
  hoverable?: boolean
}

withDefaults(defineProps<SCardProps>(), {
  variant: 'glass',
  hoverable: false,
})
</script>

<template>
  <div
    :class="[
      'rounded-xl transition-[background-color,border-color] duration-150',
      {
        // Content header card
        'border border-border/60 bg-surface/50 backdrop-blur-xl px-4 py-4 shadow-[0_14px_30px_-26px_rgba(15,23,42,0.8)]':
          variant === 'content',

        // Right sidebar / floating card
        'border border-border/60 bg-surface/52 backdrop-blur-xl p-3.5 shadow-[0_10px_30px_-24px_rgba(0,0,0,0.85)]':
          variant === 'sidebar',

        // List item card
        'rounded-lg border border-border bg-surface p-3': variant === 'list',
        'hover:bg-surface-secondary/70': variant === 'list' && hoverable,

        // Nested item card
        'rounded-lg border border-border/60 bg-surface-secondary/28 p-2.5': variant === 'nested',

        // Glass card (glassmorphism)
        'card-glass p-5': variant === 'glass',
        'card-glass-interactive': variant === 'glass' && hoverable,
      },
    ]"
  >
    <slot />
  </div>
</template>

<style>
.card-glass {
  /* Drive from tokens so the glass variant adapts to light/dark/accent. */
  background: color-mix(in srgb, var(--color-surface) 65%, transparent);
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid color-mix(in srgb, var(--color-text-primary) 6%, transparent);
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--color-text-primary) 4%, transparent);
  border-radius: var(--radius-xl, 12px);
}

.card-glass-interactive {
  transition: border-color 150ms ease, background-color 150ms ease;
}
.card-glass-interactive:hover {
  border-color: color-mix(in srgb, var(--color-text-primary) 10%, transparent);
  background: color-mix(in srgb, var(--color-surface) 78%, transparent);
}
</style>
