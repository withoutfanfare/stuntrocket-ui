<script setup lang="ts">
import { computed } from 'vue'

export interface SKpiCardProps {
  label: string
  value: string | number
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

const props = withDefaults(defineProps<SKpiCardProps>(), {
  variant: 'default',
})

const valueClass = computed(() => {
  switch (props.variant) {
    case 'success': return 'text-success'
    case 'warning': return 'text-warning'
    case 'danger': return 'text-danger'
    case 'info': return 'text-accent'
    default: return 'text-text-primary'
  }
})

const valueGlow = computed(() => {
  const glowMap: Record<string, string> = {
    success: '0 0 20px color-mix(in srgb, var(--color-success) 30%, transparent)',
    warning: '0 0 20px color-mix(in srgb, var(--color-warning) 30%, transparent)',
    danger: '0 0 20px color-mix(in srgb, var(--color-danger) 30%, transparent)',
    info: '0 0 20px color-mix(in srgb, var(--color-accent) 30%, transparent)',
  }
  return glowMap[props.variant] ?? undefined
})
</script>

<template>
  <div class="rounded-xl border border-border bg-surface p-4">
    <div class="flex items-start gap-3">
      <!-- Icon slot -->
      <div
        v-if="$slots.icon"
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-secondary/60"
      >
        <span class="w-[18px] h-[18px] text-text-secondary">
          <slot name="icon" />
        </span>
      </div>

      <div class="min-w-0">
        <p class="text-[11px] font-medium tracking-wide text-text-secondary uppercase">{{ label }}</p>
        <p
          :class="['truncate text-2xl font-semibold tabular-nums', valueClass]"
          :style="valueGlow ? { textShadow: valueGlow } : undefined"
        >
{{ value }}
</p>
      </div>
    </div>

    <!-- Footer slot for sparklines, trends, or other supplementary content -->
    <div v-if="$slots.footer" class="mt-2">
      <slot name="footer" />
    </div>
  </div>
</template>
