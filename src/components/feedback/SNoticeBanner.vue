<script setup lang="ts">
import { computed } from 'vue'

export interface SNoticeBannerProps {
  variant?: 'info' | 'warning' | 'danger'
  dismissible?: boolean
}

const props = withDefaults(defineProps<SNoticeBannerProps>(), {
  variant: 'info',
  dismissible: false,
})

const emit = defineEmits<{
  dismiss: []
}>()

const variantStyle = computed(() => {
  switch (props.variant) {
    case 'warning':
      return { background: 'var(--color-warning-subtle)', color: 'var(--color-warning)' }
    case 'danger':
      return { background: 'var(--color-danger-subtle)', color: 'var(--color-danger)' }
    case 'info':
    default:
      return { background: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }
  }
})
</script>

<template>
  <div
    role="alert"
    class="flex items-start gap-2.5 px-3.5 py-2.5 text-[13px] font-medium leading-relaxed tracking-[-0.01em] rounded-lg"
    :style="variantStyle"
  >
    <span class="flex-1">
      <slot />
    </span>
    <button
      v-if="dismissible"
      class="w-5 h-5 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity shrink-0"
      aria-label="Dismiss"
      @click="emit('dismiss')"
    >
      <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
      </svg>
    </button>
  </div>
</template>
