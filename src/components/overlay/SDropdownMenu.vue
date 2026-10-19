<script setup lang="ts">
import { ref, computed, onBeforeUnmount, nextTick, watch } from 'vue'

export interface SDropdownMenuItem {
  label: string
  value: string
  danger?: boolean
  disabled?: boolean
}

export interface SDropdownMenuProps {
  items?: SDropdownMenuItem[]
  align?: 'left' | 'right'
}

const props = withDefaults(defineProps<SDropdownMenuProps>(), {
  items: () => [],
  align: 'right',
})

const emit = defineEmits<{
  select: [value: string]
}>()

const isOpen = ref(false)
const focusedIndex = ref(-1)
const panelRef = ref<HTMLDivElement | null>(null)
const rootRef = ref<HTMLDivElement | null>(null)
const itemButtonRefs = ref<HTMLButtonElement[]>([])
// Where focus was before opening, so keyboard closes can return it there.
let returnFocusTo: HTMLElement | null = null

/** Bind to the trigger element with `v-bind="triggerAttrs"`. */
const triggerAttrs = computed(() => ({
  'aria-haspopup': 'menu' as const,
  'aria-expanded': isOpen.value,
}))

function setItemRef(el: Element | unknown, i: number) {
  if (el) itemButtonRefs.value[i] = el as HTMLButtonElement
}

function toggle() {
  if (isOpen.value) close()
  else open()
}

function open() {
  returnFocusTo = document.activeElement as HTMLElement | null
  isOpen.value = true
  focusedIndex.value = -1
  nextTick(() => {
    document.addEventListener('click', onClickOutside, true)
    const first = props.items.findIndex((item) => !item.disabled)
    if (first !== -1) focusItem(first)
  })
}

/** `restoreFocus` is for keyboard and selection closes; a click elsewhere keeps its own focus. */
function close(restoreFocus = false) {
  isOpen.value = false
  focusedIndex.value = -1
  document.removeEventListener('click', onClickOutside, true)
  if (restoreFocus) returnFocusTo?.focus()
  returnFocusTo = null
}

function selectItem(item: SDropdownMenuItem) {
  if (item.disabled) return
  emit('select', item.value)
  close(true)
}

function onClickOutside(e: MouseEvent) {
  const root = rootRef.value
  const target = e.target
  // Use the root ref (covers both trigger slot and panel) instead of a CSS
  // class — robust against renames and matches the slot's actual DOM.
  if (root && target instanceof Node && !root.contains(target)) {
    close()
  }
}

function getEnabledItems(): SDropdownMenuItem[] {
  return props.items.filter((item) => !item.disabled)
}

function focusItem(index: number) {
  focusedIndex.value = index
  // Move actual focus, not just a CSS class — screen readers need this to
  // announce the active option.
  itemButtonRefs.value[index]?.focus()
}

function onKeydown(e: KeyboardEvent) {
  if (!isOpen.value) return

  if (e.key === 'Escape') {
    e.preventDefault()
    close(true)
    return
  }
  if (e.key === 'Tab') {
    // Let Tab move focus on as normal, but don't leave the menu hanging open.
    close()
    return
  }

  const enabled = getEnabledItems()
  if (!enabled.length) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    let next = focusedIndex.value
    do {
      next = next + 1 >= props.items.length ? 0 : next + 1
    } while (props.items[next]?.disabled && next !== focusedIndex.value)
    focusItem(next)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    let prev = focusedIndex.value
    do {
      prev = prev - 1 < 0 ? props.items.length - 1 : prev - 1
    } while (props.items[prev]?.disabled && prev !== focusedIndex.value)
    focusItem(prev)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (focusedIndex.value >= 0 && focusedIndex.value < props.items.length) {
      selectItem(props.items[focusedIndex.value])
    }
  } else if (e.key === 'Home') {
    e.preventDefault()
    for (let i = 0; i < props.items.length; i++) {
      if (!props.items[i].disabled) { focusItem(i); break }
    }
  } else if (e.key === 'End') {
    e.preventDefault()
    for (let i = props.items.length - 1; i >= 0; i--) {
      if (!props.items[i].disabled) { focusItem(i); break }
    }
  }
}

watch(isOpen, (open) => {
  if (open) {
    document.addEventListener('keydown', onKeydown)
  } else {
    document.removeEventListener('keydown', onKeydown)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside, true)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div ref="rootRef" class="s-dropdown-menu relative inline-block">
    <slot name="trigger" :toggle="toggle" :open="isOpen" :trigger-attrs="triggerAttrs" />

    <Transition
      enter-active-class="transition duration-[120ms] ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-[120ms] ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="isOpen"
        ref="panelRef"
        :class="[
          'absolute mt-1 min-w-[160px] p-1 bg-surface border border-border/80 rounded-lg shadow-md z-[100]',
          align === 'right' ? 'right-0' : 'left-0',
        ]"
        role="menu"
      >
        <!-- Slot-based composition when items array is empty -->
        <template v-if="items.length === 0">
          <slot name="content" :close="() => close(true)" />
        </template>

        <!-- Items-array rendering (existing behaviour) -->
        <template v-else>
          <button
            v-for="(item, index) in items"
            :key="item.value"
            :ref="(el) => setItemRef(el, index)"
            type="button"
            role="menuitem"
            :class="[
              'w-full px-2.5 py-[6px] text-[13px] leading-snug text-left rounded-md transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent',
              {
                'text-danger hover:bg-[var(--color-danger-subtle)]': item.danger && !item.disabled,
                'text-text-primary hover:bg-[var(--color-surface-hover)]': !item.danger && !item.disabled,
                'opacity-50 cursor-not-allowed pointer-events-none': item.disabled,
                'bg-[var(--color-surface-hover)]': focusedIndex === index && !item.danger && !item.disabled,
                'bg-[var(--color-danger-subtle)]': focusedIndex === index && item.danger && !item.disabled,
              },
            ]"
            :disabled="item.disabled"
            @click="selectItem(item)"
            @mouseenter="focusedIndex = index"
            @mouseleave="focusedIndex = -1"
          >
            {{ item.label }}
          </button>
        </template>
      </div>
    </Transition>
  </div>
</template>
