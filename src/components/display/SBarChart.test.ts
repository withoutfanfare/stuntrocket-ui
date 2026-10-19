import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SBarChart from './SBarChart.vue'

describe('SBarChart', () => {
  it('renders SVG with correct number of bars', () => {
    const data = [
      { label: 'Jan', value: 10 },
      { label: 'Feb', value: 20 },
      { label: 'Mar', value: 30 },
    ]
    const wrapper = mount(SBarChart, {
      props: { data },
    })
    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    const rects = svg.findAll('rect')
    expect(rects.length).toBe(3)
  })

  it('handles empty data array', () => {
    const wrapper = mount(SBarChart, {
      props: { data: [] },
    })
    expect(wrapper.find('svg').exists()).toBe(false)
  })

  it('handles all-zero values without errors', () => {
    const data = [
      { label: 'A', value: 0 },
      { label: 'B', value: 0 },
    ]
    const wrapper = mount(SBarChart, {
      props: { data },
    })
    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    // maxValue fallback is 1 when all values are 0, so bars should have 0 height
    const rects = svg.findAll('rect')
    expect(rects.length).toBe(2)
    rects.forEach((rect) => {
      // height should be 0 because value / maxValue * (height - 4) = 0
      expect(rect.attributes('height')).toBe('0')
    })
  })

  it('highlights the last bar when highlightLast is true', () => {
    const data = [
      { label: 'A', value: 10 },
      { label: 'B', value: 20 },
    ]
    const wrapper = mount(SBarChart, {
      props: { data, highlightLast: true },
    })
    const rects = wrapper.findAll('rect')
    // First bar should not have the highlight class
    expect(rects[0].classes()).toContain('fill-accent/40')
    // Last bar should have the highlight class
    expect(rects[1].classes()).toContain('fill-accent')
  })

  it('does not highlight the last bar by default', () => {
    const data = [
      { label: 'A', value: 10 },
      { label: 'B', value: 20 },
    ]
    const wrapper = mount(SBarChart, {
      props: { data },
    })
    const rects = wrapper.findAll('rect')
    rects.forEach((rect) => {
      expect(rect.classes()).toContain('fill-accent/40')
    })
  })

  it('each bar has a title element with label and value', () => {
    const data = [
      { label: 'Revenue', value: 42 },
    ]
    const wrapper = mount(SBarChart, {
      props: { data },
    })
    const title = wrapper.find('rect title')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Revenue: 42')
  })

  it('uses custom height', () => {
    const data = [{ label: 'A', value: 10 }]
    const wrapper = mount(SBarChart, {
      props: { data, height: 200 },
    })
    const svg = wrapper.find('svg')
    expect(svg.attributes('height')).toBe('200')
  })
})
