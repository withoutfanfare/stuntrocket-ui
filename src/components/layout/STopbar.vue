<script setup lang="ts">
export interface STopbarProps {
  /** Left padding for macOS traffic lights (default: 78px) */
  trafficLightPadding?: string
}

withDefaults(defineProps<STopbarProps>(), {
  trafficLightPadding: '78px',
})
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 flex h-[52px] items-center border-b border-border/70 bg-surface/72 backdrop-blur-xl"
    style="-webkit-app-region: drag"
  >
    <div
      class="flex h-full items-center gap-2"
      :style="{ paddingLeft: trafficLightPadding }"
      style="-webkit-app-region: no-drag"
    >
      <slot name="left" />
    </div>
    <div class="flex flex-1 items-center justify-center" style="-webkit-app-region: no-drag">
      <slot name="centre" />
    </div>
    <div class="flex items-center gap-2 pr-3" style="-webkit-app-region: no-drag">
      <slot name="right" />
    </div>
  </header>
</template>
