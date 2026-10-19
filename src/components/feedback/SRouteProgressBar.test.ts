import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SRouteProgressBar from './SRouteProgressBar.vue'

describe('SRouteProgressBar', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('is hidden when loading is false', () => {
    const wrapper = mount(SRouteProgressBar, {
      props: { loading: false },
    })
    // barState is 'idle', so the v-if should hide the bar
    expect(wrapper.find('.fixed').exists()).toBe(false)
  })

  it('shows when loading is true', () => {
    const wrapper = mount(SRouteProgressBar, {
      props: { loading: true },
    })
    expect(wrapper.find('.fixed').exists()).toBe(true)
  })

  it('handles immediate:true — starts loading on mount when prop is true', () => {
    // The watcher uses { immediate: true }, so setting loading=true
    // at mount time should immediately show the bar.
    const wrapper = mount(SRouteProgressBar, {
      props: { loading: true },
    })
    expect(wrapper.find('.fixed').exists()).toBe(true)
    // The bar should have a width style indicating the loading state
    const bar = wrapper.find('.fixed div')
    expect((bar.element as HTMLElement).style.width).toBe('80%')
  })

  it('transitions to completing state when loading changes to false', async () => {
    vi.useFakeTimers()

    const wrapper = mount(SRouteProgressBar, {
      props: { loading: true },
    })
    expect(wrapper.find('.fixed').exists()).toBe(true)

    await wrapper.setProps({ loading: false })

    // Should be in 'completing' state — bar goes to 100%
    expect(wrapper.find('.fixed').exists()).toBe(true)
    const bar = wrapper.find('.fixed div')
    expect((bar.element as HTMLElement).style.width).toBe('100%')

    vi.useRealTimers()
  })

  it('transitions to idle state after completing animation', async () => {
    vi.useFakeTimers()

    const wrapper = mount(SRouteProgressBar, {
      props: { loading: true },
    })

    await wrapper.setProps({ loading: false })

    // After 300ms: completing -> done
    vi.advanceTimersByTime(300)
    await wrapper.vm.$nextTick()

    // After another 200ms: done -> idle
    vi.advanceTimersByTime(200)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.fixed').exists()).toBe(false)

    vi.useRealTimers()
  })

  it('applies custom colour', () => {
    const wrapper = mount(SRouteProgressBar, {
      props: { loading: true, color: '#ff0000' },
    })
    const bar = wrapper.find('.fixed div')
    expect((bar.element as HTMLElement).style.backgroundColor).toBe('#ff0000')
  })
})
