import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { Component } from 'vue'
import SInput from './SInput.vue'
import STextarea from './STextarea.vue'
import SSelect from './SSelect.vue'

const fields: [string, Component, string][] = [
  ['SInput', SInput, 'input'],
  ['STextarea', STextarea, 'textarea'],
  ['SSelect', SSelect, 'select'],
]

describe.each(fields)('%s attributes', (_name, component, tag) => {
  it('passes native attributes and listeners to the form element', async () => {
    const onBlur = vi.fn()
    const wrapper = mount(component, {
      props: { modelValue: '' },
      attrs: { name: 'email', autocomplete: 'email', 'aria-label': 'Email', onBlur },
    })
    const field = wrapper.find(tag)
    expect(field.attributes('name')).toBe('email')
    expect(field.attributes('autocomplete')).toBe('email')
    expect(field.attributes('aria-label')).toBe('Email')
    await field.trigger('blur')
    expect(onBlur).toHaveBeenCalledOnce()
    expect(wrapper.find('div').attributes('name')).toBeUndefined()
  })

  it('keeps class and style on the outer wrapper for layout', () => {
    const wrapper = mount(component, {
      props: { modelValue: '' },
      attrs: { class: 'col-span-2', style: 'margin-top: 4px' },
    })
    // find('div'), not the wrapper itself: SInput's template starts with a comment.
    const outer = wrapper.find('div')
    expect(outer.classes()).toContain('col-span-2')
    expect(outer.attributes('style')).toContain('margin-top: 4px')
    expect(wrapper.find(tag).classes()).not.toContain('col-span-2')
  })
})
