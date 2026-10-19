# Changelog

## 0.9.3 — 6 August 2026

### Fixed
- `tokens.css`: dark mode lost every alpha border, hover surface, selected surface, scrollbar colour, status subtle and shadow. The light-mode `:root` block was declared *after* the `.dark` block; both are specificity (0,1,0), so source order won and the light values silently replaced the dark ones — `--color-border-subtle` resolved to `rgba(0, 0, 0, 0.08)` on a `#171717` surface, i.e. invisible. Consuming apps saw panels, cards and list rows lose their edges and stop responding to hover, while surface, text and accent colours still looked correct. The light-mode block now precedes `.dark`; no token values change, only the order of the two blocks.

## Unreleased

### Breaking changes (peer dependency)
- Bumped `vue` peer dependency to `^3.5.0` (was `^3.4.0`). Vue 3.5 ships `useId()`, which the library now uses across form controls and overlay components for stable SSR-safe DOM ids. Upgrade with `npm install vue@^3.5.0` in consuming apps.

### Added
- `useConfirm().handleDismiss()` — resolves a pending confirmation as `false`; call from Escape or backdrop-click handlers.
- `useScrollMemory().dispose()` — removes router hooks (previously stacked on HMR/re-mount).
- `usePersistedRef(key, defaultValue, options?)` — new optional `validate` callback for shape-checking deserialised storage values.
- `SModal` `role` prop (`'dialog' | 'alertdialog'`); `SConfirmDialog` now renders `role="alertdialog"`.
- `SDataTable` is generic: `SDataTableProps<T>` with `rows: T[]` (was `any[]`).
- `SDataTable` `rowKey?: (row, index) => string | number` prop for stable selection identity.
- `SDataTable` `select` emit payload enriched to `[row, selected: boolean]`; `selectAll` payload is now `[selected: T[]]`. Old consumers ignoring the new args still compile.
- `SHeatmapCalendar` `today?: Date` prop (useful for tests; default `new Date()`).
- `SButton` renders a real `<button disabled>` (with `aria-disabled`) when `to` is set and `disabled` or `loading` is true — `<a>` ignores the `disabled` attribute so the old behaviour left links clickable mid-request.
- `SRowActionMenu` `label` prop (default `"Row actions"`) for accessible-name localisation.
- `SSearchInput` `label` prop (falls back to placeholder) and a `clear` button that restores focus after clearing.
- `SCheckbox` / `SToggle` associate the visible text via `<label for>` and include the description in the accessible name.
- `SThemeProvider.useProvidedTheme()` throws a helpful error when called outside a provider instead of returning `undefined`.
- New `src/css/components.css` export (topbar primitives, `.ui-select`, prose dark mode, keyframes).
- `package.json` now exports `./components.css`, has a `prepublishOnly` script, and includes a `default` export condition for CJS-interop.
- `SAmbientBlobsProps` is now exported from the package barrel.

### Fixed (blockers)
- `useConfirm`: resolve any pending confirmation as `false` when a second `confirm()` supersedes it — previously the first Promise was discarded and never settled, leaving `await`-ing callers hung forever.
- `useFocusTrap`: focus now actually moves into overlays when they open. The watcher was running pre-flush before the `v-if` rendered the container, so the trap silently failed. Now uses `flush: 'post'` + `immediate: true` and also watches `containerRef` to cover initial-`open` mounts. Added `onScopeDispose` cleanup. Affects `SModal`, `SDrawer`, `SPanel`, `SWizard`, `SImageLightbox`.
- `SModal`: added focus management, body scroll lock (with `immediate`), document-level Escape listener, and `aria-labelledby`/`aria-describedby` wiring. Previously Escape only worked if a child had focus (which never happened because no focus was moved in). Close button got a `focus-visible` ring. New `role` prop.
- `SPanel`: replaced hardcoded `id="s-panel-title"` with per-instance `useId()` so multiple panels no longer produce duplicate DOM ids. Also tightened scroll-lock watch with `immediate: true`.
- `SCommandPalette`: Escape no longer emits `close` twice (input's `@keydown.escape` was bubbling to the overlay's `@keydown`). Now also has `role="dialog"`, body scroll lock, and `aria-modal`.
- `SButton`: added `type="button"` so the rendered `<button>` no longer defaults to `type="submit"` inside consumer forms (was causing accidental form submissions across the 9 consuming apps).
- `STooltip`: clear the pending show timer in `onBeforeUnmount` so it can't fire against an unmounted component. Now also shows on keyboard focus (not just hover).
- `SSegmentedControl`: added full WAI-ARIA radiogroup semantics (`role="radiogroup"`/`role="radio"`, `aria-checked`, roving `tabindex`, arrow-key + Home/End navigation, `type="button"`, `focus-visible` ring). Previously screen readers announced it as an unlabelled button list and Tab moved through every option.

### Fixed (composables)
- `useToastStack`: scope-dispose now splices owned toasts out of the shared singleton array — previously cancelled timers left orphaned toasts that rendered forever.
- `useClipboard`: `fallbackCopy` guards `typeof document === 'undefined'` so SSR/workers no longer crash with an uncaught `ReferenceError`.
- `useTheme`: now a module-level singleton (matches `useToastStack`/`useConfirm`/`useContextMenu`); two consumers no longer maintain independent `mode` refs fighting over `.dark` and the same `localStorage` key. Adds SSR-safe `localStorage`/`matchMedia` access.
- `useKeydownDispatcher`: snapshot handlers before dispatch so a handler that unregisters itself mid-event doesn't cause entries to be skipped.
- `useResizableSidebar`: `localStorage` access guarded with try/catch; `resetWidth()` now respects `min`/`max` clamp.
- `formatRelativeTime`: returns `''` for invalid dates (was `"NaN NaN years ago"`). Removed unused `SECOND` constant.
- `useExternalLink`: refuses non-`http(s)` URLs to protect the Tauri bridge from scheme-injection. Uses a string-variable specifier (instead of `Function(...)`) so it's transparent to bundlers and CSP-friendly.

### Fixed (overlays)
- Body scroll-lock `watch` is now `immediate: true` across `SDrawer`, `SPanel`, `SWizard`, `SImageLightbox`, `SCommandPalette` so mounting with `open: true` actually locks.
- `SDrawer` / `SWizard` use `useId()` instead of `Math.random()` for DOM ids.
- `SWizard` ships a single `role="progressbar"` for the whole flow (was one per step, with bogus 0/100 values).
- All overlay close buttons have `focus-visible:ring-*` (previously inconsistent — `SWizard` footer had it, the close buttons didn't).
- `SContextMenu`: Escape now closes; menu is viewport-clamped (was rendering off-screen near right/bottom edges); items use `${label}-${index}` keys so duplicates don't collide; `item.action()` runs in `try/finally` so a throwing action no longer leaves the menu stuck open.
- `SDropdownMenu`: full ARIA menu semantics — `role="menu"` / `role="menuitem"`, focus movement on Arrow/Enter/Home/End (not just a `focusedIndex` CSS class), `focus-visible` ring, root-ref based outside-click detection (was coupled to a CSS class).
- `SImageLightbox`: dialog `aria-label` no longer duplicates the `<img alt>` announcement.
- `STooltip`: shows on focus/blur (not just hover).

### Fixed (forms / a11y)
- `SInput` / `STextarea` / `SSelect`: single-root template (the old fragment pattern unmounted the input when a label/error/hint appeared, losing focus & caret). Each now generates a stable `useId()` and wires `<label for>` + `aria-describedby` + `aria-invalid`. `required` is passed to the native input.
- `SInput` coerces to `Number` when `type="number"` (was emitting the string `'42'`).
- `SViewToggle`: focus-visible ring added; `setButtonRef` typed (no more `any`); Home/End keyboard support.
- `SSearchInput` input has an accessible name (`aria-label` from `label` or placeholder); clear button is labelled and restores focus.

### Fixed (charts / numeric safety)
- `SBarChart`, `SGauge`, `SScoreBar`, `SDistributionChart`, `SSparkline`: filter `NaN`/`Infinity` from source data before computing min/max/range so a single bad value can't produce `points="NaN,NaN"` / `width:"NaN%"` / `stroke-dashoffset="NaN"`. `Math.max(...spread)` replaced with reduce-based loops to avoid stack overflow on very large arrays.
- `SBarChart`: clamps per-bar `height` to ≥ 0 (negative values were rendering empty `rect`s silently).
- `SDistributionChart`: clamps bar percent to ≤ 100; cancels its mount `requestAnimationFrame` on unmount.
- `SProgressBar`: clamps `value` to `[0, 100]` (was producing invalid `width:"NaN%"` / `width:"150%"`).
- `SSparkline`: `role="img"` + dynamic `aria-label` with min/max/avg summary.
- `SRouteProgressBar`: `role="progressbar"` + `aria-valuenow`/`aria-valuetext`.
- `SGauge` `aria-valuetext`: always includes a qualitative level (`good`/`moderate`/`poor`, or `low`/`high` risk when inverted) — not just the percentage.

### Fixed (display / layout)
- `SHeatmapCalendar`: uses local date components (`YYYY-MM-DD`) instead of `toISOString()` (UTC), so users in negative UTC offsets see the correct day highlighted. `new Date()` captured once at setup so it doesn't drift across re-renders.
- `SListRow`: hover state tracked in a reactive ref instead of mutating `$el.style` (the override could be lost mid-hover).
- `SAvatar`: filters empty words for initials (double-spaced names no longer produce `undefined`); `@error` fallback to initials/icon on broken image URLs; default `alt="Avatar"` when name is missing.
- `SHeading`: `tag` is a `computed` (was captured once at setup, so changing `as`/`level` after mount didn't update).
- `SResizableSplit`: divider is now `role="separator"` with `tabindex`, `aria-orientation`/`valuemin`/`valuemax`/`valuenow`, and full keyboard support (Arrow/Home/End/Enter). Touch-drag support added.

### Fixed (token compliance)
- Replaced hardcoded Tailwind palette classes with semantic tokens across `SToast`, `SToastContainer`, `SCard` (glass variant), `STimelineItem`, `SFileTree`, and the ambient CSS blob defaults. Light/dark/accent overrides now flow through correctly.
- `SToastContainer` error toasts use `aria-live="assertive"` (info/warning stay `polite`).
- Ambient blob defaults are now `var(--color-blob-2, #8B5CF6)` / `var(--color-blob-3, #06B6D4)` so apps can override without forking the CSS.

### Changed (architecture)
- **CSS split**: `tokens.css` now contains ONLY design tokens (`@theme`, `.dark` overrides, `:root` custom properties). Sections that previously duplicated `base.css`, `scrollbar.css`, and `ambient.css` have been removed. Component primitives (`.ui-select`, `.topbar-*`, prose dark mode, keyframes) moved to a new `src/css/components.css`. Consumers following the documented import order (tokens → base → scrollbar → ambient) no longer triple-import the same rules. Published `style.css` includes `components.css` automatically via `library.css`.
- `SDataTable` is now generic via `<script setup lang="ts" generic="T">`. Type inference flows through `rows`, `select`, and `selectAll` emits.

### Tests
- `useConfirm`: regression test for the double-`confirm` race condition.
- `SModal`: tests for Escape (document-level), `closable=false` suppression on Escape + overlay click, body scroll lock while open, and scroll restoration on unmount.
- `SInput`: tests for label/id association, aria-describedby wiring, `required` propagation, and number coercion.

## 0.3.0 — 2026-03-20

### Added
- Typography components: SHeading, SText
- Navigation components: SSidebarLink, SBreadcrumbs, SBackToTop
- Display components: SStatusDot, SKbd, SListRow, SSectionHeader, SDivider, SAvatar, SProse
- Control components: SSegmentedControl
- Feedback components: SNoticeBanner, SProgressBar, SToastContainer
- Overlay components: SConfirmDialog, SCommandPalette (with keyboard navigation), SDropdownMenu, STooltip
- Layout components: SSidebar, SThemeProvider
- Composables: useTheme, useToastStack, useKeyboardShortcut, useFocusTrap
- Unified design tokens: semantic status colours, spacing scale, shadow scale, duration/easing tokens, layout dimensions
- Per-app accent colour override support
- Dev showcase app (npm run dev:showcase)

### Changed
- Refined padding, tracking, and leading across all existing components
- SButton: tighter tracking, proper focus ring with offset, active state
- SInput/STextarea: rounded-md, softer focus ring (ring-accent/20)
- SBadge: leading-none, consistent 11px sizing, tabular-nums on count
- SModal: added scale transition on panel
- SToast: glassmorphic backdrop-blur, 13px text

## 0.2.0 — 2026-03-19

### Added
- Initial Tier 2 components (12 new)
- Unified design tokens from merged Dalil + Kit styleguide

## 0.1.0 — 2026-03-19

### Added
- Initial release with 14 components
- Design tokens (light/dark mode)
- CSS modules (tokens, base, scrollbar, ambient)
