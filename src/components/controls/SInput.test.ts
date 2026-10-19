import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SInput from './SInput.vue'

describe('SInput', () => {
  it('renders input with modelValue', () => {
    const wrapper = mount(SInput, {
      props: { modelValue: 'hello' },
    })
    const input = wrapper.find('input')
    expect((input.element as HTMLInputElement).value).toBe('hello')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(SInput, {
      props: { modelValue: '' },
    })
    const input = wrapper.find('input')
    await input.setValue('new value')
    const events = wrapper.emitted('update:modelValue')
    expect(events).toBeTruthy()
    expect(events![0]).toEqual(['new value'])
  })

  it('renders with label when provided', () => {
    const wrapper = mount(SInput, {
      props: { modelValue: '', label: 'Email' },
    })
    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toContain('Email')
  })

  it('shows error message when error prop set', () => {
    const wrapper = mount(SInput, {
      props: { modelValue: '', error: 'Required field' },
    })
    expect(wrapper.text()).toContain('Required field')
  })

  it('shows hint when provided and no error', () => {
    const wrapper = mount(SInput, {
      props: { modelValue: '', hint: 'Enter your name' },
    })
    expect(wrapper.text()).toContain('Enter your name')
  })

  it('hides hint when error is present', () => {
    const wrapper = mount(SInput, {
      props: { modelValue: '', hint: 'Enter your name', error: 'Required' },
    })
    expect(wrapper.text()).not.toContain('Enter your name')
    expect(wrapper.text()).toContain('Required')
  })

  it('applies error styling (border-danger class)', () => {
    const wrapper = mount(SInput, {
      props: { modelValue: '', error: 'Invalid' },
    })
    const input = wrapper.find('input')
    expect(input.classes()).toContain('border-danger')
  })

  it('applies normal border when no error', () => {
    const wrapper = mount(SInput, {
      props: { modelValue: '', label: 'Name' },
    })
    const input = wrapper.find('input')
    expect(input.classes()).toContain('border-border')
    expect(input.classes()).not.toContain('border-danger')
  })

  it('disabled state', () => {
    const wrapper = mount(SInput, {
      props: { modelValue: '', disabled: true },
    })
    const input = wrapper.find('input')
    expect((input.element as HTMLInputElement).disabled).toBe(true)
  })

  it('plain input (no label/error/hint) still renders inside the stable wrapper div', () => {
    // The component always renders a single-root div wrapper so the input
    // never unmounts when a label/error/hint is added or removed mid-typing.
    // (The previous fragment-root pattern caused focus loss.)
    const wrapper = mount(SInput, {
      props: { modelValue: '' },
    })
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('wraps in div when label is provided', () => {
    const wrapper = mount(SInput, {
      props: { modelValue: '', label: 'Name' },
    })
    expect(wrapper.element.tagName).toBe('DIV')
    // Label must be associated via for/id for screen readers.
    const label = wrapper.find('label')
    const input = wrapper.find('input')
    expect(label.attributes('for')).toBe(input.attributes('id'))
  })

  it('links error via aria-describedby and sets aria-invalid', () => {
    const wrapper = mount(SInput, {
      props: { modelValue: '', error: 'Required' },
    })
    const input = wrapper.find('input')
    const error = wrapper.find('[role="alert"]')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe(error.attributes('id'))
  })

  it('passes required to the native input', () => {
    const wrapper = mount(SInput, {
      props: { modelValue: '', required: true },
    })
    expect((wrapper.find('input').element as HTMLInputElement).required).toBe(true)
  })

  it('coerces to number when type="number"', async () => {
    const wrapper = mount(SInput, {
      props: { modelValue: 0, type: 'number' },
    })
    await wrapper.find('input').setValue('42')
    const events = wrapper.emitted('update:modelValue')
    expect(events).toBeTruthy()
    expect(events![0]).toEqual([42])
  })
})
