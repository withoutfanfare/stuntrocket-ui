import { describe, it, expect, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import SDropdownMenu from './SDropdownMenu.vue'

const items = [
  { label: 'Edit', value: 'edit' },
  { label: 'Duplicate', value: 'duplicate' },
  { label: 'Archive', value: 'archive', disabled: true },
  { label: 'Delete', value: 'delete', danger: true },
]

describe('SDropdownMenu', () => {
  it('initially closed', () => {
    const wrapper = mount(SDropdownMenu, {
      props: { items },
      slots: {
        trigger: '<button class="trigger-btn">Menu</button>',
      },
    })
    // Items panel should not exist when closed
    const itemButtons = wrapper.findAll('button').filter(b => items.some(i => b.text() === i.label))
    expect(itemButtons.length).toBe(0)
  })

  it('opens on trigger click', async () => {
    const wrapper = mount(SDropdownMenu, {
      props: { items },
      slots: {
        trigger: `<template #trigger="{ toggle }"><button class="trigger-btn" @click="toggle">Menu</button></template>`,
      },
    })
    await wrapper.find('.trigger-btn').trigger('click')
    // After opening, the item buttons should be rendered
    const itemButtons = wrapper.findAll('button').filter(b => items.some(i => b.text() === i.label))
    expect(itemButtons.length).toBe(items.length)
  })

  it('renders items when open', async () => {
    const wrapper = mount(SDropdownMenu, {
      props: { items },
      slots: {
        trigger: `<template #trigger="{ toggle }"><button class="trigger-btn" @click="toggle">Menu</button></template>`,
      },
    })
    await wrapper.find('.trigger-btn').trigger('click')
    expect(wrapper.text()).toContain('Edit')
    expect(wrapper.text()).toContain('Duplicate')
    expect(wrapper.text()).toContain('Archive')
    expect(wrapper.text()).toContain('Delete')
  })

  it('emits select with item value on click', async () => {
    const wrapper = mount(SDropdownMenu, {
      props: { items },
      slots: {
        trigger: `<template #trigger="{ toggle }"><button class="trigger-btn" @click="toggle">Menu</button></template>`,
      },
    })
    await wrapper.find('.trigger-btn').trigger('click')
    // Find the "Edit" button among item buttons
    const allButtons = wrapper.findAll('button')
    const editButton = allButtons.find(b => b.text() === 'Edit')
    expect(editButton).toBeTruthy()
    await editButton!.trigger('click')
    const events = wrapper.emitted('select')
    expect(events).toBeTruthy()
    expect(events![0]).toEqual(['edit'])
  })

  it('closes after selection', async () => {
    const wrapper = mount(SDropdownMenu, {
      props: { items },
      slots: {
        trigger: `<template #trigger="{ toggle }"><button class="trigger-btn" @click="toggle">Menu</button></template>`,
      },
    })
    await wrapper.find('.trigger-btn').trigger('click')
    const allButtons = wrapper.findAll('button')
    const editButton = allButtons.find(b => b.text() === 'Edit')
    await editButton!.trigger('click')
    // The menu panel should have been removed
    expect(wrapper.find('.s-dropdown-menu div[class*="absolute"]').exists()).toBe(false)
  })

  it('disabled items are not clickable', async () => {
    const wrapper = mount(SDropdownMenu, {
      props: { items },
      slots: {
        trigger: `<template #trigger="{ toggle }"><button class="trigger-btn" @click="toggle">Menu</button></template>`,
      },
    })
    await wrapper.find('.trigger-btn').trigger('click')
    const allButtons = wrapper.findAll('button')
    const archiveButton = allButtons.find(b => b.text() === 'Archive')
    expect(archiveButton).toBeTruthy()
    await archiveButton!.trigger('click')
    // Should not emit select for disabled item
    expect(wrapper.emitted('select')).toBeFalsy()
  })

  it('danger items have danger styling', async () => {
    const wrapper = mount(SDropdownMenu, {
      props: { items },
      slots: {
        trigger: `<template #trigger="{ toggle }"><button class="trigger-btn" @click="toggle">Menu</button></template>`,
      },
    })
    await wrapper.find('.trigger-btn').trigger('click')
    const allButtons = wrapper.findAll('button')
    const deleteButton = allButtons.find(b => b.text() === 'Delete')
    expect(deleteButton).toBeTruthy()
    expect(deleteButton!.classes()).toContain('text-danger')
  })

  describe('keyboard and focus', () => {
    enableAutoUnmount(afterEach)

    function mountWithTrigger() {
      return mount(SDropdownMenu, {
        attachTo: document.body,
        props: { items },
        slots: {
          trigger: `<template #trigger="{ toggle, triggerAttrs }"><button class="trigger-btn" v-bind="triggerAttrs" @click="toggle">Menu</button></template>`,
        },
      })
    }

    async function openFromTrigger(wrapper: ReturnType<typeof mountWithTrigger>) {
      const trigger = wrapper.find('.trigger-btn')
      ;(trigger.element as HTMLElement).focus()
      await trigger.trigger('click')
      await nextTick()
      await nextTick()
      return trigger
    }

    it('moves focus to the first item when opened', async () => {
      const wrapper = mountWithTrigger()
      await openFromTrigger(wrapper)
      expect(document.activeElement?.textContent?.trim()).toBe('Edit')
    })

    it('returns focus to the trigger on Escape', async () => {
      const wrapper = mountWithTrigger()
      const trigger = await openFromTrigger(wrapper)
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      await nextTick()
      expect(document.activeElement).toBe(trigger.element)
    })

    it('closes when Tab moves focus away', async () => {
      const wrapper = mountWithTrigger()
      await openFromTrigger(wrapper)
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }))
      await nextTick()
      expect(wrapper.find('[role="menu"]').exists()).toBe(false)
    })

    it('gives the trigger aria-haspopup and aria-expanded', async () => {
      const wrapper = mountWithTrigger()
      const trigger = wrapper.find('.trigger-btn')
      expect(trigger.attributes('aria-haspopup')).toBe('menu')
      expect(trigger.attributes('aria-expanded')).toBe('false')
      await openFromTrigger(wrapper)
      expect(trigger.attributes('aria-expanded')).toBe('true')
    })
  })
})
