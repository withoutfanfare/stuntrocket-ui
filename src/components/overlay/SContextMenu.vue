<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useContextMenu } from '../../composables'

// No props — reads from the useContextMenu singleton.
const { visible, position, items, close } = useContextMenu()

function onClickOutside() {
  if (visible.value) close()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && visible.value) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
  document.removeEventListener('keydown', onKeydown)
})

function runItem(item: (typeof items.value)[number]) {
  // try/finally so the menu closes even if the action throws — otherwise a
  // failing action leaves the menu stuck open.
  try {
    if (!item.disabled) item.action()
  } finally {
    close()
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-[120ms] ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-[80ms] ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="visible"
        class="fixed min-w-[160px] p-1 bg-surface border border-border/80 rounded-lg shadow-lg z-[100]"
        :style="{ left: position.x + 'px', top: position.y + 'px' }"
        role="menu"
      >
        <button
          v-for="(item, index) in items"
          :key="`${item.label}-${index}`"
          type="button"
          role="menuitem"
          :class="[
            'w-full px-2.5 py-[6px] text-[13px] leading-snug text-left rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent',
            {
              'text-danger hover:bg-[var(--color-danger-subtle)]': item.danger && !item.disabled,
              'text-text-primary hover:bg-[var(--color-surface-hover)]': !item.danger && !item.disabled,
              'opacity-50 cursor-not-allowed pointer-events-none': item.disabled,
            },
          ]"
          :disabled="item.disabled"
          @click="runItem(item)"
        >
          {{ item.label }}
        </button>
      </div>
    </Transition>
  </Teleport>
</template>
