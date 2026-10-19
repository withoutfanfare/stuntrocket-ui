// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { createSSRApp, h, type Component } from 'vue'
import { renderToString } from '@vue/server-renderer'
import SModal from './components/overlay/SModal.vue'
import SDrawer from './components/overlay/SDrawer.vue'
import SPanel from './components/overlay/SPanel.vue'
import SWizard from './components/overlay/SWizard.vue'
import SImageLightbox from './components/overlay/SImageLightbox.vue'
import SCommandPalette from './components/overlay/SCommandPalette.vue'
import SConfirmDialog from './components/overlay/SConfirmDialog.vue'
import SKeyboardShortcuts from './components/overlay/SKeyboardShortcuts.vue'
import SThemeProvider from './components/layout/SThemeProvider.vue'
import SToastContainer from './components/feedback/SToastContainer.vue'
import { useSidebarCollapse } from './composables/useSidebarCollapse'

// Server rendering (for example in Nuxt) has no `document` or `localStorage`.
// Every component must render there without touching browser-only globals.
async function render(component: Component, props: Record<string, unknown> = {}) {
  return renderToString(createSSRApp({ render: () => h(component, props) }))
}

const overlays: [string, Component, Record<string, unknown>][] = [
  ['SModal', SModal, {}],
  ['SDrawer', SDrawer, {}],
  ['SPanel', SPanel, {}],
  ['SWizard', SWizard, { steps: [{ title: 'One' }] }],
  ['SImageLightbox', SImageLightbox, { src: '/a.png' }],
  ['SCommandPalette', SCommandPalette, {}],
  ['SConfirmDialog', SConfirmDialog, { title: 'Sure?' }],
  ['SKeyboardShortcuts', SKeyboardShortcuts, { groups: [] }],
]

describe('server rendering', () => {
  it.each(overlays)('%s renders closed and open', async (_name, component, props) => {
    await expect(render(component, { ...props, open: false })).resolves.toBeTypeOf('string')
    await expect(render(component, { ...props, open: true })).resolves.toBeTypeOf('string')
  })

  it('SThemeProvider renders', async () => {
    await expect(render(SThemeProvider)).resolves.toBeTypeOf('string')
  })

  it('SToastContainer renders', async () => {
    await expect(render(SToastContainer)).resolves.toBeTypeOf('string')
  })

  it('useSidebarCollapse works without localStorage', async () => {
    const Probe = { setup: () => { const { collapsed } = useSidebarCollapse(); return () => h('div', String(collapsed.value)) } }
    await expect(render(Probe)).resolves.toContain('false')
  })
})
