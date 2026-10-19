import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SViewToggle from './SViewToggle.vue'

const options = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
  { value: 'table', label: 'Table' },
]

describe('SViewToggle', () => {
  it('renders all options', () => {
    const wrapper = mount(SViewToggle, {
      props: { modelValue: 'grid', options },
    })
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBe(3)
    expect(buttons[0].text()).toBe('Grid')
    expect(buttons[1].text()).toBe('List')
    expect(buttons[2].text()).toBe('Table')
  })

  it('active option has aria-checked="true"', () => {
    const wrapper = mount(SViewToggle, {
      props: { modelValue: 'list', options },
    })
    const buttons = wrapper.findAll('button[role="radio"]')
    expect(buttons[0].attributes('aria-checked')).toBe('false')
    expect(buttons[1].attributes('aria-checked')).toBe('true')
    expect(buttons[2].attributes('aria-checked')).toBe('false')
  })

  it('inactive options have tabindex="-1"', () => {
    const wrapper = mount(SViewToggle, {
      props: { modelValue: 'grid', options },
    })
    const buttons = wrapper.findAll('button[role="radio"]')
    expect(buttons[0].attributes('tabindex')).toBe('0')
    expect(buttons[1].attributes('tabindex')).toBe('-1')
    expect(buttons[2].attributes('tabindex')).toBe('-1')
  })

  it('emits update:modelValue on click', async () => {
    const wrapper = mount(SViewToggle, {
      props: { modelValue: 'grid', options },
    })
    const buttons = wrapper.findAll('button')
    await buttons[1].trigger('click')
    const events = wrapper.emitted('update:modelValue')
    expect(events).toBeTruthy()
    expect(events![0]).toEqual(['list'])
  })

  it('arrow key navigation changes selection', async () => {
    const wrapper = mount(SViewToggle, {
      props: { modelValue: 'grid', options },
    })
    const container = wrapper.find('[role="radiogroup"]')
    await container.trigger('keydown', { key: 'ArrowRight' })
    const events = wrapper.emitted('update:modelValue')
    expect(events).toBeTruthy()
    expect(events![0]).toEqual(['list'])
  })

  it('arrow left wraps around to last option', async () => {
    const wrapper = mount(SViewToggle, {
      props: { modelValue: 'grid', options },
    })
    const container = wrapper.find('[role="radiogroup"]')
    await container.trigger('keydown', { key: 'ArrowLeft' })
    const events = wrapper.emitted('update:modelValue')
    expect(events).toBeTruthy()
    expect(events![0]).toEqual(['table'])
  })

  it('has role="radiogroup"', () => {
    const wrapper = mount(SViewToggle, {
      props: { modelValue: 'grid', options },
    })
    expect(wrapper.find('[role="radiogroup"]').exists()).toBe(true)
  })
})
