<script setup lang="ts">
export interface SSidebarProps {
  /** Width of the sidebar (default: '280px') */
  width?: string
}

withDefaults(defineProps<SSidebarProps>(), {
  width: '280px',
})
</script>

<template>
  <aside
    aria-label="Sidebar navigation"
    class="h-full bg-sidebar/72 backdrop-blur-xl border-r border-border/70 flex flex-col pt-[52px] overflow-hidden"
    :style="{ width }"
  >
    <div class="px-3 pt-2.5 pb-1.5">
      <slot name="header" />
    </div>
    <div class="flex-1 overflow-y-auto px-2.5 py-1.5">
      <slot />
    </div>
    <div class="px-3 py-2.5 border-t border-border/70 bg-surface/35 mt-auto">
      <slot name="footer" />
    </div>
  </aside>
</template>
