<script setup lang="ts">
export interface SBackToTopProps {
  visible?: boolean
}

withDefaults(defineProps<SBackToTopProps>(), {
  visible: false,
})

defineEmits<{
  click: []
}>()
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <button
      v-if="visible"
      class="fixed bottom-5 right-6 z-[70] flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-surface/75 shadow-lg backdrop-blur text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
      @click="$emit('click')"
    >
      <svg
        class="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  </Transition>
</template>
