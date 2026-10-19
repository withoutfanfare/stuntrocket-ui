<script setup lang="ts">
import { ref, watch, toRef, onMounted, onBeforeUnmount, useId } from 'vue'
import { useFocusTrap } from '../../composables'

export interface SDrawerProps {
  open?: boolean
  side?: 'left' | 'right'
  title?: string
  subtitle?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closable?: boolean
  overlay?: boolean
}

const props = withDefaults(defineProps<SDrawerProps>(), {
  open: false,
  side: 'right',
  size: 'md',
  closable: true,
  overlay: true,
})

const emit = defineEmits<{
  close: []
}>()

const drawerRef = ref<HTMLElement | null>(null)
// Per-instance id so multiple drawers never share DOM ids.
const drawerId = `s-drawer-title-${useId()}`

useFocusTrap(drawerRef, toRef(props, 'open'))

const sizeClasses: Record<NonNullable<SDrawerProps['size']>, string> = {
  sm: 'max-w-xs',
  md: 'max-w-sm',
  lg: 'max-w-md',
  xl: 'max-w-xl',
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open && props.closable) {
    emit('close')
  }
}

// Body scroll lock. `immediate: true` covers mounting with `open: true`.
watch(
  () => props.open,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  },
  { immediate: true },
)

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        :class="[
          'fixed inset-0 z-50 flex',
          side === 'right' ? 'justify-end' : 'justify-start',
        ]"
      >
        <!-- Overlay backdrop -->
        <div
          v-if="overlay"
          class="absolute inset-0 bg-black/40"
          @click="closable ? emit('close') : undefined"
        />

        <!-- Drawer -->
        <Transition
          :enter-active-class="'transition duration-200 ease-out'"
          :enter-from-class="side === 'right' ? 'translate-x-full' : '-translate-x-full'"
          :enter-to-class="'translate-x-0'"
          :leave-active-class="'transition duration-150 ease-in'"
          :leave-from-class="'translate-x-0'"
          :leave-to-class="side === 'right' ? 'translate-x-full' : '-translate-x-full'"
          appear
        >
          <div
            ref="drawerRef"
            :class="[
              'relative w-full h-full flex flex-col bg-surface shadow-2xl',
              side === 'right' ? 'border-l border-border' : 'border-r border-border',
              sizeClasses[size],
            ]"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="title ? drawerId : undefined"
          >
            <!-- Header -->
            <div class="flex-shrink-0 flex items-start justify-between gap-4 px-5 py-4 border-b border-border/80">
              <div class="flex items-start gap-3 flex-1 min-w-0">
                <slot name="icon" />
                <slot name="header">
                  <div class="flex-1 min-w-0">
                    <h2 :id="drawerId" class="text-base font-semibold text-text-primary">{{ title }}</h2>
                    <p v-if="subtitle" class="mt-0.5 text-[12px] text-text-secondary">{{ subtitle }}</p>
                  </div>
                </slot>
              </div>
              <button
                v-if="closable"
                type="button"
                aria-label="Close drawer"
                class="flex-shrink-0 p-1.5 -m-1 rounded-md text-text-secondary/60 hover:text-text-primary hover:bg-[var(--color-surface-hover)] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface outline-none"
                @click="emit('close')"
              >
                <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto px-5 py-5">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="flex-shrink-0 flex items-center justify-end gap-3 px-5 py-4 border-t border-border/80">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
