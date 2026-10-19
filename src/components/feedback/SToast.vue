<script setup lang="ts">
export interface SToastProps {
  variant?: 'success' | 'error' | 'info'
  visible?: boolean
}

withDefaults(defineProps<SToastProps>(), {
  variant: 'info',
  visible: true,
})

const emit = defineEmits<{
  dismiss: []
}>()
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 translate-y-2 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-2 scale-95"
  >
    <div
      v-if="visible"
      role="status"
      aria-live="polite"
      :class="[
        'flex items-center gap-2.5 px-4 py-2.5 rounded-lg shadow-lg text-[13px] font-medium leading-snug tracking-[-0.01em] cursor-pointer select-none backdrop-blur-sm',
        {
          'bg-success text-white': variant === 'success',
          'bg-danger text-white': variant === 'error',
          'bg-text-primary text-text-inverse': variant === 'info',
        },
      ]"
      @click="emit('dismiss')"
    >
      <slot />
    </div>
  </Transition>
</template>
