import { ref, type Ref } from 'vue'

export interface ContextMenuItem {
  label: string
  action: () => void
  danger?: boolean
  disabled?: boolean
}

const visible = ref(false)
const position = ref({ x: 0, y: 0 })
const items: Ref<ContextMenuItem[]> = ref([])

// Approximate menu dimensions used for viewport clamping. Consumers can tweak
// these by overriding the values before calling `open` if their menu uses
// dramatically different sizing.
const MENU_WIDTH = 180
const MENU_HEIGHT = 200

function clampToViewport(x: number, y: number) {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1024
  const vh = typeof window !== 'undefined' ? window.innerHeight : 768
  return {
    x: Math.max(8, Math.min(x, vw - MENU_WIDTH - 8)),
    y: Math.max(8, Math.min(y, vh - MENU_HEIGHT - 8)),
  }
}

export function useContextMenu() {
  function open(event: MouseEvent, menuItems: ContextMenuItem[]) {
    event.preventDefault()
    position.value = clampToViewport(event.clientX, event.clientY)
    items.value = menuItems
    visible.value = true
  }

  function close() {
    visible.value = false
    items.value = []
  }

  return { visible, position, items, open, close }
}
