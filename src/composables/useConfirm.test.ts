import { describe, it, expect, beforeEach } from 'vitest'
import { useConfirm } from './useConfirm'

describe('useConfirm', () => {
  beforeEach(() => {
    // Reset singleton state by cancelling any open dialog
    const { isOpen, handleCancel } = useConfirm()
    if (isOpen.value) handleCancel()
  })

  it('starts closed', () => {
    const { isOpen } = useConfirm()
    expect(isOpen.value).toBe(false)
  })

  it('opens the dialog with provided options', () => {
    const { isOpen, options, confirm } = useConfirm()

    confirm({ title: 'Delete?', danger: true })

    expect(isOpen.value).toBe(true)
    expect(options.value.title).toBe('Delete?')
    expect(options.value.danger).toBe(true)
  })

  it('resolves true on handleConfirm', async () => {
    const { confirm, handleConfirm, isOpen } = useConfirm()

    const promise = confirm({ title: 'Proceed?' })
    handleConfirm()

    const result = await promise
    expect(result).toBe(true)
    expect(isOpen.value).toBe(false)
  })

  it('resolves false on handleCancel', async () => {
    const { confirm, handleCancel, isOpen } = useConfirm()

    const promise = confirm({ title: 'Proceed?' })
    handleCancel()

    const result = await promise
    expect(result).toBe(false)
    expect(isOpen.value).toBe(false)
  })

  it('shares state across instances (singleton)', () => {
    const a = useConfirm()
    const b = useConfirm()

    a.confirm({ title: 'Shared?' })

    expect(b.isOpen.value).toBe(true)
    expect(b.options.value.title).toBe('Shared?')
  })

  it('resolves a pending confirm as false when a second confirm supersedes it', async () => {
    const { confirm } = useConfirm()

    const first = confirm({ title: 'First?' })
    const second = confirm({ title: 'Second?' })

    // The first confirmation must not hang forever — it resolves as cancelled.
    const [firstResult] = await Promise.all([first, Promise.resolve('pending')])
    expect(firstResult).toBe(false)

    // The second still resolves normally via handleConfirm/handleCancel.
    const { handleConfirm } = useConfirm()
    handleConfirm()
    const secondResult = await second
    expect(secondResult).toBe(true)
  })
})
