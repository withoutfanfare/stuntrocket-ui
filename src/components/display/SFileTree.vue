<script setup lang="ts">
/**
 * SFileTree — collapsible file/directory tree.
 * Recursive component for displaying file hierarchies with expand/collapse,
 * selection, and optional status indicators.
 *
 * Scoped slots:
 *   #item-prefix  — renders BEFORE the filename (replaces the default file/folder icon).
 *                    Receives { item, depth, expanded, selected }.
 *   #item         — renders AFTER the filename text, inside the flex row.
 *                    Receives { item, depth, expanded, selected }.
 *                    When provided, the default status indicator is NOT rendered.
 *
 * Both slots are automatically forwarded to recursive child instances.
 */
export interface SFileTreeItem {
  name: string
  path: string
  type: 'file' | 'directory'
  children?: SFileTreeItem[]
  status?: string
}

export interface SFileTreeProps {
  items: SFileTreeItem[]
  selected?: string
  expandedPaths?: string[]
  /** Internal — depth level for recursive rendering */
  depth?: number
}

const props = withDefaults(defineProps<SFileTreeProps>(), {
  selected: '',
  expandedPaths: () => [],
  depth: 0,
})

const emit = defineEmits<{
  select: [path: string]
  toggle: [path: string]
}>()

function isExpanded(path: string) {
  return props.expandedPaths.includes(path)
}

function handleClick(item: SFileTreeItem) {
  if (item.type === 'directory') {
    emit('toggle', item.path)
  } else {
    emit('select', item.path)
  }
}

function handleKeydown(e: KeyboardEvent, item: SFileTreeItem) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    handleClick(item)
  }
}

/** Scoped slot payload shared by #item and #item-prefix */
export interface SFileTreeSlotProps {
  item: SFileTreeItem
  depth: number
  expanded: boolean
  selected: boolean
}

/** Status badge colour classes — token-derived for theme/brand compliance */
const statusClasses: Record<string, string> = {
  added: 'text-success',
  modified: 'text-warning',
  deleted: 'text-danger',
  renamed: 'text-info',
}
</script>

<template>
  <div
    :class="depth === 0 ? 'text-[13px]' : ''"
    :role="depth === 0 ? 'tree' : 'group'"
    :aria-label="depth === 0 ? 'File tree' : undefined"
  >
    <div
      v-for="item in items"
      :key="item.path"
      :role="'treeitem'"
      :aria-expanded="item.type === 'directory' ? isExpanded(item.path) : undefined"
    >
      <!-- Item row -->
      <div
        :tabindex="0"
        :class="[
          'flex items-center gap-1.5 py-1 px-2 rounded-md cursor-pointer select-none transition-colors duration-100',
          'hover:bg-[var(--color-surface-hover)]',
          'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent outline-none',
          selected === item.path ? 'bg-[var(--color-surface-selected)] text-text-primary' : 'text-text-secondary',
        ]"
        :style="{ paddingLeft: `${depth * 16 + 8}px` }"
        @click="handleClick(item)"
        @keydown="handleKeydown($event, item)"
      >
        <!-- Expand/collapse chevron for directories -->
        <svg
          v-if="item.type === 'directory'"
          class="w-3.5 h-3.5 flex-shrink-0 text-text-secondary/60 transition-transform duration-150"
          :class="isExpanded(item.path) ? 'rotate-90' : ''"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M6 4l4 4-4 4V4z" />
        </svg>
        <span v-else class="w-3.5 flex-shrink-0" aria-hidden="true" />

        <!-- Item prefix slot (replaces default file/folder icon) -->
        <slot
          v-if="$slots['item-prefix']"
          name="item-prefix"
          :item="item"
          :depth="depth"
          :expanded="item.type === 'directory' && isExpanded(item.path)"
          :selected="selected === item.path"
        />
        <!-- Default file/folder icon -->
        <template v-else>
          <svg
            v-if="item.type === 'directory'"
            class="w-4 h-4 flex-shrink-0 text-warning/80"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          </svg>
          <svg
            v-else
            class="w-4 h-4 flex-shrink-0 text-text-secondary/50"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
          </svg>
        </template>

        <!-- Name -->
        <span class="flex-1 min-w-0 truncate leading-snug">
          {{ item.name }}
        </span>

        <!-- Item slot (renders after filename, replaces default status indicator) -->
        <slot
          v-if="$slots.item"
          name="item"
          :item="item"
          :depth="depth"
          :expanded="item.type === 'directory' && isExpanded(item.path)"
          :selected="selected === item.path"
        />
        <!-- Default status indicator (only when #item slot is not provided) -->
        <span
          v-else-if="item.status"
          :class="[
            'flex-shrink-0 text-[10px] font-medium uppercase tracking-wide',
            statusClasses[item.status] || 'text-text-secondary/50',
          ]"
        >
          {{ item.status.charAt(0).toUpperCase() }}
        </span>
      </div>

      <!-- Recursive children (forward scoped slots) -->
      <SFileTree
        v-if="item.type === 'directory' && item.children && isExpanded(item.path)"
        :items="item.children"
        :selected="selected"
        :expanded-paths="expandedPaths"
        :depth="depth + 1"
        @select="emit('select', $event)"
        @toggle="emit('toggle', $event)"
      >
        <!-- Forward #item-prefix slot to child instances -->
        <template v-if="$slots['item-prefix']" #item-prefix="childSlotProps: SFileTreeSlotProps">
          <slot name="item-prefix" v-bind="childSlotProps" />
        </template>
        <!-- Forward #item slot to child instances -->
        <template v-if="$slots.item" #item="childSlotProps: SFileTreeSlotProps">
          <slot name="item" v-bind="childSlotProps" />
        </template>
      </SFileTree>
    </div>
  </div>
</template>
