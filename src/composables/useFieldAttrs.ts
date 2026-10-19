import { computed, useAttrs } from 'vue'

/**
 * Splits a form control's fallthrough attributes: `class` and `style` stay on
 * the outer wrapper for layout, and everything else (`name`, `autocomplete`,
 * `aria-*`, listeners such as `onBlur`) goes to the native form element.
 *
 * Use with `defineOptions({ inheritAttrs: false })`.
 */
export function useFieldAttrs() {
  const attrs = useAttrs()
  const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }))
  const fieldAttrs = computed(() => {
    const { class: _class, style: _style, ...rest } = attrs
    return rest
  })
  return { rootAttrs, fieldAttrs }
}
