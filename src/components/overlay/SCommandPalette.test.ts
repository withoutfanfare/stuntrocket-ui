import { describe, it, expect, afterEach } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import SCommandPalette from './SCommandPalette.vue'

enableAutoUnmount(afterEach)

const Host = defineComponent({
  setup() {
    const open = ref(false)
    return () => [
      h('button', { id: 'trigger', onClick: () => { open.value = true } }, 'Open'),
      h(SCommandPalette, { open: open.value, onClose: () => { open.value = false } }, {
        default: () => h('button', { id: 'result' }, 'Result'),
      }),
    ]
  },
})

async function settle() {
  await nextTick()
  await nextTick()
}

describe('SCommandPalette', () => {
  it('labels its search input', () => {
    const wrapper = mount(SCommandPalette, { props: { open: true }, global: { stubs: { Teleport: true } } })
    expect(wrapper.find('input').attributes('aria-label')).toBeTruthy()
  })

  it('moves focus into the palette and back to the trigger on close', async () => {
    const wrapper = mount(Host, { attachTo: document.body, global: { stubs: { Teleport: true } } })
    const trigger = wrapper.find('#trigger')
    ;(trigger.element as HTMLElement).focus()
    await trigger.trigger('click')
    await settle()
    expect(document.activeElement?.tagName).toBe('INPUT')

    await wrapper.find('input').trigger('keydown', { key: 'Escape' })
    await settle()
    expect(document.activeElement?.id).toBe('trigger')
  })

  it('keeps Tab inside the palette', async () => {
    const wrapper = mount(Host, { attachTo: document.body, global: { stubs: { Teleport: true } } })
    await wrapper.find('#trigger').trigger('click')
    await settle()
    const result = wrapper.find('#result').element as HTMLElement
    result.focus()
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
    result.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
    expect(document.activeElement?.tagName).toBe('INPUT')
  })
})
