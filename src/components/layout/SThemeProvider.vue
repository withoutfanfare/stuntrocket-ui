<script lang="ts">
import { inject, type Ref, type ComputedRef } from 'vue'

export interface ProvidedTheme {
  mode: Ref<string>
  isDark: ComputedRef<boolean>
  toggle: () => void
  setMode: (m: string) => void
}

/**
 * Access the theme provided by an ancestor `<SThemeProvider>`.
 *
 * Throws a helpful error if no provider is found — better than a cryptic
 * `Cannot read properties of undefined` on `.mode.value`.
 */
export function useProvidedTheme(): ProvidedTheme {
  const theme = inject<ProvidedTheme | undefined>('stuntrocket-theme', undefined)
  if (!theme) {
    throw new Error(
      'useProvidedTheme() must be called inside an <SThemeProvider> — no theme was injected.',
    )
  }
  return theme
}
</script>

<script setup lang="ts">
import { provide, watch, onMounted, onUnmounted } from 'vue'
import { useTheme } from '../../composables/useTheme'

export interface SThemeProviderProps {
  /** Override the default accent colour, e.g. '#7C3AED' */
  accent?: string
  /** Custom hover colour — auto-derived from accent if omitted */
  accentHover?: string
  /** localStorage key for persisting theme mode */
  storageKey?: string
}

const props = withDefaults(defineProps<SThemeProviderProps>(), {
  accent: undefined,
  accentHover: undefined,
  storageKey: 'stuntrocket-theme',
})

const { mode, isDark, toggle, setMode } = useTheme({ storageKey: props.storageKey })

provide('stuntrocket-theme', { mode, isDark, toggle, setMode })

function applyAccentOverrides(accent: string | undefined) {
  const el = document.documentElement.style

  if (!accent) {
    el.removeProperty('--color-accent')
    el.removeProperty('--color-accent-hover')
    el.removeProperty('--color-accent-subtle')
    return
  }

  el.setProperty('--color-accent', accent)

  el.setProperty(
    '--color-accent-hover',
    props.accentHover ?? `color-mix(in srgb, ${accent} 80%, black)`,
  )

  el.setProperty(
    '--color-accent-subtle',
    `color-mix(in srgb, ${accent} 10%, transparent)`,
  )
}

onMounted(() => {
  applyAccentOverrides(props.accent)
})

watch(
  () => props.accent,
  (value) => {
    applyAccentOverrides(value)
  },
)

watch(
  () => props.accentHover,
  () => {
    if (props.accent) {
      applyAccentOverrides(props.accent)
    }
  },
)

onUnmounted(() => {
  const el = document.documentElement.style
  el.removeProperty('--color-accent')
  el.removeProperty('--color-accent-hover')
  el.removeProperty('--color-accent-subtle')
})
</script>

<template>
  <slot />
</template>
