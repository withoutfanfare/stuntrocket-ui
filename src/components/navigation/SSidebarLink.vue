<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

export interface SSidebarLinkProps {
  /** Route path — when provided, renders a RouterLink instead of a button */
  to?: string
  /** Whether this link is currently active */
  active?: boolean
  /** Nesting level for indentation (0 = top-level) */
  level?: number
  /** Whether this item has been updated since last visit */
  updated?: boolean
}

const props = withDefaults(defineProps<SSidebarLinkProps>(), {
  active: false,
  level: 0,
  updated: false,
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const paddingLeft = computed(() => `${props.level * 12 + 20}px`)
</script>

<template>
  <component
    :is="props.to ? RouterLink : 'button'"
    :to="props.to"
    :class="[
      'flex items-center w-full px-2 py-[5px] text-[13px] leading-snug tracking-[-0.01em] rounded-md transition-colors duration-100 truncate text-left outline-none',
      active
        ? 'bg-accent/8 text-accent font-medium'
        : 'text-text-primary/75 hover:bg-surface-secondary/80 hover:text-text-primary',
    ]"
    :style="{ paddingLeft }"
    @click="$emit('click', $event)"
  >
    <slot />
    <span
      v-if="updated && !active"
      class="w-1.5 h-1.5 rounded-full bg-accent/80 ml-1.5"
    />
  </component>
</template>
