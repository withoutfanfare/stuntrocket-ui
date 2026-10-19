import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SHeatmapCalendar from './SHeatmapCalendar.vue'

function todayMinusDays(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().split('T')[0]
}

describe('SHeatmapCalendar', () => {
  it('renders SVG when counts provided', () => {
    const counts: Record<string, number> = {
      [todayMinusDays(0)]: 3,
      [todayMinusDays(1)]: 1,
    }
    const wrapper = mount(SHeatmapCalendar, {
      props: { counts },
    })
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.find('svg').attributes('role')).toBe('img')
  })

  it('correct number of week groups', () => {
    const wrapper = mount(SHeatmapCalendar, {
      props: { counts: {}, weeks: 8 },
    })
    const groups = wrapper.findAll('g')
    expect(groups.length).toBe(8)
  })

  it('default weeks is 16', () => {
    const wrapper = mount(SHeatmapCalendar, {
      props: { counts: {} },
    })
    const groups = wrapper.findAll('g')
    expect(groups.length).toBe(16)
  })

  it('empty counts still renders grid', () => {
    const wrapper = mount(SHeatmapCalendar, {
      props: { counts: {} },
    })
    expect(wrapper.find('svg').exists()).toBe(true)
    // Each week has 7 days, 16 weeks = 112 rects
    const rects = wrapper.findAll('rect')
    expect(rects.length).toBe(16 * 7)
  })

  it('tooltip shows count and suffix', () => {
    const dateStr = todayMinusDays(0)
    const counts: Record<string, number> = {
      [dateStr]: 5,
    }
    const wrapper = mount(SHeatmapCalendar, {
      props: { counts, tooltipSuffix: 'commits' },
    })
    // Look for a title element that contains the count and suffix
    const titles = wrapper.findAll('title')
    const matchingTitle = titles.find(t => t.text().includes('5 commits'))
    expect(matchingTitle).toBeTruthy()
  })

  it('tooltip uses default suffix "events"', () => {
    const dateStr = todayMinusDays(0)
    const counts: Record<string, number> = {
      [dateStr]: 2,
    }
    const wrapper = mount(SHeatmapCalendar, {
      props: { counts },
    })
    const titles = wrapper.findAll('title')
    const matchingTitle = titles.find(t => t.text().includes('2 events'))
    expect(matchingTitle).toBeTruthy()
  })
})
