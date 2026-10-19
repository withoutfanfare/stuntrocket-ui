import { ref, watch, type Ref } from 'vue'

export interface UsePersistedRefOptions<T> {
  /**
   * Validate the value deserialised from storage. Should return `true` if the
   * value is acceptable, `false` to fall back to `defaultValue`. If omitted, a
   * shallow `typeof` check is used.
   */
  validate?: (value: unknown) => value is T
}

export function usePersistedRef<T>(
  key: string,
  defaultValue: T,
  options?: UsePersistedRefOptions<T>,
): Ref<T> {
  const defaultValidate = (value: unknown): value is T =>
    typeof value === typeof defaultValue

  const validate = options?.validate ?? defaultValidate

  let initial = defaultValue
  try {
    const stored = localStorage.getItem(key)
    if (stored !== null) {
      const parsed: unknown = JSON.parse(stored)
      if (validate(parsed)) initial = parsed
    }
  } catch { /* localStorage unavailable or corrupt */ }

  const state = ref<T>(initial) as Ref<T>
  const isDeep = typeof defaultValue === 'object' && defaultValue !== null

  watch(state, (val) => {
    try { localStorage.setItem(key, JSON.stringify(val)) } catch { /* localStorage unavailable */ }
  }, { deep: isDeep, flush: 'post' })

  return state
}
