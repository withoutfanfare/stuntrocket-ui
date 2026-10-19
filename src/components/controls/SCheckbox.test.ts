import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SCheckbox from './SCheckbox.vue'

describe('SCheckbox', () => {
  it('renders unchecked state', () => {
    const wrapper = mount(SCheckbox, {
      props: { modelValue: false, label: 'Accept terms' },
    })
    const checkbox = wrapper.find('button[role="checkbox"]')
    expect(checkbox.attributes('aria-checked')).toBe('false')
    expect(wrapper.text()).toContain('Accept terms')
    // Checkmark SVG should not render
    expect(checkbox.find('svg').exists()).toBe(false)
  })

  it('renders checked state', () => {
    const wrapper = mount(SCheckbox, {
      props: { modelValue: true, label: 'Accept terms' },
    })
    const checkbox = wrapper.find('button[role="checkbox"]')
    expect(checkbox.attributes('aria-checked')).toBe('true')
    // Checkmark SVG should render
    expect(checkbox.find('svg').exists()).toBe(true)
  })

  it('emits update:modelValue on click (outer container)', async () => {
    const wrapper = mount(SCheckbox, {
      props: { modelValue: false, label: 'Option' },
    })
    // Click the outer div
    await wrapper.find('div').trigger('click')
    const events = wrapper.emitted('update:modelValue')
    expect(events).toBeTruthy()
    expect(events![0]).toEqual([true])
  })

  it('does not emit when disabled', async () => {
    const wrapper = mount(SCheckbox, {
      props: { modelValue: false, label: 'Option', disabled: true },
    })
    await wrapper.find('div').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('does not double-toggle when clicking the button directly', async () => {
    // The button uses @click.stop so clicking it does not also trigger
    // the outer div's click handler, preventing a double toggle.
    const wrapper = mount(SCheckbox, {
      props: { modelValue: false, label: 'Option' },
    })
    const button = wrapper.find('button[role="checkbox"]')
    await button.trigger('click')

    const events = wrapper.emitted('update:modelValue')
    expect(events).toBeTruthy()
    // Should only emit once, not twice
    expect(events!.length).toBe(1)
    expect(events![0]).toEqual([true])
  })

  it('renders description text', () => {
    const wrapper = mount(SCheckbox, {
      props: { modelValue: false, label: 'Agree', description: 'You must agree to proceed' },
    })
    expect(wrapper.text()).toContain('You must agree to proceed')
  })
})
