# @stuntrocket/ui Migration Guide

A practical reference for migrating custom component implementations across Stuntrocket's Tauri app portfolio to use the shared `@stuntrocket/ui` library.

---

## Table of Contents

1. [Quick Start](#1-quick-start)
2. [Migration Status by App](#2-migration-status-by-app)
3. [Component Migration Recipes](#3-component-migration-recipes)
4. [API Differences to Watch For](#4-api-differences-to-watch-for)
5. [Composables Available](#5-composables-available)
6. [Priority Migration Order](#6-priority-migration-order)
7. [Tauri Integration Troubleshooting](#7-tauri-integration-troubleshooting)
8. [Appendix: Import Reference](#appendix-import-reference)

---

## 1. Quick Start

### Install or update the library

The library is published to the local Verdaccio registry. Ensure Verdaccio is running on `http://localhost:4873` before installing.

```bash
# Add to .npmrc (once per app, if not already present)
echo "@stuntrocket:registry=http://localhost:4873" >> .npmrc

# Install or update
npm install @stuntrocket/ui@latest
```

### Required CSS imports

Add the following to your app's main stylesheet, in this exact order. The order matters — tokens must be available before the base styles that reference them.

```css
@import 'tailwindcss';
@import '@stuntrocket/ui/tokens.css';   /* Design tokens — must come first */
@import '@stuntrocket/ui/base.css';
@import '@stuntrocket/ui/scrollbar.css';
@import '@stuntrocket/ui/ambient.css';
```

If you use `@tailwindcss/typography`, import the plugin immediately after `tailwindcss`:

```css
@import 'tailwindcss';
@plugin '@tailwindcss/typography';
@import '@stuntrocket/ui/tokens.css';
/* ... rest of imports */
```

Also add the Poppins font to your `index.html`:

```html
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
/>
```

### Per-app accent colour override

Each app sets its own brand colour by overriding the accent token. The preferred approach is to wrap your app root in `SThemeProvider`:

```vue
<!-- App.vue -->
<template>
  <SThemeProvider accent="#7C3AED">
    <RouterView />
  </SThemeProvider>
</template>
```

`SThemeProvider` automatically derives `--color-accent-hover` and `--color-accent-subtle` from the accent colour using `color-mix()`. You can supply `accent-hover` explicitly if you need precise control:

```vue
<SThemeProvider accent="#7C3AED" accent-hover="#6D28D9">
```

Alternatively, set the CSS custom properties directly in your app's stylesheet:

```css
:root {
  --color-accent: #7C3AED;
  --color-accent-hover: #6D28D9;
}
```

Dark mode uses the `.dark` class on `<html>`, not `prefers-color-scheme`. `useTheme` and `SThemeProvider` manage this automatically.

---

## 2. Migration Status by App

| App | Status | Library Components Used | Remaining Custom Work |
|-----|--------|------------------------|----------------------|
| Kit | 40% migrated | 14 | `SInlineTextField`, `SRowActionMenu` |
| Fuse | 15% migrated | 3 | `SConfirmDialog`, `SCommandPalette`, `SToastContainer`, `SResizableSplit`, `SRouteProgressBar` |
| Grove | 0% migrated | 0 | Full migration needed (21 UI components) |
| Sentinel | 10% migrated | 2 | `SBarChart`, `SHeatmapCalendar`, `SPageHeader`, `SStatusDot`, `SCommandPalette` |
| Dalīl | 5% migrated | 1 | `SCommandPalette`, `SBreadcrumbs`, `SImageLightbox` |
| Amber | 70% migrated | 14 | `useFocusTrap`, `SKpiCard`, `SPageHeader` |
| Drift | 55% migrated | 11 | Remove wrapper components, use library directly |
| Logtriage | N/A | N/A | Non-UI application — no migration needed |

---

## 3. Component Migration Recipes

### Replacing a custom Button

```vue
<!-- Before (custom) -->
<Button variant="primary" @click="save">Save</Button>

<!-- After (library) -->
<script setup lang="ts">
import { SButton } from '@stuntrocket/ui'
</script>

<SButton variant="primary" @click="save">Save</SButton>
```

Available variants: `primary` | `secondary` | `danger` | `ghost` | `icon`
Available sizes: `sm` | `md` | `lg`

`SButton` also accepts a `to` prop to render as a `RouterLink`:

```vue
<SButton variant="ghost" to="/settings">Settings</SButton>
```

---

### Replacing a custom ConfirmDialog

The library uses a module-level singleton pattern. You register the dialog once at app root and trigger it programmatically from anywhere — no prop drilling or provide/inject required.

**Step 1 — Add the dialog to your app root** (once):

```vue
<!-- App.vue -->
<script setup lang="ts">
import { SConfirmDialog } from '@stuntrocket/ui'
import { useConfirm } from '@stuntrocket/ui'

const { isOpen, options, handleConfirm, handleCancel } = useConfirm()
</script>

<template>
  <SThemeProvider accent="#7C3AED">
    <RouterView />

    <SConfirmDialog
      :open="isOpen"
      :title="options.title"
      :message="options.message"
      :confirm-label="options.confirmLabel"
      :cancel-label="options.cancelLabel"
      :danger="options.danger"
      @confirm="handleConfirm"
      @cancel="handleCancel"
      @close="handleCancel"
    />
  </SThemeProvider>
</template>
```

**Step 2 — Trigger from any component**:

```vue
<script setup lang="ts">
import { useConfirm } from '@stuntrocket/ui'

const { confirm } = useConfirm()

async function deleteItem() {
  const ok = await confirm({
    title: 'Delete this item?',
    message: 'This action cannot be undone.',
    confirmLabel: 'Delete',
    danger: true,
  })

  if (ok) {
    // proceed with deletion
  }
}
</script>
```

Remove any custom `ConfirmDialog.vue` components and their associated boolean `ref` state once this pattern is in place.

---

### Replacing a custom CommandPalette

`SCommandPalette` manages its own search input, keyboard navigation (Arrow keys, Enter, Escape), and overlay. The consuming app supplies the filtered results via the default slot and adds `data-index="<n>"` attributes so the palette can scroll the selected item into view.

```vue
<!-- Before (custom) -->
<CommandPalette
  :visible="showPalette"
  :results="filteredCommands"
  @close="showPalette = false"
  @select="runCommand"
/>

<!-- After (library) -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { SCommandPalette } from '@stuntrocket/ui'

const open = ref(false)
const query = ref('')

const results = computed(() =>
  allCommands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.value.toLowerCase())
  )
)

function onSelect(index: number) {
  runCommand(results.value[index])
}
</script>

<template>
  <SCommandPalette
    :open="open"
    :result-count="results.length"
    placeholder="Search commands..."
    @close="open = false"
    @update:query="q => query = q"
    @select="onSelect"
  >
    <div
      v-for="(result, i) in results"
      :key="result.id"
      :data-index="i"
      class="..."
      @click="runCommand(result)"
    >
      {{ result.label }}
    </div>
  </SCommandPalette>
</template>
```

Open the palette in response to a keyboard shortcut using `useKeyboardShortcut`:

```ts
import { useKeyboardShortcut } from '@stuntrocket/ui'

useKeyboardShortcut('k', () => { open.value = true }, { meta: true })
```

---

### Replacing a custom ToastContainer and useToast with useToastStack

The library's `useToastStack` is a module-level singleton — any component can call it and all consumers share the same toast queue. There is no need to provide or inject anything.

**Step 1 — Add `SToastContainer` to your app root** (once):

```vue
<!-- App.vue -->
<script setup lang="ts">
import { SToastContainer } from '@stuntrocket/ui'
</script>

<template>
  <SThemeProvider accent="#7C3AED">
    <RouterView />
    <SToastContainer />   <!-- renders into a Teleport to body -->
  </SThemeProvider>
</template>
```

**Step 2 — Replace custom `useToast` calls**:

```ts
// Before (custom)
import { useToast } from '@/composables/useToast'
const toast = useToast()
toast.success('Saved successfully')
toast.error('Something went wrong')

// After (library)
import { useToastStack } from '@stuntrocket/ui'
const { success, error, info, warning } = useToastStack()
success('Saved successfully')
error('Something went wrong')
```

The `addToast` method is also available for full control: `addToast(message, variant, durationMs)`. Default duration is 4 000 ms. Toasts are dismissed on click or automatically after the duration elapses.

---

### Replacing a custom useFocusTrap

The library's `useFocusTrap` accepts a container ref and a reactive boolean. It automatically focuses the first focusable element when activated and restores focus to the previously focused element when deactivated.

```ts
// Before (custom)
import { useFocusTrap } from '@/composables/useFocusTrap'
const trap = useFocusTrap(modalRef)
watch(isOpen, (open) => open ? trap.activate() : trap.deactivate())

// After (library)
import { useFocusTrap } from '@stuntrocket/ui'
import { ref } from 'vue'

const containerRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)

useFocusTrap(containerRef, isOpen)
// No further calls needed — the composable watches `isOpen` internally
```

---

### Replacing a custom useTheme

```ts
// Before (custom) — typically a provide/inject setup
import { useTheme } from '@/composables/useTheme'
const { theme, toggleTheme } = useTheme()

// After (library)
import { useTheme } from '@stuntrocket/ui'
const { mode, isDark, toggle, setMode } = useTheme()

// mode: Ref<'light' | 'dark' | 'system'>
// isDark: ComputedRef<boolean>
// toggle(): cycles light → dark → system
// setMode('dark'): jump directly to a mode
```

The library's `useTheme` persists the selection to `localStorage` and applies the `.dark` class to `<html>` automatically. The default storage key is `'app-theme-mode'`; pass a custom key if the app uses a different one: `useTheme('my-app-theme')`.

If you use `SThemeProvider`, you do not need to call `useTheme` directly — the provider sets everything up and makes the theme available via `useProvidedTheme()` for child components that need to read or change the mode.

---

## 4. API Differences to Watch For

These are the most common sources of breakage when dropping in library components to replace custom ones.

| Concern | Detail |
|---------|--------|
| **Component naming** | All library components use the `S` prefix. Rename imports: `Button` → `SButton`, `Modal` → `SModal`, `Badge` → `SBadge`, etc. |
| **`SModal` — open prop** | Uses `open` (not `visible`, `show`, or `isOpen`). Emits `close` (no payload). |
| **`SConfirmDialog` — singleton** | Do not bind dialog state to local component data. Use `useConfirm()` and mount a single `<SConfirmDialog>` at app root. |
| **`SDropdownMenu` — items prop** | Expects an `items` array of `{ label, value, danger?, disabled? }` objects, not `options`. Emits `select` with the item's `value` string. |
| **`SCommandPalette` — query ownership** | The palette manages its own internal query state. Sync it via `@update:query` rather than binding `v-model` on an external ref. Results must include `data-index` attributes for keyboard scroll-into-view. |
| **`useToastStack` — no provide/inject** | It is a module-level singleton. Do not wrap it in `provide`; simply call `useToastStack()` in any component. |
| **`useConfirm` — no provide/inject** | Same singleton pattern as `useToastStack`. Call `useConfirm()` anywhere; mount `<SConfirmDialog>` once at root. |
| **`useFocusTrap` — reactive activation** | Takes `(containerRef, activeRef)`. No `.activate()` / `.deactivate()` methods — activation is driven by watching the `activeRef`. |
| **`useTheme` — dark mode class** | Applies `.dark` to `<html>`, not `document.body`. Ensure Tailwind's dark-mode selector matches (it does by default with the library's token setup). |
| **`SSearchInput` — v-model** | Uses `modelValue` + `update:modelValue`. Bind with `v-model` as normal. |
| **`SSegmentedControl` — v-model** | Same `modelValue` + `update:modelValue` pattern. |

---

## 5. Composables Available

All composables are exported from `@stuntrocket/ui`:

```ts
import { useTheme, useToastStack, /* ... */ } from '@stuntrocket/ui'
```

| Composable | Description |
|-----------|-------------|
| `useTheme(storageKey?)` | 3-mode theme cycling (light / dark / system); persists to `localStorage`; applies `.dark` class to `<html>` |
| `useToastStack()` | Module-level singleton toast queue with `success`, `error`, `info`, `warning` helpers and configurable duration |
| `useKeyboardShortcut(key, handler, opts?)` | Global `keydown` listener; ignores editable elements (INPUT, TEXTAREA, SELECT) unless key is Escape; supports `meta` and `shift` modifiers |
| `useFocusTrap(containerRef, activeRef)` | Tab-wrapping within a container; auto-focuses first element on activation; restores previous focus on deactivation |
| `useConfirm()` | Module-level singleton confirmation dialog; returns a `confirm(opts)` Promise that resolves `true` / `false` |
| `useClipboard()` | Copy text to clipboard; tries the Clipboard API then falls back to `execCommand`; provides a `copied` ref for UI feedback (auto-resets after 2 s) |
| `useSearch(items, searchFn, opts?)` | Generic filtered list with optional debounce; includes `highlightMatch` for safe text highlighting without `innerHTML` |
| `usePersistedRef(key, defaultValue)` | `localStorage`-backed reactive ref with JSON serialisation; silently handles unavailable storage |
| `useExternalLink()` | Opens URLs via Tauri's `open_external_url` command with `window.open` fallback for non-Tauri environments |
| `useContextMenu()` | Module-level right-click menu state (`visible`, `position`, `items`) with `open(event, items)` and `close()` |
| `useScrollMemory(router, selector?)` | Route-aware scroll restoration; hooks into `router.beforeEach` / `router.afterEach`; caches up to 100 routes |
| `useResizableSidebar(opts?)` | Drag-to-resize sidebar; persists width to `localStorage`; clamps between `minWidth` and `maxWidth`; smooth updates via `requestAnimationFrame` |
| `useSidebarCollapse(storageKey?)` | Sidebar collapsed/expanded state persisted to `localStorage`; provides `toggle`, `collapse`, `expand` |
| `useRelativeTime(date)` | Reactive relative time string (e.g. "3h ago", "yesterday") with a full ISO date in `full` for tooltip use |
| `useCountUp(target, opts?)` | Animates a numeric `Ref` to a new value using `requestAnimationFrame` with ease-out-cubic (duration configurable) |
| `usePlatform()` | Returns `{ isMac: boolean }` for platform-specific UI decisions |
| `formatShortcut(key, opts?)` | Formats a keyboard shortcut for display using platform-appropriate symbols (⌘ on macOS, Ctrl+ on Windows) |
| `registerKeydownHandler(priority, handler)` | Priority-based global keyboard event registry; higher priority handlers run first; handler returning `true` stops propagation; returns an unregister function |

---

## 6. Priority Migration Order

Work through apps in the following order to achieve the highest impact for the least effort.

### 1. Drift — remove wrapper components (est. half a day)

Drift is 55% migrated but has wrapper components sitting around library components. The work is straightforward deletion: identify where Drift wraps `SButton`, `SModal`, etc. in local components and replace the local wrapper with the library component directly. No API changes expected.

### 2. Amber — swap 3 remaining items (est. 2–3 hours)

Amber is 70% migrated. Three things remain:

- Replace the custom `useFocusTrap` implementation using the recipe in Section 3.
- Replace the custom `SKpiCard` equivalent with the library `SKpiCard`.
- Replace the custom `SPageHeader` equivalent with the library `SPageHeader`.

### 3. Kit — swap 2 base components (est. 1–2 hours)

Kit is 40% migrated. Two library components are already available that cover the remaining custom work:

- `SInlineTextField` — available in the library. Check the `SInlineTextFieldProps` interface for exact prop names before swapping.
- `SRowActionMenu` — available in the library under `overlay/`. It accepts an `items` array (same shape as `SDropdownMenu`).

### 4. Sentinel and Dalīl — swap 3–5 components each (est. half a day each)

Both apps have small numbers of remaining custom components, all of which the library now provides:

**Sentinel**: `SBarChart`, `SHeatmapCalendar`, `SPageHeader`, `SStatusDot`, `SCommandPalette`
**Dalīl**: `SCommandPalette`, `SBreadcrumbs`, `SImageLightbox`

Use the `SCommandPalette` recipe in Section 3. For `SBreadcrumbs`, note that the library type is `BreadcrumbSegment[]` — check `SBreadcrumbsProps` before swapping.

### 5. Fuse — swap 5 components and adopt composables (est. 1–2 days)

Fuse is only 15% migrated. The remaining work covers:

- `SConfirmDialog` + `useConfirm` (Section 3 recipe)
- `SCommandPalette` (Section 3 recipe)
- `SToastContainer` + `useToastStack` (Section 3 recipe)
- `SResizableSplit` — the library provides this as `SResizableSplit` under `layout/`
- `SRouteProgressBar` — available in `feedback/`; wires up to Vue Router automatically

### 6. Grove — full migration (est. 3–5 days)

Grove has not yet adopted any library components. With 21 UI components to replace, begin by establishing the CSS imports and `SThemeProvider` wrapper, then work through components in dependency order: tokens and typography first, then controls, then display components, and finally overlays and composables.

Start with the highest-frequency components (buttons, inputs, badges) to see immediate wins and catch any integration issues early.

---

## 7. Tauri Integration Troubleshooting

This section documents every CSS and tooling issue encountered during the Amber app migration, along with the root cause and fix for each. If visual output looks wrong after a first-time integration, work through these issues in order — they tend to compound.

### Recommended CSS import order

This is the canonical structure for any Tauri app consuming `@stuntrocket/ui`. The sections below explain why each part is required.

```css
/* src/style.css */

@import "tailwindcss";
@import "@stuntrocket/ui/tokens.css";
@import "@stuntrocket/ui/base.css";
@import "@stuntrocket/ui/scrollbar.css";
@import "@stuntrocket/ui/ambient.css";

/* Tell Tailwind to scan the app source AND the library's compiled JS
   so that utility classes used inside component bundles are generated. */
@source "../";
@source "../../node_modules/@stuntrocket/ui";

@theme {
  /* Per-app accent override */
  --color-accent: #F59E0B;
  --color-accent-hover: #D97706;

  /* Alpha tokens — defined in :root in tokens.css but NOT in @theme.
     Register them here so Tailwind generates utility classes for them.
     Dark-mode overrides from the library's .dark block apply at runtime. */
  --color-border-subtle: rgba(0, 0, 0, 0.08);
  --color-border-default: rgba(0, 0, 0, 0.12);
  --color-border-strong: rgba(0, 0, 0, 0.18);
  --color-surface-hover: rgba(0, 0, 0, 0.04);
  --color-surface-selected: rgba(100, 120, 140, 0.10);
  --color-surface-selected-strong: rgba(100, 120, 140, 0.16);
  --color-accent-subtle: rgba(245, 158, 11, 0.1);
  --color-success-subtle: rgba(90, 154, 107, 0.10);
  --color-warning-subtle: rgba(196, 148, 50, 0.10);
  --color-danger-subtle: rgba(196, 84, 84, 0.10);
  --color-info-subtle: rgba(59, 130, 246, 0.10);
}

/* SSelect width fix */
.ui-select {
  width: 100%;
}

/* card-glass — either import style.css (see Issue 4) or define locally */
.card-glass {
  background: color-mix(in srgb, #0e0e0e 42%, transparent);
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid color-mix(in srgb, white 4%, transparent);
  box-shadow: inset 0 1px 0 color-mix(in srgb, white 4%, transparent);
  border-radius: var(--radius-xl, 12px);
}

/* App-specific styles below.
   Keep layout/positioning properties (position, z-index, top, etc.) in
   Tailwind utility classes, NOT in plain CSS classes. See Issue 5. */
```

---

### Issue 1: Missing utility classes — Tailwind v4 `@source` directive

**Symptom**

Elements render with `border: 1px solid` but no colour, causing borders to fall back to `currentColor`. In dark mode, where text is near-white, this produces stark white borders instead of subtle dark ones. Surfaces using classes like `bg-surface/50` or `bg-surface-secondary/28` may appear unstyled.

**Why it happens**

Tailwind v4 generates utility classes by scanning source files for class name strings. By default, it scans the app's own source tree but does **not** scan `node_modules`. `@stuntrocket/ui` ships compiled JavaScript bundles, and those bundles contain Tailwind class strings (e.g. `border-border/60`, `bg-surface/50`). Because Tailwind never sees these strings, it never generates the corresponding CSS rules. The class exists in the DOM but has no matching declaration.

**Fix**

Add two `@source` directives in your app's main CSS file — one for the app itself and one pointing to the library:

```css
@source "../";
@source "../../node_modules/@stuntrocket/ui";
```

The paths are relative to the CSS file. Adjust the depth (`../../`) to match where your `style.css` lives relative to `node_modules`. If your CSS file is at `src/style.css` and `node_modules` is at the project root, the paths above are correct.

---

### Issue 2: Alpha tokens not generating utility classes

**Symptom**

Classes like `border-border-subtle`, `border-border-strong`, `bg-surface-hover`, and `bg-accent-subtle` do not exist in the compiled CSS output, even though the underlying CSS variables resolve correctly at runtime. Dividers, table borders, interactive row highlights, and status badge backgrounds appear invisible or fall back to incorrect colours.

**Why it happens**

`tokens.css` defines the alpha tokens (semi-transparent borders, surface states, status subtles) in `:root` (light-mode defaults) and `.dark` (dark-mode overrides). Neither of these is inside `@theme`. In Tailwind v4, **only variables registered inside `@theme` are made available as utility class generators**. A CSS variable in `:root` is perfectly usable in hand-written CSS (e.g. `border-color: var(--color-border-subtle)`) but Tailwind has no knowledge of it and generates no utility class.

This is not a bug in the library — it is an intentional Tailwind v4 design. It is, however, an oversight in `tokens.css` that should be corrected in a future release (see [Known Library Issues](#known-library-issues) below).

**Fix**

Register the alpha tokens in your app's `@theme` block with their **light-mode** values. The dark-mode overrides from the library's `.dark` block still apply at runtime via the cascade, so you do not need to duplicate those.

```css
@theme {
  --color-border-subtle: rgba(0, 0, 0, 0.08);
  --color-border-default: rgba(0, 0, 0, 0.12);
  --color-border-strong: rgba(0, 0, 0, 0.18);
  --color-surface-hover: rgba(0, 0, 0, 0.04);
  --color-surface-selected: rgba(100, 120, 140, 0.10);
  --color-surface-selected-strong: rgba(100, 120, 140, 0.16);
  --color-accent-subtle: rgba(245, 158, 11, 0.1);   /* adjust to match your accent */
  --color-success-subtle: rgba(90, 154, 107, 0.10);
  --color-warning-subtle: rgba(196, 148, 50, 0.10);
  --color-danger-subtle: rgba(196, 84, 84, 0.10);
  --color-info-subtle: rgba(59, 130, 246, 0.10);
}
```

Note that `--color-accent-subtle` is an alpha blend of your accent colour. If you have overridden the accent (e.g. to amber), update this value to match — the library's default uses blue.

---

### Issue 3: `SSelect` overflows its container

**Symptom**

When `SSelect` is placed alongside other form controls in a flex or grid layout, the select element takes its intrinsic width (driven by the longest option text) rather than filling its container. It overflows its cell and overlaps adjacent elements.

**Why it happens**

The `SSelect` component applies the `.ui-select` CSS class to a native `<select>` element. The `.ui-select` rule in `tokens.css` sets appearance, height, padding, colours, and the custom chevron arrow — but does not set `width`. Native `<select>` elements have `width: auto` by default, meaning they size to their content.

`SInput`, by contrast, includes `w-full` in its Tailwind class list and always fills its container. The two components are inconsistent in this regard.

**Fix**

Add a global override in your app's CSS:

```css
.ui-select {
  width: 100%;
}
```

This is safe to apply globally — a full-width select is correct in virtually every layout context. Place this after your library imports so it takes precedence without needing `!important`.

---

### Issue 4: Component CSS (`card-glass`, etc.) not loaded

**Symptom**

`SCard` with `variant="glass"` renders with the correct class names in the DOM (`card-glass`, `card-glass-interactive`) but appears completely unstyled — no background blur, no border, no shadow. The card is invisible against the app background.

**Why it happens**

Component-specific CSS classes are defined in `<style>` blocks inside Vue SFCs (e.g. `SCard.vue`). During the library build, these compile into `dist/index.css`, exported as `./style.css`. The individual standalone files (`tokens.css`, `base.css`, `scrollbar.css`, `ambient.css`) do **not** include component styles.

Most apps import only those standalone files and therefore never load the component CSS. There is no runtime error — the classes simply do not exist in the page.

**Fix — Option A: Import the library's compiled component CSS**

```css
@import "@stuntrocket/ui/style.css";
```

This is the simplest approach and ensures you pick up updates automatically when the library ships new component styles.

**Caveat:** `style.css` is unlayered CSS (not wrapped in `@layer`). In Tailwind v4, unlayered CSS wins the cascade over `@layer utilities` unconditionally. If any class in `style.css` sets layout properties (`position`, `z-index`, etc.), those may silently override Tailwind utilities on the same element. See Issue 5.

**Fix — Option B: Define component styles locally**

Copy the relevant class definitions into your app's CSS for full control over layer ordering:

```css
.card-glass {
  background: color-mix(in srgb, #0e0e0e 42%, transparent);
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid color-mix(in srgb, white 4%, transparent);
  box-shadow: inset 0 1px 0 color-mix(in srgb, white 4%, transparent);
  border-radius: var(--radius-xl, 12px);
}

.card-glass-interactive {
  cursor: pointer;
  transition: background 180ms ease, box-shadow 180ms ease;
}

.card-glass-interactive:hover {
  background: color-mix(in srgb, #0e0e0e 36%, transparent);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, white 6%, transparent),
    0 4px 16px rgba(0, 0, 0, 0.3);
}
```

This gives full control but requires manual updates when the library changes these definitions.

---

### Issue 5: CSS layer ordering — Tailwind utilities silently overridden

**Symptom**

Tailwind utility classes appear to have no effect. For example, setting `z-20` or `top-4` on an element produces no visual change, even after confirming the classes are present in the DOM. Modifying Tailwind utility classes in the template is entirely ignored.

**Why it happens**

Tailwind v4 places all utility classes inside `@layer utilities`. The CSS cascade rule for layers is absolute:

> Unlayered CSS always wins over layered CSS, regardless of specificity or source order.

Any CSS class defined outside a `@layer` block — including plain `.page-header { ... }` rules in your app's stylesheet — has **unconditional cascade priority** over everything Tailwind generates. If your `.page-header` class sets `position: sticky; top: 0; z-index: 50;`, those declarations will beat `z-20` and `top-4` applied to the same element via Tailwind utilities, even if the utilities appear later in the file.

The conflict is completely silent. The browser applies the unlayered rule and ignores the layered one without any warning or error.

**Fix**

Adopt a clear discipline about what belongs in plain CSS classes versus Tailwind utilities:

- **Plain CSS classes** — visual styling only: `background`, `border`, `box-shadow`, `backdrop-filter`, `opacity`, `transition`.
- **Tailwind utilities** — all layout and positioning: `position`, `top`, `right`, `bottom`, `left`, `z-index`, `display`, `flex`, `grid`, `width`, `height`, `overflow`, `padding`, `margin`.

If a plain CSS class must set a layout property for a specific reason, remove the conflicting Tailwind utility from the template — do not try to make both coexist on the same element.

Alternatively, wrap app-specific CSS classes in a named layer below `utilities`:

```css
@layer components {
  .page-header {
    /* layout properties here are now safely layered below utilities */
    position: sticky;
    top: 0;
  }
}
```

In Tailwind v4's layer order, `@layer components` sits below `@layer utilities`, so Tailwind utilities correctly override component styles when both are present.

---

### Issue 6: Vite dependency caching after local package updates

**Symptom**

After updating `@stuntrocket/ui` locally (e.g. via `npm install /path/to/stuntrocket-ui`), changes to the library — updated props, changed component templates, fixed CSS — do not appear in the running app, even after confirming the updated files are on disk in `node_modules`.

**Why it happens**

Vite pre-bundles dependencies at startup and caches the result in `node_modules/.vite`. This significantly speeds up subsequent dev server starts. However, Vite's cache invalidation heuristics do not always detect updates made via local path installs — it may compare file timestamps or package version strings and incorrectly conclude nothing has changed.

The result is that Vite continues serving the old pre-bundled version of `@stuntrocket/ui` for the entire session, ignoring the updated files on disk.

**Fix**

Clear Vite's dependency cache and restart the dev server:

```bash
rm -rf node_modules/.vite
npm run tauri dev
```

Do this any time local library changes are not appearing in the app. If you are iterating rapidly on the library alongside a consuming app, add a convenience script:

```json
{
  "scripts": {
    "dev:fresh": "rm -rf node_modules/.vite && npm run tauri dev"
  }
}
```

Note: this only affects the local dev server. Production builds (`npm run tauri build`) always bundle fresh and are not affected by the `.vite` cache.

---

### Known library issues

The issues below were worked around in the consuming app (Amber) but the correct long-term fix belongs in the library itself.

| # | Issue | File | Recommended fix |
|---|-------|------|-----------------|
| 1 | Alpha tokens (`--color-border-subtle`, `--color-surface-hover`, `--color-success-subtle`, etc.) are defined in `:root` and `.dark` but not in `@theme` | `src/css/tokens.css` | Move all alpha token declarations into the `@theme` block alongside the other colour tokens, so Tailwind generates utility classes automatically. |
| 2 | `.ui-select` has no `width` declaration | `src/css/tokens.css` | Add `width: 100%` to the `.ui-select` rule, matching the behaviour of `SInput`. |
| 3 | Component CSS (`card-glass`, etc.) is not co-exported with the individual CSS files | Build config / `package.json` exports | Either inline critical component styles into `base.css`, or document clearly that `style.css` must also be imported and note the layer-ordering implications. |

---

## Appendix: Import Reference

```ts
// Components — import by name from the package root
import {
  SButton, SInput, STextarea, SSelect, SCheckbox, SToggle,
  SSearchInput, SSegmentedControl, SFormField, SIconButton,
  SInlineTextField, SViewToggle, SSearchFilterBar,
  SCard, SBadge, STag, SStatusDot, SKbd, SListRow,
  SSectionHeader, SHeading, SText, SProse, SDivider,
  SAvatar, SSparkline, SScoreBar, SKpiCard, SBarChart, SHeatmapCalendar,
  SToast, SSkeleton, SSkeletonText, SSpinner,
  SEmptyState, SNoticeBanner, SProgressBar, SToastContainer, SRouteProgressBar,
  SSidebarLink, SBreadcrumbs, SBackToTop,
  SModal, SConfirmDialog, SCommandPalette, SDropdownMenu,
  STooltip, SKeyboardShortcuts, SRowActionMenu, SPanel, SImageLightbox,
  SAmbientBlobs, STopbar, SSidebar, SThemeProvider,
  SResizableSplit, SPageHeader, SAppShell,
} from '@stuntrocket/ui'

// Composables
import {
  useTheme, useToastStack, useKeyboardShortcut, useFocusTrap,
  useConfirm, useClipboard, useSearch, usePersistedRef,
  useExternalLink, useContextMenu, useScrollMemory,
  useResizableSidebar, useSidebarCollapse,
  useRelativeTime, formatRelativeTime,
  useCountUp, usePlatform, formatShortcut,
  registerKeydownHandler,
} from '@stuntrocket/ui'

// Types
import type {
  SButtonProps, SModalProps, SDropdownMenuItem, SDropdownMenuProps,
  SConfirmDialogProps, SCommandPaletteProps, BreadcrumbSegment,
  Toast, ThemeMode, UseThemeReturn, UseToastStackReturn,
  ConfirmOptions, UseConfirmReturn, ContextMenuItem,
  KeyboardShortcutOptions, SearchHighlight,
  UseResizableSidebarOptions,
} from '@stuntrocket/ui'
```
