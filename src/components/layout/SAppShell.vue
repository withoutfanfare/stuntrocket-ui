<script setup lang="ts">
export interface SAppShellProps {
  showInspector?: boolean
  sidebarWidth?: string
  inspectorWidth?: string
}

withDefaults(defineProps<SAppShellProps>(), {
  showInspector: false,
  sidebarWidth: '220px',
  inspectorWidth: '260px',
})
</script>

<template>
  <div class="flex flex-1 min-h-0 overflow-hidden">
    <!-- Sidebar -->
    <div
      class="flex-shrink-0 border-r border-border overflow-y-auto bg-sidebar"
      :style="{ width: sidebarWidth }"
    >
      <slot name="sidebar" />
    </div>

    <!-- Main content -->
    <div class="flex-1 min-w-0 overflow-y-auto bg-surface-app">
      <slot />
    </div>

    <!-- Inspector (optional) -->
    <div
      v-if="showInspector"
      class="flex-shrink-0 border-l border-border overflow-y-auto bg-surface p-4"
      :style="{ width: inspectorWidth }"
    >
      <slot name="inspector" />
    </div>
  </div>
</template>
