<script setup lang="ts">
import { useToastStack } from '../../composables/useToastStack'

const { toasts, removeToast } = useToastStack()

function variantClasses(variant: 'success' | 'error' | 'info' | 'warning') {
  switch (variant) {
    case 'success':
      return 'bg-success text-white'
    case 'error':
      return 'bg-danger text-white'
    case 'info':
      return 'bg-text-primary text-text-inverse'
    case 'warning':
      return 'bg-warning text-white'
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed bottom-5 right-5 z-[200] flex flex-col-reverse gap-2 pointer-events-none">
      <TransitionGroup
        enter-active-class="duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-2 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="duration-150 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-4"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto"
        >
          <div
            :class="[
              'flex items-center gap-2.5 px-4 py-2.5 rounded-lg shadow-lg text-[13px] font-medium leading-snug cursor-pointer select-none backdrop-blur-sm max-w-[320px]',
              variantClasses(toast.variant),
            ]"
            role="status"
            :aria-live="toast.variant === 'error' ? 'assertive' : 'polite'"
            @click="removeToast(toast.id)"
          >
            {{ toast.message }}
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
