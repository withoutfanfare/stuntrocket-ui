<script setup lang="ts">
import { computed } from 'vue'

export interface SHeadingProps {
  /** Heading level: 1 (page title), 2 (section), 3 (sub-section), 4 (label) */
  level?: 1 | 2 | 3 | 4
  /** Render as a different element (default matches level: h1–h4) */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
}

const props = withDefaults(defineProps<SHeadingProps>(), {
  level: 2,
  as: undefined,
})

// Computed so changing `as` or `level` reactively updates the rendered tag.
const tag = computed(() => props.as ?? `h${props.level}`)
</script>

<template>
  <component
    :is="tag"
    :class="[
      'text-text-primary',
      {
        'text-[1.95rem] font-semibold tracking-tight leading-tight': level === 1,
        'text-[1.25rem] font-semibold tracking-tight leading-tight': level === 2,
        'text-[1rem] font-semibold tracking-tight leading-snug': level === 3,
        'text-[0.8125rem] font-semibold uppercase tracking-[0.06em] leading-none text-text-secondary': level === 4,
      },
    ]"
  >
    <slot />
  </component>
</template>
