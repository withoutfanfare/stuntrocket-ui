import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SInlineTextField from './SInlineTextField.vue'

describe('SInlineTextField', () => {
  it('renders display mode with modelValue', () => {
    const wrapper = mount(SInlineTextField, {
      props: { modelValue: 'Hello world' },
    })
    expect(wrapper.text()).toContain('Hello world')
    expect(wrapper.find('input').exists()).toBe(false)
  })

  it('shows placeholder when value is empty', () => {
    const wrapper = mount(SInlineTextField, {
      props: { modelValue: '', placeholder: 'Type here' },
    })
    expect(wrapper.text()).toContain('Type here')
  })

  it('enters edit mode on click', async () => {
    const wrapper = mount(SInlineTextField, {
      props: { modelValue: 'Hello' },
    })
    await wrapper.find('span[role="button"]').trigger('click')
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('input').element.value).toBe('Hello')
  })

  it('does not enter edit mode when disabled', async () => {
    const wrapper = mount(SInlineTextField, {
      props: { modelValue: 'Hello', disabled: true },
    })
    await wrapper.find('span[role="button"]').trigger('click')
    expect(wrapper.find('input').exists()).toBe(false)
  })

  it('emits update:modelValue on Enter', async () => {
    const wrapper = mount(SInlineTextField, {
      props: { modelValue: 'Hello' },
    })
    // Enter edit mode
    await wrapper.find('span[role="button"]').trigger('click')
    const input = wrapper.find('input')
    await input.setValue('Updated')
    await input.trigger('keydown', { key: 'Enter' })

    const events = wrapper.emitted('update:modelValue')
    expect(events).toBeTruthy()
    expect(events!.length).toBe(1)
    expect(events![0]).toEqual(['Updated'])
  })

  it('reverts on Escape and does not emit', async () => {
    const wrapper = mount(SInlineTextField, {
      props: { modelValue: 'Original' },
    })
    await wrapper.find('span[role="button"]').trigger('click')
    const input = wrapper.find('input')
    await input.setValue('Changed')
    await input.trigger('keydown', { key: 'Escape' })

    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    // Should exit edit mode
    expect(wrapper.find('input').exists()).toBe(false)
    expect(wrapper.text()).toContain('Original')
  })

  it('does not double-emit on Enter (blur guard)', async () => {
    const wrapper = mount(SInlineTextField, {
      props: { modelValue: 'Hello' },
    })
    await wrapper.find('span[role="button"]').trigger('click')
    const input = wrapper.find('input')
    await input.setValue('New value')
    await input.trigger('keydown', { key: 'Enter' })

    // The Enter handler sets cancelled=true before hiding the input,
    // which prevents the blur handler from emitting a second time.
    const events = wrapper.emitted('update:modelValue')
    expect(events).toBeTruthy()
    expect(events!.length).toBe(1)
  })
})
