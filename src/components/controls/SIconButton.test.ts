import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SIconButton from './SIconButton.vue'

describe('SIconButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(SIconButton, {
      props: { tooltip: 'Edit' },
      slots: { default: '<svg data-testid="icon"></svg>' },
    })
    expect(wrapper.find('[data-testid="icon"]').exists()).toBe(true)
  })

  it('emits click on click', async () => {
    const wrapper = mount(SIconButton, {
      props: { tooltip: 'Edit' },
    })
    await wrapper.find('button').trigger('click')
    const events = wrapper.emitted('click')
    expect(events).toBeTruthy()
    expect(events!.length).toBe(1)
  })

  it('does not emit when disabled', async () => {
    const wrapper = mount(SIconButton, {
      props: { tooltip: 'Edit', disabled: true },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('does not emit when loading', async () => {
    const wrapper = mount(SIconButton, {
      props: { tooltip: 'Edit', loading: true },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('shows spinner when loading', () => {
    const wrapper = mount(SIconButton, {
      props: { tooltip: 'Edit', loading: true },
      slots: { default: '<span>icon</span>' },
    })
    // Loading state shows SVG spinner with animate-spin class
    const spinner = wrapper.find('svg.animate-spin')
    expect(spinner.exists()).toBe(true)
    // Slot content should not be visible when loading
    expect(wrapper.find('span').exists()).toBe(false)
  })

  it('applies correct variant classes - ghost', () => {
    const wrapper = mount(SIconButton, {
      props: { tooltip: 'Edit', variant: 'ghost' },
    })
    const button = wrapper.find('button')
    expect(button.classes()).toContain('text-text-secondary')
  })

  it('applies correct variant classes - danger', () => {
    const wrapper = mount(SIconButton, {
      props: { tooltip: 'Delete', variant: 'danger' },
    })
    const button = wrapper.find('button')
    // Danger variant (non-active) should have text-text-secondary class
    expect(button.classes()).toContain('text-text-secondary')
  })

  it('applies correct size classes', () => {
    const wrapperSm = mount(SIconButton, {
      props: { tooltip: 'Edit', size: 'sm' },
    })
    expect(wrapperSm.find('button').classes()).toContain('w-7')
    expect(wrapperSm.find('button').classes()).toContain('h-7')

    const wrapperLg = mount(SIconButton, {
      props: { tooltip: 'Edit', size: 'lg' },
    })
    expect(wrapperLg.find('button').classes()).toContain('w-10')
    expect(wrapperLg.find('button').classes()).toContain('h-10')
  })
})
