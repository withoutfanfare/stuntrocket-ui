<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'

export interface SCommandPaletteProps {
  open?: boolean
  placeholder?: string
  /** Number of results currently rendered in the default slot. Used to clamp keyboard selection. */
  resultCount?: number
}

const props = withDefaults(defineProps<SCommandPaletteProps>(), {
  open: false,
  placeholder: 'Search...',
  resultCount: 0,
})

const emit = defineEmits<{
  close: []
  'update:query': [value: string]
  /** Fired when the user presses Enter on the currently selected item. */
  select: [index: number]
}>()

const query = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const resultsRef = ref<HTMLElement | null>(null)
const selectedIndex = ref(0)

watch(
  () => props.open,
  (isOpen) => {
    // Body scroll lock while the palette is open
    document.body.style.overflow = isOpen ? 'hidden' : ''

    if (isOpen) {
      query.value = ''
      selectedIndex.value = 0
      nextTick(() => inputRef.value?.focus())
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})

// Reset selection when the search query changes.
watch(query, () => {
  selectedIndex.value = 0
})

/**
 * Scroll the selected item into view after the index changes.
 * Consuming apps should add `data-index="<n>"` to each result element
 * inside the default slot so the palette can locate it.
 */
watch(selectedIndex, () => {
  nextTick(() => {
    const el = resultsRef.value?.querySelector<HTMLElement>(
      `[data-index="${selectedIndex.value}"]`,
    )
    el?.scrollIntoView({ block: 'nearest' })
  })
})

function onOverlayClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    emit('close')
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
  }
}

function onInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  query.value = value
  emit('update:query', value)
}

function onInputKeydown(e: KeyboardEvent) {
  const count = props.resultCount

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (count > 0) {
      selectedIndex.value = (selectedIndex.value + 1) % count
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (count > 0) {
      selectedIndex.value = (selectedIndex.value - 1 + count) % count
    }
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (count > 0) {
      emit('select', selectedIndex.value)
      emit('close')
    }
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        @click="onOverlayClick"
        @keydown="onKeydown"
      >
        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 scale-[0.98] translate-y-1"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-[0.98] translate-y-1"
          appear
        >
          <div
            v-if="open"
            class="mx-auto mt-[18vh] w-full max-w-lg overflow-hidden rounded-xl bg-surface shadow-2xl ring-1 ring-border"
          >
            <!-- Input area -->
            <div class="flex items-center gap-2.5 px-4 py-3">
              <svg class="h-4 w-4 shrink-0 text-text-secondary" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clip-rule="evenodd"
                />
              </svg>
              <input
                ref="inputRef"
                :value="query"
                :placeholder="placeholder"
                class="flex-1 bg-transparent text-[14px] text-text-primary outline-none placeholder:text-text-secondary/50"
                @input="onInput"
                @keydown="onInputKeydown"
              />
              <kbd
                class="inline-flex items-center rounded border border-border/80 bg-surface-secondary/70 px-1.5 py-[3px] text-[10px] font-mono leading-none text-text-secondary/60 shadow-[0_1px_0_var(--color-border)]"
              >
                Esc
              </kbd>
            </div>

            <!-- Actions slot (filter pills, etc.) -->
            <slot name="actions" />

            <!-- Divider -->
            <div class="border-t border-border" />

            <!-- Results area -->
            <div ref="resultsRef" class="max-h-[320px] overflow-y-auto">
              <slot :selectedIndex="selectedIndex" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
