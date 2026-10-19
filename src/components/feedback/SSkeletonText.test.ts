import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SSkeletonText from './SSkeletonText.vue'

describe('SSkeletonText', () => {
  it('renders correct number of lines', () => {
    const wrapper = mount(SSkeletonText, {
      props: { lines: 5 },
    })
    const bars = wrapper.findAll('.ui-skeleton-bar')
    expect(bars.length).toBe(5)
  })

  it('default is 3 lines', () => {
    const wrapper = mount(SSkeletonText)
    const bars = wrapper.findAll('.ui-skeleton-bar')
    expect(bars.length).toBe(3)
  })

  it('varied width mode has different widths per line', () => {
    const wrapper = mount(SSkeletonText, {
      props: { lines: 4, width: 'varied' },
    })
    const bars = wrapper.findAll('.ui-skeleton-bar')
    // In varied mode, widths cycle through: w-full, w-11/12, w-4/5, w-3/4, w-2/3
    // But the last line is always w-2/3
    expect(bars[0].classes()).toContain('w-full')
    expect(bars[1].classes()).toContain('w-11/12')
    expect(bars[2].classes()).toContain('w-4/5')
    // Last line (index 3) should be w-2/3
    expect(bars[3].classes()).toContain('w-2/3')
  })

  it('last line is shorter in varied mode', () => {
    const wrapper = mount(SSkeletonText, {
      props: { lines: 3, width: 'varied' },
    })
    const bars = wrapper.findAll('.ui-skeleton-bar')
    // Last line always gets w-2/3 in varied mode (when lines > 1)
    expect(bars[2].classes()).toContain('w-2/3')
    // First line should not be w-2/3
    expect(bars[0].classes()).not.toContain('w-2/3')
  })

  it('full width mode has all lines at w-full', () => {
    const wrapper = mount(SSkeletonText, {
      props: { lines: 3, width: 'full' },
    })
    const bars = wrapper.findAll('.ui-skeleton-bar')
    for (const bar of bars) {
      expect(bar.classes()).toContain('w-full')
    }
  })

  it('has role="status" for accessibility', () => {
    const wrapper = mount(SSkeletonText)
    expect(wrapper.find('[role="status"]').exists()).toBe(true)
  })
})
