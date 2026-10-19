<script setup lang="ts">
import { ref, watch, toRef, onMounted, onBeforeUnmount, useId } from 'vue'
import { useFocusTrap } from '../../composables'

export interface SModalProps {
  open?: boolean
  maxWidth?: string
  title?: string
  description?: string
  closable?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** ARIA role. Use `'alertdialog'` for confirmation-style modals. */
  role?: 'dialog' | 'alertdialog'
}

const props = withDefaults(defineProps<SModalProps>(), {
  open: false,
  maxWidth: 'max-w-lg',
  closable: true,
  role: 'dialog',
})

const emit = defineEmits<{
  close: []
}>()

const modalRef = ref<HTMLElement | null>(null)
const modalTitleId = `s-modal-title-${useId()}`
const modalDescId = `s-modal-desc-${useId()}`

useFocusTrap(modalRef, toRef(props, 'open'))

const sizeClasses: Record<NonNullable<SModalProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
}

function onOverlayClick(e: MouseEvent) {
  if (!props.closable) return
  if (e.target === e.currentTarget) {
    emit('close')
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open && props.closable) {
    emit('close')
  }
}

// Body scroll lock while the modal is open. `immediate: true` covers the case
// where the modal is mounted with `open: true` (deep link, restored state).
watch(
  () => props.open,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  },
  { immediate: true },
)

// Document-level Escape listener — the previous `@keydown` on the overlay div
// only fired when a child already had focus, which never happened because the
// modal didn't manage focus at all.
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
        class="fixed inset-0 z-50 flex items-start justify-center bg-black/30 dark:bg-black/50"
        @click="onOverlayClick"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-[0.96]"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-[0.96]"
          appear
        >
          <div
            v-if="open"
            ref="modalRef"
            :role="role"
            :aria-modal="true"
            :aria-labelledby="title ? modalTitleId : undefined"
            :aria-describedby="description ? modalDescId : undefined"
            :class="[
              'mt-[15vh] w-full rounded-xl border border-border bg-surface shadow-2xl',
              size ? sizeClasses[size] : maxWidth,
            ]"
          >
            <div v-if="$slots.header || title" class="border-b border-border/80 px-5 py-4 flex items-start justify-between gap-4">
              <slot name="header">
                <div class="flex-1 min-w-0">
                  <h3 :id="modalTitleId" class="text-[14px] font-semibold tracking-tight text-text-primary">{{ title }}</h3>
                  <p v-if="description" :id="modalDescId" class="mt-1 text-[13px] text-text-secondary">{{ description }}</p>
                </div>
              </slot>
              <button
                v-if="closable"
                type="button"
                aria-label="Close"
                class="flex-shrink-0 p-1.5 -m-1 rounded-md text-text-secondary/60 hover:text-text-primary hover:bg-[var(--color-surface-hover)] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface outline-none"
                @click="emit('close')"
              >
                <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </div>
            <div class="px-5 py-5">
              <slot />
            </div>
            <div v-if="$slots.footer" class="border-t border-border/80 px-5 py-4">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
