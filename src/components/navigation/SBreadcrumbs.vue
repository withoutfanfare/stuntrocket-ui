<script setup lang="ts">
export interface BreadcrumbSegment {
  label: string
  to?: string
}

export interface SBreadcrumbsProps {
  /** Ordered breadcrumb segments from root to current page */
  segments: BreadcrumbSegment[]
}

defineProps<SBreadcrumbsProps>()

defineEmits<{
  navigate: [to: string]
}>()
</script>

<template>
  <nav class="flex items-center gap-1 text-[12px] leading-none text-text-secondary">
    <template v-for="(segment, index) in segments" :key="index">
      <!-- Chevron separator -->
      <svg
        v-if="index > 0"
        class="h-3 w-3 shrink-0 text-text-secondary/50"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>

      <!-- Last segment (current page) -->
      <span
        v-if="index === segments.length - 1"
        class="text-text-primary font-medium truncate max-w-[200px]"
      >
        {{ segment.label }}
      </span>

      <!-- Navigable segment -->
      <button
        v-else-if="segment.to"
        class="rounded px-1.5 py-0.5 hover:text-text-primary hover:bg-surface-secondary/45 transition-colors"
        @click="$emit('navigate', segment.to!)"
      >
        {{ segment.label }}
      </button>

      <!-- Non-navigable segment -->
      <span v-else>
        {{ segment.label }}
      </span>
    </template>
  </nav>
</template>
