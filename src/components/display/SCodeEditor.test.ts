import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SCodeEditor from './SCodeEditor.vue'

describe('SCodeEditor', () => {
  it('renders code as plain text', () => {
    const wrapper = mount(SCodeEditor, {
      props: { code: 'const x = 1' },
    })
    expect(wrapper.text()).toContain('const x = 1')
  })

  it('shows line numbers by default', () => {
    const code = 'line1\nline2\nline3'
    const wrapper = mount(SCodeEditor, {
      props: { code },
    })
    // Line numbers gutter should be present (aria-hidden div)
    const gutter = wrapper.find('[aria-hidden="true"]')
    expect(gutter.exists()).toBe(true)
    // Should show 3 line numbers
    const lineNumberDivs = gutter.findAll('div')
    expect(lineNumberDivs.length).toBe(3)
    expect(lineNumberDivs[0].text()).toBe('1')
    expect(lineNumberDivs[1].text()).toBe('2')
    expect(lineNumberDivs[2].text()).toBe('3')
  })

  it('hides line numbers when lineNumbers=false', () => {
    const wrapper = mount(SCodeEditor, {
      props: { code: 'const x = 1', lineNumbers: false },
    })
    const gutter = wrapper.find('[aria-hidden="true"]')
    expect(gutter.exists()).toBe(false)
  })

  it('handles empty string code', () => {
    const wrapper = mount(SCodeEditor, {
      props: { code: '' },
    })
    // Empty string split by \n gives [''], so 1 line number
    const gutter = wrapper.find('[aria-hidden="true"]')
    expect(gutter.exists()).toBe(true)
    const lineNumberDivs = gutter.findAll('div')
    expect(lineNumberDivs.length).toBe(1)
  })

  it('handles undefined code (null guard)', () => {
    const wrapper = mount(SCodeEditor, {
      props: { code: undefined as unknown as string },
    })
    // The computed uses `props.code ?? ''` so it should handle undefined
    const gutter = wrapper.find('[aria-hidden="true"]')
    expect(gutter.exists()).toBe(true)
    const lineNumberDivs = gutter.findAll('div')
    expect(lineNumberDivs.length).toBe(1)
  })

  it('correct number of line number elements', () => {
    const code = 'a\nb\nc\nd\ne'
    const wrapper = mount(SCodeEditor, {
      props: { code },
    })
    const gutter = wrapper.find('[aria-hidden="true"]')
    const lineNumberDivs = gutter.findAll('div')
    expect(lineNumberDivs.length).toBe(5)
    expect(lineNumberDivs[4].text()).toBe('5')
  })
})
