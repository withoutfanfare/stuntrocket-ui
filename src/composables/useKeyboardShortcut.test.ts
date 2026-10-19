import { describe, it, expect } from 'vitest'
import { formatShortcut } from './useKeyboardShortcut'

describe('formatShortcut', () => {
  it('formats a plain key as uppercase', () => {
    expect(formatShortcut('k')).toBe('K')
  })

  it('leaves multi-character keys as-is', () => {
    expect(formatShortcut('Escape')).toBe('Escape')
  })

  it('formats meta modifier for non-Mac', () => {
    // jsdom userAgent does not contain 'Mac'
    expect(formatShortcut('s', { meta: true })).toBe('Ctrl+S')
  })

  it('formats shift modifier for non-Mac', () => {
    expect(formatShortcut('p', { shift: true })).toBe('Shift+P')
  })

  it('formats alt modifier for non-Mac', () => {
    expect(formatShortcut('n', { alt: true })).toBe('Alt+N')
  })

  it('formats combined modifiers', () => {
    expect(formatShortcut('k', { meta: true, shift: true })).toBe('Ctrl+Shift+K')
  })
})
