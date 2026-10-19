import { describe, it, expect } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { useTheme } from './useTheme'

describe('useTheme', () => {
  it('keeps applying the theme after the first component using it unmounts', async () => {
    const First = defineComponent({
      setup() {
        useTheme()
        return () => h('div')
      },
    })
    mount(First).unmount()

    const { setMode } = useTheme()
    setMode('dark')
    await nextTick()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('stuntrocket-theme')).toBe('dark')

    setMode('light')
    await nextTick()
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('stuntrocket-theme')).toBe('light')
  })
})
