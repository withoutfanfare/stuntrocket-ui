import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SConfirmDialog from './SConfirmDialog.vue'
import SKeyboardShortcuts from './SKeyboardShortcuts.vue'
import SImageLightbox from './SImageLightbox.vue'

const global = { stubs: { Teleport: true } }

// Screen readers announce a dialog by its accessible name: the element its
// aria-labelledby points to, or its aria-label.
function nameOf(wrapper: ReturnType<typeof mount>, role: string) {
  const dialog = wrapper.find(`[role="${role}"]`)
  const labelledBy = dialog.attributes('aria-labelledby')
  if (labelledBy) return wrapper.find(`[id="${labelledBy}"]`).text()
  return dialog.attributes('aria-label')
}

describe('dialog accessible names', () => {
  it('SConfirmDialog is named by its title', () => {
    const wrapper = mount(SConfirmDialog, { props: { open: true, title: 'Delete project?' }, global })
    expect(nameOf(wrapper, 'alertdialog')).toBe('Delete project?')
  })

  it('SKeyboardShortcuts is named', () => {
    const wrapper = mount(SKeyboardShortcuts, { props: { open: true, groups: [] }, global })
    expect(nameOf(wrapper, 'dialog')).toBe('Keyboard Shortcuts')
  })

  it('SImageLightbox is named when alt text is given', () => {
    const wrapper = mount(SImageLightbox, { props: { open: true, src: '/a.png', alt: 'Site plan' }, global })
    expect(nameOf(wrapper, 'dialog')).toBe('Site plan')
  })
})
