<script setup lang="ts">
/**
 * Ambient background blobs — decorative gradient orbs.
 * Requires ambient.css to be imported in the app's stylesheet.
 *
 * Props let each app override the default blob colours to match its accent.
 */

export interface SAmbientBlobsProps {
  /** Top-right blob colour */
  color1?: string
  /** Bottom-left blob colour */
  color2?: string
  /** Centre blob colour */
  color3?: string
}

const props = withDefaults(defineProps<SAmbientBlobsProps>(), {
  color1: 'var(--color-accent)',
  color2: '#8B5CF6',
  color3: '#06B6D4',
})
</script>

<template>
  <div class="ambient-blobs" aria-hidden="true">
    <div class="ambient-blob blob-1" :style="{ background: props.color1 }" />
    <div class="ambient-blob blob-2" :style="{ background: props.color2 }" />
    <div class="ambient-blob blob-3" :style="{ background: props.color3 }" />
  </div>
</template>
