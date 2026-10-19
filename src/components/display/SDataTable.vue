<script setup lang="ts" generic="T extends Record<string, unknown> = Record<string, unknown>">
import { ref, computed, watch } from 'vue'

/**
 * SDataTable — sortable data table with column definitions.
 * Provides scoped slots for row customisation, sorting, selection, and loading states.
 */
export interface SDataTableColumn {
  key: string
  label: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  width?: string
}

export interface SDataTableProps<T = Record<string, unknown>> {
  columns: SDataTableColumn[]
  rows: T[]
  sortKey?: string
  sortDir?: 'asc' | 'desc'
  selectable?: boolean
  loading?: boolean
  /** Stable row identity. Falls back to row index when not provided. */
  rowKey?: (row: T, index: number) => string | number
}

const props = withDefaults(defineProps<SDataTableProps<T>>(), {
  sortKey: '',
  sortDir: 'asc',
  selectable: false,
  loading: false,
  rowKey: undefined,
})

const emit = defineEmits<{
  'update:sortKey': [key: string]
  'update:sortDir': [dir: 'asc' | 'desc']
  /** Fired when a row's selection changes. The second arg is the new state. */
  select: [row: T, selected: boolean]
  /** Fired when the select-all checkbox toggles. Payload is the new selection. */
  selectAll: [selected: T[]]
}>()

const selectedKeys = ref<Set<string | number>>(new Set())

function rowId(row: T, index: number): string | number {
  return props.rowKey ? props.rowKey(row, index) : index
}

// Clear selection when rows reference changes to prevent stale keys
watch(() => props.rows, () => {
  selectedKeys.value = new Set()
})

const allSelected = computed(() =>
  props.rows.length > 0 && selectedKeys.value.size === props.rows.length,
)

// Pre-compute skeleton widths to avoid flicker from Math.random() on re-renders
const skeletonWidths = [75, 60, 85, 55, 70]

function toggleSort(column: SDataTableColumn) {
  if (!column.sortable) return
  if (props.sortKey === column.key) {
    emit('update:sortDir', props.sortDir === 'asc' ? 'desc' : 'asc')
  } else {
    emit('update:sortKey', column.key)
    emit('update:sortDir', 'asc')
  }
}

function toggleRow(index: number) {
  const row = props.rows[index]
  if (!row) return
  const id = rowId(row, index)
  const next = new Set(selectedKeys.value)
  let nowSelected: boolean
  if (next.has(id)) {
    next.delete(id)
    nowSelected = false
  } else {
    next.add(id)
    nowSelected = true
  }
  selectedKeys.value = next
  emit('select', row, nowSelected)
}

function toggleAll() {
  if (allSelected.value) {
    selectedKeys.value = new Set()
    emit('selectAll', [])
  } else {
    const next = new Set<string | number>()
    const selectedRows: T[] = []
    props.rows.forEach((row, i) => {
      const id = rowId(row, i)
      next.add(id)
      selectedRows.push(row)
    })
    selectedKeys.value = next
    emit('selectAll', selectedRows)
  }
}

function isSelected(index: number) {
  const id = rowId(props.rows[index], index)
  return selectedKeys.value.has(id)
}

const alignClass: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}
</script>

<template>
  <div class="s-data-table overflow-x-auto" role="table">
    <table class="w-full border-collapse">
      <!-- Header -->
      <thead>
        <slot name="header">
          <tr class="border-b" :style="{ borderColor: 'var(--s-table-border, var(--color-border))' }">
            <!-- Selection checkbox column -->
            <th
              v-if="selectable"
              class="w-10 px-3 py-2.5"
              :style="{ backgroundColor: 'var(--s-table-header-bg, transparent)' }"
            >
              <input
                type="checkbox"
                :checked="allSelected"
                :indeterminate="selectedKeys.size > 0 && !allSelected"
                class="rounded accent-[var(--color-accent)]"
                :style="{ borderColor: 'var(--s-table-border, var(--color-border))' }"
                aria-label="Select all rows"
                @change="toggleAll"
              />
            </th>
            <th
              v-for="col in columns"
              :key="col.key"
              :class="[
                'px-3 py-2.5 text-[11px] font-medium uppercase tracking-wider',
                alignClass[col.align || 'left'],
                col.sortable ? 'cursor-pointer select-none transition-colors duration-150' : '',
              ]"
              :style="{
                ...(col.width ? { width: col.width } : {}),
                color: 'var(--s-table-text-secondary, var(--color-text-secondary))',
                backgroundColor: 'var(--s-table-header-bg, transparent)',
              }"
              :aria-sort="sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined"
              @click="toggleSort(col)"
            >
              <span class="inline-flex items-center gap-1">
                {{ col.label }}
                <!-- Sort indicator -->
                <svg
                  v-if="col.sortable && sortKey === col.key"
                  class="w-3 h-3 transition-transform duration-150"
                  :class="sortDir === 'desc' ? 'rotate-180' : ''"
                  :style="{ color: 'var(--s-table-text-secondary, var(--color-text-secondary))' }"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8 4l4 5H4l4-5z" />
                </svg>
                <svg
                  v-else-if="col.sortable"
                  class="w-3 h-3 opacity-30"
                  :style="{ color: 'var(--s-table-text-secondary, var(--color-text-secondary))' }"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8 4l3 4H5l3-4zM8 12l-3-4h6l-3 4z" />
                </svg>
              </span>
            </th>
          </tr>
        </slot>
      </thead>

      <!-- Body -->
      <tbody :style="{ backgroundColor: 'var(--s-table-bg, transparent)' }">
        <!-- Loading state -->
        <template v-if="loading">
          <slot name="loading">
            <tr v-for="i in 5" :key="`skeleton-${i}`">
              <td v-if="selectable" class="px-3 py-3">
                <div
                  class="w-4 h-4 rounded animate-pulse"
                  :style="{ backgroundColor: 'color-mix(in srgb, var(--s-table-border, var(--color-border)) 30%, transparent)' }"
                />
              </td>
              <td
                v-for="col in columns"
                :key="col.key"
                class="px-3 py-3"
              >
                <div
                  class="h-3.5 rounded animate-pulse"
                  :style="{
                    width: `${skeletonWidths[columns.indexOf(col) % skeletonWidths.length]}%`,
                    backgroundColor: 'color-mix(in srgb, var(--s-table-border, var(--color-border)) 30%, transparent)',
                  }"
                />
              </td>
            </tr>
          </slot>
        </template>

        <!-- Empty state -->
        <template v-else-if="rows.length === 0">
          <tr>
            <td :colspan="columns.length + (selectable ? 1 : 0)" class="py-12">
              <slot name="empty">
                <div class="flex flex-col items-center justify-center text-center">
                  <p
                    class="text-[13px]"
                    :style="{ color: 'var(--s-table-text-secondary, var(--color-text-secondary))' }"
                  >
                    No data to display
                  </p>
                </div>
              </slot>
            </td>
          </tr>
        </template>

        <!-- Data rows -->
        <template v-else>
          <tr
            v-for="(row, index) in rows"
            :key="rowKey ? rowKey(row, index) : index"
            class="s-data-table-row border-b transition-colors duration-100"
            :data-selected="isSelected(index) || undefined"
            :style="{
              borderColor: 'color-mix(in srgb, var(--s-table-border, var(--color-border)) 40%, transparent)',
            }"
          >
            <slot name="row" :row="row" :index="index" :selected="isSelected(index)">
              <!-- Selection checkbox -->
              <td v-if="selectable" class="w-10 px-3 py-2.5">
                <input
                  type="checkbox"
                  :checked="isSelected(index)"
                  class="rounded accent-[var(--color-accent)]"
                  :style="{ borderColor: 'var(--s-table-border, var(--color-border))' }"
                  :aria-label="`Select row ${index + 1}`"
                  @change="toggleRow(index)"
                />
              </td>
              <!-- Cell data -->
              <td
                v-for="col in columns"
                :key="col.key"
                :class="[
                  'px-3 py-2.5 text-[13px]',
                  alignClass[col.align || 'left'],
                ]"
                :style="{ color: 'var(--s-table-text, var(--color-text-primary))' }"
              >
                {{ row[col.key] }}
              </td>
            </slot>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style>
/*
 * SDataTable CSS Custom Properties
 * ================================
 * Override these on a wrapper element to theme the table without :deep():
 *
 *   --s-table-bg               Table body background
 *   --s-table-header-bg        Header row background
 *   --s-table-row-hover-bg     Row hover background      (fallback: --color-surface-hover)
 *   --s-table-row-selected-bg  Selected row background    (fallback: --color-surface-selected)
 *   --s-table-border           Border colour              (fallback: --color-border)
 *   --s-table-text             Primary text colour        (fallback: --color-text-primary)
 *   --s-table-text-secondary   Secondary text colour      (fallback: --color-text-secondary)
 */

.s-data-table-row:hover {
  background-color: var(--s-table-row-hover-bg, var(--color-surface-hover));
}

/* Selected row background */
.s-data-table-row[data-selected] {
  background-color: var(--s-table-row-selected-bg, var(--color-surface-selected));
}

/* Selected rows keep their background on hover */
.s-data-table-row[data-selected]:hover {
  background-color: var(--s-table-row-selected-bg, var(--color-surface-selected));
}

/* Header column hover for sortable columns */
.s-data-table th[class*="cursor-pointer"]:hover {
  color: var(--s-table-text, var(--color-text-primary));
}
</style>
