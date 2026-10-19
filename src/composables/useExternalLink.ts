export function useExternalLink() {
  async function openExternal(url: string) {
    // Reject anything that isn't an http(s) URL — protects the Tauri bridge
    // from scheme-injection (e.g. `file://`, `javascript:`).
    if (!/^https?:\/\//i.test(url)) {
      throw new Error(`useExternalLink: refusing to open non-http(s) URL "${url}"`)
    }

    try {
      // Use a string variable so bundlers can't statically resolve this —
      // Tauri may not be installed in every consumer. The @vite-ignore
      // comment is belt-and-braces for Vite's dynamic-import analyser.
      const specifier = '@tauri-apps/api/core'
      const mod = await import(/* @vite-ignore */ specifier) as {
        invoke: (cmd: string, args: Record<string, unknown>) => Promise<void>
      }
      await mod.invoke('open_external_url', { url })
    } catch {
      window.open(url, '_blank', 'noopener')
    }
  }

  return { openExternal }
}
