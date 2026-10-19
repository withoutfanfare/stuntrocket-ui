import { ref, computed, watchEffect, type Ref, type ComputedRef } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface UseThemeOptions {
  /** localStorage key for persisting theme mode (default: 'stuntrocket-theme') */
  storageKey?: string
}

export interface UseThemeReturn {
  mode: Ref<ThemeMode>
  isDark: ComputedRef<boolean>
  toggle: () => void
  setMode: (m: ThemeMode) => void
}

const CYCLE: ThemeMode[] = ['light', 'dark', 'system']
const DEFAULT_STORAGE_KEY = 'stuntrocket-theme'

// Module-level singleton state — every consumer of `useTheme()` shares the
// same `mode` ref, the same media-query listener, and the same persisted key.
// Without this, two consumers would each maintain their own `mode`, both
// writing the same `localStorage` key and toggling `.dark` independently.
const mode = ref<ThemeMode>('system')
const systemPrefersDark = ref(false)
let initialised = false
let watchersRegistered = false
let mediaQuery: MediaQueryList | null = null

function safeLocalStorage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null
  } catch {
    return null
  }
}

function safeMatchMedia(query: string): MediaQueryList | null {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return null
  }
  try {
    return window.matchMedia(query)
  } catch {
    return null
  }
}

function readStoredMode(key: string): ThemeMode {
  const stored = safeLocalStorage()?.getItem(key) as ThemeMode | null
  return stored && CYCLE.includes(stored) ? stored : 'system'
}

function applyClass(dark: boolean) {
  if (typeof document === 'undefined') return
  const el = document.documentElement
  if (dark) el.classList.add('dark')
  else el.classList.remove('dark')
}

const isDark = computed<boolean>(() => {
  if (mode.value === 'dark') return true
  if (mode.value === 'light') return false
  return systemPrefersDark.value
})

function onMediaChange(e: MediaQueryListEvent) {
  systemPrefersDark.value = e.matches
}

/**
 * Initialise the singleton on first call. Subsequent calls with different
 * `storageKey` options are ignored — once initialised, the key is fixed.
 * This matches the behaviour of other global composables (`useToastStack`,
 * `useConfirm`).
 */
function initialise(storageKey: string) {
  if (initialised) return
  initialised = true

  mode.value = readStoredMode(storageKey)

  mediaQuery = safeMatchMedia('(prefers-color-scheme: dark)')
  if (mediaQuery) {
    systemPrefersDark.value = mediaQuery.matches
    mediaQuery.addEventListener('change', onMediaChange)
  }

  applyClass(isDark.value)

  if (watchersRegistered) return
  watchersRegistered = true

  // Register global watchers exactly once so consumers don't stack duplicates.
  watchEffect(() => applyClass(isDark.value))
  watchEffect(() => {
    safeLocalStorage()?.setItem(storageKey, mode.value)
  })
}

export function useTheme(options?: UseThemeOptions): UseThemeReturn {
  const storageKey = options?.storageKey ?? DEFAULT_STORAGE_KEY
  initialise(storageKey)

  function toggle() {
    const currentIndex = CYCLE.indexOf(mode.value)
    mode.value = CYCLE[(currentIndex + 1) % CYCLE.length]
  }

  function setMode(m: ThemeMode) {
    mode.value = m
  }

  return { mode, isDark, toggle, setMode }
}
