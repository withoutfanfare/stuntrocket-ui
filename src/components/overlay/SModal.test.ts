import { describe, it, expect, afterEach } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import SModal from './SModal.vue'

// Overlays share one scroll lock, so a modal left mounted would hold it open
// into the next test.
enableAutoUnmount(afterEach)

describe('SModal', () => {
  it('not rendered when open=false', () => {
    const wrapper = mount(SModal, {
      props: { open: false },
      global: {
        stubs: { Teleport: true },
      },
    })
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('rendered when open=true', () => {
    const wrapper = mount(SModal, {
      props: { open: true },
      global: {
        stubs: { Teleport: true },
      },
    })
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    expect(wrapper.find('[role="dialog"]').attributes('aria-modal')).toBe('true')
  })

  it('emits close on Escape', async () => {
    const wrapper = mount(SModal, {
      props: { open: true },
      global: {
        stubs: { Teleport: true },
      },
    })
    // Escape is handled by a document-level listener so it works even when no
    // child inside the modal currently has focus.
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()
    const events = wrapper.emitted('close')
    expect(events).toBeTruthy()
    expect(events!.length).toBe(1)
  })

  it('does not emit close on Escape when closable=false', async () => {
    const wrapper = mount(SModal, {
      props: { open: true, closable: false },
      global: {
        stubs: { Teleport: true },
      },
    })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('close')).toBeFalsy()
  })

  it('does not emit close on overlay click when closable=false', async () => {
    const wrapper = mount(SModal, {
      props: { open: true, closable: false },
      global: {
        stubs: { Teleport: true },
      },
    })
    const overlay = wrapper.find('.fixed')
    await overlay.trigger('click')
    expect(wrapper.emitted('close')).toBeFalsy()
  })

  it('locks body scroll while open and restores on close', async () => {
    document.body.style.overflow = ''
    const wrapper = mount(SModal, {
      props: { open: true },
      global: {
        stubs: { Teleport: true },
      },
    })
    expect(document.body.style.overflow).toBe('hidden')
    await wrapper.setProps({ open: false })
    expect(document.body.style.overflow).toBe('')
  })

  it('restores body scroll on unmount even if still open', () => {
    document.body.style.overflow = ''
    const wrapper = mount(SModal, {
      props: { open: true },
      global: {
        stubs: { Teleport: true },
      },
    })
    expect(document.body.style.overflow).toBe('hidden')
    wrapper.unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('emits close on overlay click', async () => {
    const wrapper = mount(SModal, {
      props: { open: true },
      global: {
        stubs: { Teleport: true },
      },
    })
    // Click the overlay background (the fixed div)
    const overlay = wrapper.find('.fixed')
    // Simulate click where target === currentTarget (click on backdrop itself)
    await overlay.trigger('click')
    const events = wrapper.emitted('close')
    expect(events).toBeTruthy()
  })

  it('renders header slot', () => {
    const wrapper = mount(SModal, {
      props: { open: true },
      global: {
        stubs: { Teleport: true },
      },
      slots: {
        header: '<h2>Custom Header</h2>',
      },
    })
    expect(wrapper.text()).toContain('Custom Header')
  })

  it('renders footer slot', () => {
    const wrapper = mount(SModal, {
      props: { open: true },
      global: {
        stubs: { Teleport: true },
      },
      slots: {
        footer: '<button>Save</button>',
      },
    })
    expect(wrapper.text()).toContain('Save')
  })

  it('renders title and description props', () => {
    const wrapper = mount(SModal, {
      props: { open: true, title: 'Confirm Action', description: 'Are you sure?' },
      global: {
        stubs: { Teleport: true },
      },
    })
    expect(wrapper.text()).toContain('Confirm Action')
    expect(wrapper.text()).toContain('Are you sure?')
  })
})
