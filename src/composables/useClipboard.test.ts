import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { effectScope } from 'vue'
import { useClipboard } from './useClipboard'

describe('useClipboard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('copies text using the Clipboard API', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })

    const scope = effectScope()
    await scope.run(async () => {
      const { copy, copied } = useClipboard()

      const result = await copy('hello')

      expect(writeText).toHaveBeenCalledWith('hello')
      expect(result).toBe(true)
      expect(copied.value).toBe(true)
    })
    scope.stop()
  })

  it('resets copied flag after 2 seconds', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })

    const scope = effectScope()
    await scope.run(async () => {
      const { copy, copied } = useClipboard()

      await copy('hello')
      expect(copied.value).toBe(true)

      vi.advanceTimersByTime(2000)
      expect(copied.value).toBe(false)
    })
    scope.stop()
  })

  it('returns false when clipboard API throws', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'))
    vi.stubGlobal('navigator', { clipboard: { writeText } })

    // execCommand fallback also fails
    document.execCommand = vi.fn().mockReturnValue(false)

    const scope = effectScope()
    await scope.run(async () => {
      const { copy, copied } = useClipboard()

      const result = await copy('hello')

      expect(result).toBe(false)
      expect(copied.value).toBe(false)
    })
    scope.stop()
  })
})
