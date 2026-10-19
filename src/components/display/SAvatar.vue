<script setup lang="ts">
import { computed, ref } from 'vue'

export interface SAvatarProps {
  name?: string
  src?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'accent' | 'neutral'
}

const props = withDefaults(defineProps<SAvatarProps>(), {
  size: 'md',
  variant: 'neutral',
})

const imgError = ref(false)

const initials = computed(() => {
  if (!props.name) return ''
  return props.name
    .split(' ')
    .filter(Boolean) // tolerate double spaces / leading whitespace
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
})

const altText = computed(() => props.name || 'Avatar')
</script>

<template>
  <div
    :class="[
      'inline-flex items-center justify-center rounded-full font-medium select-none overflow-hidden',
      {
        'w-6 h-6 text-[10px]': size === 'sm',
        'w-8 h-8 text-[11px]': size === 'md',
        'w-10 h-10 text-[13px]': size === 'lg',
      },
      {
        'bg-surface-secondary text-text-secondary': variant === 'neutral',
        'bg-accent/15 text-accent': variant === 'accent',
      },
    ]"
  >
    <img
      v-if="src && !imgError"
      :src="src"
      :alt="altText"
      class="w-full h-full object-cover"
      @error="imgError = true"
    />
    <span v-else-if="name">{{ initials }}</span>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      aria-hidden="true"
      :class="{
        'w-3.5 h-3.5': size === 'sm',
        'w-4 h-4': size === 'md',
        'w-5 h-5': size === 'lg',
      }"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    </svg>
  </div>
</template>
