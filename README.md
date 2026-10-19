# @stuntrocket/ui

Shared UI component library for Stuntrocket's Tauri desktop application portfolio. Built on Vue 3 and Tailwind CSS v4.

---

## Quick Start

### 1. Registry config

Create or update `.npmrc` in your project root:

```ini
@stuntrocket:registry=http://localhost:4873
```

### 2. Install

```bash
npm install @stuntrocket/ui
```

### 3. CSS imports

Add to your app's main stylesheet, **after** Tailwind imports:

```css
@import 'tailwindcss';
@plugin '@tailwindcss/typography';

@import '@stuntrocket/ui/tokens.css';      /* Design tokens — MUST be first */
@import '@stuntrocket/ui/base.css';        /* Root resets, focus rings, micro-animations */
@import '@stuntrocket/ui/scrollbar.css';   /* Custom scrollbar styling */
@import '@stuntrocket/ui/ambient.css';     /* Optional: ambient background blobs */
@import '@stuntrocket/ui/components.css';  /* Shared primitives: ui-select, topbar, keyframes */
```

Alternatively, import the precompiled bundle:

```css
@import 'tailwindcss';
@import '@stuntrocket/ui/style.css';
```

> **Peer dependency:** Vue 3.5+ is required (uses `useId()` for stable DOM ids across form and overlay components).

### 4. Poppins font

Add to `index.html` `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

### 5. Dark mode

Add an inline script in `<head>` to prevent flash of unstyled content:

```html
<script>
  const t = localStorage.getItem('app-theme-mode')
  if (t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches))
    document.documentElement.classList.add('dark')
</script>
```

Or use `<SThemeProvider>` and `useTheme()` for full light/dark/system cycling.

---

## Components

70 Vue 3 components across 6 categories, plus 17 composables. All use `<script setup lang="ts">` with exported prop interfaces.

### Typography

| Component | Description | Key props |
|-----------|-------------|-----------|
| `SHeading` | Semantic heading (h1--h4) | `level` (1--4), `as` |
| `SText` | Body text with size/colour variants | `size`, `color`, `medium`, `mono`, `leading`, `as` |

`SHeading` levels: 1 = page title (1.95rem), 2 = section (1.25rem), 3 = sub-section (1rem), 4 = label (uppercase, secondary).

`SText` sizes: `body` (15px), `compact` (13px), `small` (12px), `xs` (11px). Colours: `primary`, `secondary`, `tertiary`, `accent`, `success`, `warning`, `danger`.

### Controls

| Component | Description | Key props |
|-----------|-------------|-----------|
| `SButton` | Action button | `variant` (`primary` / `secondary` / `icon`), `size` (`sm` / `md` / `lg`), `loading`, `disabled` |
| `SInput` | Text input with v-model | `modelValue`, `placeholder`, `type`, `disabled` |
| `SSelect` | Native select dropdown | `modelValue`, `size` (`sm` / `md`), `disabled` |
| `STextarea` | Multi-line text input | `modelValue`, `placeholder`, `rows`, `disabled` |
| `SSegmentedControl` | Tab-style toggle | `options` (`{ value, label }[]`), `modelValue` |
| `SSearchInput` | Search field with icon and clear | `modelValue`, `placeholder`, `compact`, `clearable`. Event: `keydown` |
| `SFormField` | Label + error wrapper for inputs | `label`, `error`, `required`, `hint` |

### Display

| Component | Description | Key props |
|-----------|-------------|-----------|
| `SCard` | Container with elevation | `variant` (`content` / `sidebar` / `list` / `nested`), `hoverable` |
| `SBadge` | Inline status indicator | `variant` (`default` / `accent` / `success` / `warning` / `error` / `count`) |
| `STag` | Navigable tag/label | `interactive` |
| `SStatusDot` | Coloured status dot | `variant` (`success` / `warning` / `danger` / `accent` / `neutral`), `size` (`sm` / `md`) |
| `SKbd` | Keyboard shortcut key | Slot only |
| `SListRow` | Interactive list item | `selected`, `disabled`. Slots: `default`, `actions` |
| `SSectionHeader` | Uppercase section label | `title`, `count`, `actionLabel`. Event: `action` |
| `SDivider` | Horizontal/vertical rule | `orientation` (`horizontal` / `vertical`), `subtle` |
| `SAvatar` | User avatar (image or initials) | `name`, `src`, `size` (`sm` / `md` / `lg`), `variant` (`accent` / `neutral`) |
| `SProse` | Rich content wrapper | `animate` |
| `SSparkline` | Inline SVG sparkline chart | `values` (`number[]`), `width`, `height`, `color`, `gradient`, `strokeWidth` |

### Feedback

| Component | Description | Key props |
|-----------|-------------|-----------|
| `SToast` | Notification message | `variant` (`success` / `error` / `info`), `visible`. Event: `dismiss` |
| `SToastContainer` | Auto-positioned toast stack | No props. Uses `useToastStack()` internally |
| `SSkeleton` | Loading placeholder bar | `width`, `height` |
| `SSpinner` | Animated loading spinner | `size` (`sm` / `md` / `lg`) |
| `SEmptyState` | Empty content placeholder | `title`, `description`. Slots: `icon`, `action` |
| `SNoticeBanner` | Dismissible alert banner | `variant` (`info` / `warning` / `danger`), `dismissible`. Event: `dismiss` |
| `SProgressBar` | Determinate/indeterminate bar | `value` (0--100), `variant` (`accent` / `success` / `warning` / `danger`), `size`, `indeterminate` |

### Navigation

| Component | Description | Key props |
|-----------|-------------|-----------|
| `SSidebarLink` | Sidebar navigation item | `active`, `level` (indentation depth), `updated` |
| `SBreadcrumbs` | Breadcrumb trail | `segments` (`{ label, to? }[]`). Event: `navigate` |
| `SBackToTop` | Floating scroll-to-top button | `visible`. Event: `click` |

### Overlay

| Component | Description | Key props |
|-----------|-------------|-----------|
| `SModal` | Dialog overlay | `open`, `maxWidth`. Slots: `header`, `default`, `footer`. Event: `close` |
| `SConfirmDialog` | Confirmation modal | `open`, `title`, `message`, `confirmLabel`, `cancelLabel`, `danger`. Events: `confirm`, `cancel`, `close` |
| `SCommandPalette` | Spotlight-style search | `open`, `placeholder`, `resultCount`. Events: `close`, `update:query`, `select`. Slots: `actions`, `default` |
| `SDropdownMenu` | Context/action menu | `items` (`{ label, value, danger?, disabled? }[]`), `align`. Slot: `trigger`. Event: `select` |
| `STooltip` | Hover tooltip | `text`, `position` (`top` / `bottom`), `delay` |

### Layout

| Component | Description | Key props |
|-----------|-------------|-----------|
| `SAmbientBlobs` | Decorative gradient background | No props |
| `STopbar` | Fixed application titlebar | `trafficLightPadding`. Slots: `left`, `centre`, `right` |
| `SSidebar` | Application sidebar shell | `width`. Slots: `header`, `default`, `footer` |
| `SThemeProvider` | Theme context provider | `accent`, `accentHover`, `storageKey` |

---

## Composables

| Composable | Description | Returns |
|------------|-------------|---------|
| `useTheme(storageKey?)` | Light/dark/system theme cycling with localStorage persistence | `{ mode, isDark, toggle, setMode }` |
| `useToastStack()` | Singleton toast notification stack | `{ toasts, addToast, removeToast, success, error, info, warning }` |
| `useKeyboardShortcut(key, handler, opts?)` | Register global keyboard shortcuts with modifier support | `{ unregister }` |
| `useFocusTrap(containerRef, active)` | Trap tab focus within a container, restore on release | `void` |
| `useRelativeTime(date, interval?)` | Reactive relative timestamps ("2h ago", "yesterday") | `{ relative, full }` |
| `formatRelativeTime(date)` | Standalone relative time formatter | `string` |
| `useClipboard()` | Copy to clipboard with success feedback | `{ copy, copied }` |
| `useSearch(items, searchFn, opts?)` | Generic filtered search with match highlighting | `{ query, filtered, clearQuery, highlightMatch }` |
| `useResizableSidebar(opts?)` | Drag-to-resize sidebar with persistence | `{ width, isResizing, startResize, resetWidth }` |
| `useSidebarCollapse(storageKey?)` | Toggle sidebar collapsed state with persistence | `{ collapsed, toggle, collapse, expand }` |
| `useConfirm()` | Awaitable confirmation dialog (singleton) | `{ isOpen, options, confirm, handleConfirm, handleCancel }` |
| `useCountUp(target, opts?)` | Animated number counter | `{ displayValue }` |
| `usePlatform()` | Detect macOS for platform-specific UI | `{ isMac }` |
| `formatShortcut(key, opts?)` | Format keyboard shortcut with platform symbols | `string` |

### useToastStack example

```ts
import { useToastStack, SToastContainer } from '@stuntrocket/ui'

const { addToast } = useToastStack()
addToast('Changes saved', 'success')
addToast('Something went wrong', 'error', 6000)
```

Place `<SToastContainer />` once in your app layout.

---

## Per-app accent override

Each consuming app can override the default blue accent colour via `<SThemeProvider>`:

```vue
<script setup lang="ts">
import { SThemeProvider } from '@stuntrocket/ui'
</script>

<template>
  <SThemeProvider accent="#7C3AED">
    <RouterView />
  </SThemeProvider>
</template>
```

This sets `--color-accent`, `--color-accent-hover`, and `--color-accent-subtle` on `<html>`, automatically deriving hover and subtle variants from the provided colour.

---

## CSS Modules

Import order matters -- tokens first, then the rest.

| Module | Path | Purpose |
|--------|------|---------|
| `tokens.css` | `@stuntrocket/ui/tokens.css` | Design tokens via `@theme` -- colours, typography, spacing, shadows, status colours. Light and dark mode values |
| `base.css` | `@stuntrocket/ui/base.css` | Resets, focus-visible rings, cursor affordances, selection rules, micro-animations, reduced motion |
| `scrollbar.css` | `@stuntrocket/ui/scrollbar.css` | Accent-tinted custom scrollbars (WebKit + Firefox) |
| `ambient.css` | `@stuntrocket/ui/ambient.css` | Floating gradient blob animations. Pair with `<SAmbientBlobs />` |

---

## Design tokens reference

Full specification in [`docs/STYLEGUIDE.md`](docs/STYLEGUIDE.md) and [`docs/COLOUR_SWATCHES.md`](docs/COLOUR_SWATCHES.md).

Key token families:

- **Surfaces**: `--color-surface`, `--color-surface-secondary`, `--color-sidebar`, `--color-surface-hover`, `--color-surface-selected`
- **Text**: `--color-text-primary`, `--color-text-secondary`, `--color-text-tertiary`
- **Borders**: `--color-border`, `--color-border-subtle`
- **Status**: `--color-success`, `--color-warning`, `--color-danger` (plus `-subtle` variants)
- **Accent**: `--color-accent`, `--color-accent-hover`, `--color-accent-subtle`
- **Typography**: `--font-sans` (Poppins stack), `--font-mono` (SF Mono/Fira Code stack). Root 15px/1.6
- **Shadows**: `--shadow-card`, `--shadow-sidebar`, `--shadow-modal`

---

## Development

```bash
npm install                # Install dependencies
npm run dev:showcase       # Launch interactive component showcase (Vite dev server)
npm run build              # Type-check + production build
npm run typecheck          # Type-check only
npm run dev                # Build with file watching
```

### Publishing

1. Update version in `package.json`
2. `npm run build`
3. `npm publish` (publishes to local Verdaccio at `http://localhost:4873`)

---

## Consuming applications

| App | Stack | Notes |
|-----|-------|-------|
| Amber | Vanilla TS | May need Vue migration or CSS-only layer |
| Clio | Vue 3 + Tailwind | Straightforward adoption |
| Dalil | Vue 3 + Tailwind v4 | Reference app -- source of component extraction |
| Drift | Vue 3 + Tailwind | Replacing Spool design system |
| Fuse | Vue 3 + CSS custom props | Needs Tailwind v4 migration |
| Grove | Vue 3 + Tailwind | Well-aligned, early adopter candidate |
| Kit | Vue 3 + Tailwind | Needs prefers-color-scheme to .dark migration |
| Quirk | Vue 3 + Tailwind v4 | Needs data-theme to .dark migration |
| Sentinel | Vue 3 + Tailwind v4 (bun) | Verify bun compatibility |

---

## Licence

UNLICENSED -- private package for internal use.
