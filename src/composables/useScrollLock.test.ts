import { describe, it, expect, afterEach } from 'vitest'
import { defineComponent, h, nextTick, ref, type Ref } from 'vue'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { useScrollLock } from './useScrollLock'

enableAutoUnmount(afterEach)

function overlay(open: Ref<boolean>) {
  return defineComponent({
    setup() {
      useScrollLock(() => open.value)
      return () => h('div')
    },
  })
}

afterEach(() => {
  document.body.style.overflow = ''
})

describe('useScrollLock', () => {
  it('locks while open and unlocks on close', async () => {
    const open = ref(true)
    mount(overlay(open))
    expect(document.body.style.overflow).toBe('hidden')
    open.value = false
    await nextTick()
    expect(document.body.style.overflow).toBe('')
  })

  it('a closed overlay does not unlock an open one', () => {
    mount(overlay(ref(true)))
    mount(overlay(ref(false)))
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('stays locked until the last stacked overlay closes', async () => {
    const first = ref(true)
    const second = ref(true)
    mount(overlay(first))
    mount(overlay(second))
    second.value = false
    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')
    first.value = false
    await nextTick()
    expect(document.body.style.overflow).toBe('')
  })

  it('releases its lock when unmounted while open', () => {
    const wrapper = mount(overlay(ref(true)))
    wrapper.unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('restores the overflow value the page had before', async () => {
    document.body.style.overflow = 'auto'
    const open = ref(true)
    mount(overlay(open))
    open.value = false
    await nextTick()
    expect(document.body.style.overflow).toBe('auto')
  })
})
