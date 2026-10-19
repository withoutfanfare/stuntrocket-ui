<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'

export interface SRouteProgressBarProps {
  loading?: boolean
  color?: string
}

const props = withDefaults(defineProps<SRouteProgressBarProps>(), {
  loading: false,
})

const barState = ref<'idle' | 'loading' | 'completing' | 'done'>('idle')
const completingTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const doneTimer = ref<ReturnType<typeof setTimeout> | null>(null)

function clearTimers() {
  if (completingTimer.value) { clearTimeout(completingTimer.value); completingTimer.value = null }
  if (doneTimer.value) { clearTimeout(doneTimer.value); doneTimer.value = null }
}

onBeforeUnmount(clearTimers)

watch(
  () => props.loading,
  (isLoading) => {
    clearTimers()
    if (isLoading) {
      barState.value = 'loading'
    } else if (barState.value === 'loading') {
      barState.value = 'completing'
      completingTimer.value = setTimeout(() => {
        barState.value = 'done'
        doneTimer.value = setTimeout(() => {
          barState.value = 'idle'
        }, 200)
      }, 300)
    }
  },
  { immediate: true },
)

const barStyle = computed(() => {
  const base: Record<string, string> = {
    backgroundColor: props.color || 'var(--color-accent)',
  }

  if (barState.value === 'loading') {
    // Drive width via inline style so the completing transition has a concrete start
    base.width = '80%'
    base.transition = 'width 2s ease-out'
  } else if (barState.value === 'completing') {
    base.width = '100%'
    base.transition = 'width 200ms ease-out'
  } else if (barState.value === 'done') {
    base.width = '100%'
    base.opacity = '0'
    base.transition = 'opacity 200ms ease-out'
  }

  return base
})
</script>

<template>
  <div
    v-if="barState !== 'idle'"
    class="fixed top-0 left-0 right-0 z-50 h-[2px] pointer-events-none"
    role="progressbar"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="barState === 'loading' ? 80 : barState === 'completing' || barState === 'done' ? 100 : undefined"
    :aria-valuetext="barState === 'loading' ? 'loading' : barState === 'completing' ? 'completing' : undefined"
  >
    <div
      class="h-full rounded-r-full"
      :style="barStyle"
    />
  </div>
</template>
