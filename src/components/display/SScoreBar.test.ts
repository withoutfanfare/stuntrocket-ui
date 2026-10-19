import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SScoreBar from './SScoreBar.vue'

describe('SScoreBar', () => {
  it('clamps value below 0 to 0', () => {
    const wrapper = mount(SScoreBar, {
      props: { value: -0.5 },
    })
    const meter = wrapper.find('[role="meter"]')
    expect(meter.attributes('aria-valuenow')).toBe('0')
    const bar = meter.find('div')
    expect(bar.element.style.width).toBe('0%')
  })

  it('clamps value above 1 to 1', () => {
    const wrapper = mount(SScoreBar, {
      props: { value: 1.5 },
    })
    const meter = wrapper.find('[role="meter"]')
    expect(meter.attributes('aria-valuenow')).toBe('1')
    const bar = meter.find('div')
    expect(bar.element.style.width).toBe('100%')
  })

  it('shows success colour for value >= 0.7', () => {
    const wrapper = mount(SScoreBar, {
      props: { value: 0.85 },
    })
    const bar = wrapper.find('[role="meter"] div')
    expect(bar.classes()).toContain('bg-success')
  })

  it('shows warning colour for value >= 0.4 and < 0.7', () => {
    const wrapper = mount(SScoreBar, {
      props: { value: 0.5 },
    })
    const bar = wrapper.find('[role="meter"] div')
    expect(bar.classes()).toContain('bg-warning')
  })

  it('shows danger colour for value < 0.4', () => {
    const wrapper = mount(SScoreBar, {
      props: { value: 0.2 },
    })
    const bar = wrapper.find('[role="meter"] div')
    expect(bar.classes()).toContain('bg-danger')
  })

  it('shows label when provided', () => {
    const wrapper = mount(SScoreBar, {
      props: { value: 0.6, label: 'Accuracy' },
    })
    expect(wrapper.text()).toContain('Accuracy')
  })

  it('does not show label when not provided', () => {
    const wrapper = mount(SScoreBar, {
      props: { value: 0.6 },
    })
    // Only the meter should be present, no label span before it
    const spans = wrapper.findAll('span')
    // No label span should exist (only potentially the showValue span, which is off by default)
    const labelSpans = spans.filter(s => s.text() !== '')
    expect(labelSpans.length).toBe(0)
  })

  it('shows percentage when showValue is true', () => {
    const wrapper = mount(SScoreBar, {
      props: { value: 0.73, showValue: true },
    })
    expect(wrapper.text()).toContain('73%')
  })

  it('does not show percentage when showValue is false', () => {
    const wrapper = mount(SScoreBar, {
      props: { value: 0.73, showValue: false },
    })
    expect(wrapper.text()).not.toContain('73%')
  })

  it('boundary: value exactly 0.7 gets success', () => {
    const wrapper = mount(SScoreBar, {
      props: { value: 0.7 },
    })
    const bar = wrapper.find('[role="meter"] div')
    expect(bar.classes()).toContain('bg-success')
  })

  it('boundary: value exactly 0.4 gets warning', () => {
    const wrapper = mount(SScoreBar, {
      props: { value: 0.4 },
    })
    const bar = wrapper.find('[role="meter"] div')
    expect(bar.classes()).toContain('bg-warning')
  })
})
