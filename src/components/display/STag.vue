<script setup lang="ts">
import { computed, ref } from 'vue'

export interface STagProps {
  interactive?: boolean
  /** Arbitrary CSS colour (hex, rgb, hsl, etc.) for a custom tag tint */
  color?: string
}

const props = withDefaults(defineProps<STagProps>(), {
  interactive: true,
  color: undefined,
})

const isHovered = ref(false)

const customStyle = computed(() => {
  if (!props.color) return undefined
  const opacity = props.interactive && isHovered.value ? '25%' : '15%'
  return {
    backgroundColor: `color-mix(in srgb, ${props.color} ${opacity}, transparent)`,
    color: props.color,
  }
})
</script>

<template>
  <component
    :is="interactive ? 'button' : 'span'"
    :class="[
      'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium leading-none tracking-[0.01em] transition-colors duration-150',
      { 'bg-surface-secondary text-text-secondary': !color },
      { 'hover:text-accent hover:bg-accent/10 cursor-pointer': interactive && !color },
      { 'cursor-pointer': interactive && color },
    ]"
    :style="customStyle"
    v-on="color && interactive ? { mouseenter: () => isHovered = true, mouseleave: () => isHovered = false } : {}"
  >
    <slot />
  </component>
</template>
