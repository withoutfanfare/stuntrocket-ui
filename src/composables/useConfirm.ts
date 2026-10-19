import { ref, type Ref } from 'vue'

export interface ConfirmOptions {
  /** Dialog title text */
  title: string
  /** Optional descriptive message shown below the title */
  message?: string
  /** Label for the confirm button (default "Confirm") */
  confirmLabel?: string
  /** Label for the cancel button (default "Cancel") */
  cancelLabel?: string
  /** Whether the action is destructive (styles the confirm button accordingly) */
  danger?: boolean
}

export interface UseConfirmReturn {
  isOpen: Ref<boolean>
  options: Ref<ConfirmOptions>
  confirm: (opts: ConfirmOptions) => Promise<boolean>
  handleConfirm: () => void
  handleCancel: () => void
  /** Dismiss the dialog as a cancellation (e.g. on Escape or click-outside). */
  handleDismiss: () => void
}

// Module-level singleton state so every consumer shares the same dialog
const isOpen = ref(false)
const options = ref<ConfirmOptions>({ title: '' })
let resolvePromise: ((value: boolean) => void) | null = null

/**
 * Composable for a global confirmation dialog.
 *
 * Uses module-level singleton state so any component can trigger a
 * confirmation and any single `<SConfirmDialog>` at the app root can
 * render it.
 *
 * @example
 * ```ts
 * const { confirm } = useConfirm()
 * const ok = await confirm({ title: 'Delete item?', danger: true })
 * if (ok) { /* proceed *\/ }
 * ```
 */
export function useConfirm(): UseConfirmReturn {
  /**
   * Show the confirmation dialog and wait for the user's response.
   * Resolves `true` when confirmed, `false` when cancelled or closed.
   */
  function confirm(opts: ConfirmOptions): Promise<boolean> {
    // If a previous confirmation is still pending (e.g. user triggered a second
    // confirm before resolving the first), resolve it as cancelled so the
    // awaiting caller doesn't hang forever with an unsettled Promise.
    if (resolvePromise) {
      resolvePromise(false)
      resolvePromise = null
    }

    options.value = opts
    isOpen.value = true

    return new Promise<boolean>((resolve) => {
      resolvePromise = resolve
    })
  }

  /** Called when the user presses the confirm button. */
  function handleConfirm() {
    isOpen.value = false
    if (resolvePromise) {
      resolvePromise(true)
      resolvePromise = null
    }
  }

  /** Called when the user presses cancel or closes the dialog. */
  function handleCancel() {
    isOpen.value = false
    if (resolvePromise) {
      resolvePromise(false)
      resolvePromise = null
    }
  }

  /**
   * Called when the user dismisses the dialog without an explicit choice
   * (Escape key, backdrop click, etc.). Behaves as a cancellation.
   */
  function handleDismiss() {
    if (!isOpen.value) return
    handleCancel()
  }

  return { isOpen, options, confirm, handleConfirm, handleCancel, handleDismiss }
}
