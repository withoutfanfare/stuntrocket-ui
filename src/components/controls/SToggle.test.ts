import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SToggle from './SToggle.vue'

describe('SToggle', () => {
  it('renders off state', () => {
    const wrapper = mount(SToggle, {
      props: { modelValue: false, label: 'Dark mode' },
    })
    const switchEl = wrapper.find('button[role="switch"]')
    expect(switchEl.attributes('aria-checked')).toBe('false')
    expect(wrapper.text()).toContain('Dark mode')
  })

  it('renders on state', () => {
    const wrapper = mount(SToggle, {
      props: { modelValue: true, label: 'Dark mode' },
    })
    const switchEl = wrapper.find('button[role="switch"]')
    expect(switchEl.attributes('aria-checked')).toBe('true')
  })

  it('emits update:modelValue on click (outer container)', async () => {
    const wrapper = mount(SToggle, {
      props: { modelValue: false },
    })
    await wrapper.find('div').trigger('click')
    const events = wrapper.emitted('update:modelValue')
    expect(events).toBeTruthy()
    expect(events![0]).toEqual([true])
  })

  it('toggles from true to false', async () => {
    const wrapper = mount(SToggle, {
      props: { modelValue: true },
    })
    await wrapper.find('div').trigger('click')
    const events = wrapper.emitted('update:modelValue')
    expect(events).toBeTruthy()
    expect(events![0]).toEqual([false])
  })

  it('does not emit when disabled', async () => {
    const wrapper = mount(SToggle, {
      props: { modelValue: false, disabled: true },
    })
    await wrapper.find('div').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('does not double-toggle when clicking the button directly', async () => {
    const wrapper = mount(SToggle, {
      props: { modelValue: false },
    })
    const button = wrapper.find('button[role="switch"]')
    await button.trigger('click')

    const events = wrapper.emitted('update:modelValue')
    expect(events).toBeTruthy()
    expect(events!.length).toBe(1)
    expect(events![0]).toEqual([true])
  })

  it('renders description text', () => {
    const wrapper = mount(SToggle, {
      props: { modelValue: false, label: 'Feature', description: 'Enable this feature' },
    })
    expect(wrapper.text()).toContain('Enable this feature')
  })

  it('toggle switch knob position reflects state', () => {
    const wrapperOff = mount(SToggle, { props: { modelValue: false } })
    const wrapperOn = mount(SToggle, { props: { modelValue: true } })

    const knobOff = wrapperOff.find('button span')
    const knobOn = wrapperOn.find('button span')

    // Off state uses translate-x-[2px], on state uses translate-x-[20px]
    expect(knobOff.classes()).toContain('translate-x-[2px]')
    expect(knobOn.classes()).toContain('translate-x-[20px]')
  })
})
