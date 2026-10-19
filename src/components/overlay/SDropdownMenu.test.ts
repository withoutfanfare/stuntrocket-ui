import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
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
    // After selection, items should no longer be visible
    const itemButtons = wrapper.findAll('button').filter(b => b.text() === 'Edit' && !b.classes().includes('trigger-btn'))
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
})
