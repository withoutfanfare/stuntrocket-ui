type KeydownHandler = (e: KeyboardEvent) => boolean | void

interface RegisteredHandler {
  priority: number
  handler: KeydownHandler
}

const handlers: RegisteredHandler[] = []
let listening = false

function onKeydown(e: KeyboardEvent) {
  // Snapshot before iterating: a handler may unregister (mutate the array)
  // mid-dispatch, which would otherwise cause entries to be skipped.
  const snapshot = [...handlers]
  for (const entry of snapshot) {
    const handled = entry.handler(e)
    if (handled) return
  }
}

function startListening() {
  if (!listening) {
    window.addEventListener('keydown', onKeydown)
    listening = true
  }
}

function stopListening() {
  if (listening && handlers.length === 0) {
    window.removeEventListener('keydown', onKeydown)
    listening = false
  }
}

export function registerKeydownHandler(priority: number, handler: KeydownHandler): () => void {
  const entry: RegisteredHandler = { priority, handler }
  handlers.push(entry)
  handlers.sort((a, b) => b.priority - a.priority)
  startListening()

  return () => {
    const idx = handlers.indexOf(entry)
    if (idx !== -1) handlers.splice(idx, 1)
    stopListening()
  }
}
