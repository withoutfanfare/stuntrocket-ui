<script setup lang="ts">
import { ref, toRef, onMounted, onBeforeUnmount } from 'vue'
import { useFocusTrap } from '../../composables'
import { useScrollLock } from '../../composables/useScrollLock'

export interface SImageLightboxProps {
  open?: boolean
  src: string
  alt?: string
}

const props = withDefaults(defineProps<SImageLightboxProps>(), {
  open: false,
  alt: '',
})

const emit = defineEmits<{
  close: []
}>()

const overlayRef = ref<HTMLElement | null>(null)

useFocusTrap(overlayRef, toRef(props, 'open'))

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) {
    emit('close')
  }
}

// Body scroll lock. `immediate: true` covers mounting with `open: true`.
useScrollLock(() => props.open)

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
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
        ref="overlayRef"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        :aria-label="alt || 'Image lightbox'"
        @click.self="emit('close')"
      >
        <!-- Close button -->
        <button
          type="button"
          class="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-white/60 outline-none"
          aria-label="Close lightbox"
          @click="emit('close')"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Image. The dialog is named by the alt text, or by 'Image lightbox'
             when alt is empty, in which case the img is decorative. -->
        <img
          :src="src"
          :alt="alt"
          class="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
        />
      </div>
    </Transition>
  </Teleport>
</template>
