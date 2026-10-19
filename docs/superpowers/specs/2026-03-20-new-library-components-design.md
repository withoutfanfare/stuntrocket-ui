# New Library Components — Design Spec

**Date:** 2026-03-20
**Goal:** Add 9 new components to @stuntrocket/ui, extracted from existing Tauri apps and adapted to library conventions.
**Approach:** Extract best existing implementation, adapt styling from scoped CSS/CVA to Tailwind utility classes, standardise API to match library patterns.

---

## 1. Components Overview

### 1.1 SInlineTextField (`controls/SInlineTextField.vue`)

**Source:** Kit — `src/components/base/InlineTextField.vue`
**Purpose:** Click-to-edit inline text field with enter-to-save, escape-to-revert, blur-to-save behaviour.

**Props:**
```typescript
interface SInlineTextFieldProps {
  modelValue: string
  placeholder?: string
  error?: string
  disabled?: boolean
}
```

**Emits:** `update:modelValue`

**Behaviour:** Displays text as a static span. Clicking enters edit mode with an input (unless disabled). Enter or blur saves; Escape reverts. Error state shown below when provided. Disabled state prevents entering edit mode.

**Adaptation:** Replace scoped CSS with Tailwind. Use library colour tokens (`text-text-primary`, `border-accent`, `text-danger`).

---

### 1.2 SViewToggle (`controls/SViewToggle.vue`)

**Source:** Quirk — `src/components/ui/ViewToggle.vue`
**Purpose:** Two-or-more-button toggle for switching between display modes (e.g. grid/list).

**Props:**
```typescript
interface SViewToggleProps {
  modelValue: string
  options: { value: string; label: string }[]
}
```

**Emits:** `update:modelValue`

**Slots:** Scoped slot `option` receives `{ option, active }` — consumers render their own icon/label content per option. Falls back to `option.label` text if the scoped slot is not used.

**Adaptation:** No icon dependency. The scoped slot pattern lets consumers use Lucide, Heroicons, SVGs, or plain text. Tailwind for active/inactive states with accent colour.

---

### 1.3 SSearchFilterBar (`controls/SSearchFilterBar.vue`)

**Source:** Quirk — `src/components/ui/SearchFilterBar.vue`
**Purpose:** Combined search input with optional filter tabs.

**Props:**
```typescript
interface SSearchFilterBarProps {
  modelValue?: string
  filters?: { label: string; value: string }[]
  activeFilter?: string
  placeholder?: string
}
```

**Emits:** `update:modelValue`, `update:activeFilter`

**Behaviour:** Emits raw input events immediately (no built-in debounce — consumers handle debouncing if needed, consistent with SSearchInput behaviour). Filter tabs displayed inline. Default slot for additional controls on the right.

**Adaptation:** Remove CVA dependency. Use SSearchInput internally for the search portion. Tailwind for filter tab states.

---

### 1.4 SScoreBar (`display/SScoreBar.vue`)

**Source:** Quirk — `src/components/ui/ScoreBar.vue`
**Purpose:** Horizontal score/progress bar with threshold-based colouring (high/medium/low).

**Props:**
```typescript
interface SScoreBarProps {
  value: number          // 0–1
  label?: string
  showValue?: boolean
  size?: 'sm' | 'md'    // sm = h-1.5, md = h-2 (default)
}
```

**Behaviour:** Value clamped to 0–1. Fill colour changes based on score: >= 0.7 success (green), >= 0.4 warning (amber), < 0.4 danger (red). Optional percentage label. Size controlled via constrained variant (consistent with library pattern), not arbitrary Tailwind classes.

**Adaptation:** Use library colour tokens (`bg-success`, `bg-warning`, `bg-danger`). Smooth width transition via `transition-[width]`.

---

### 1.5 SCodeEditor (`display/SCodeEditor.vue`)

**Source:** Grove — `src/components/CodeEditor.vue`
**Purpose:** Code display shell with line numbers, monospace styling, and scrolling. Read-only by default.

**Props:**
```typescript
interface SCodeEditorProps {
  code: string            // raw code string for display and line numbering
  lineNumbers?: boolean   // default true
  maxHeight?: string      // CSS value, e.g. '400px'
}
```

**Slots:**
- Default slot receives `{ code, lines }` — consumers can render highlighted HTML (via Shiki/Prism) or fall back to plain `<pre>` text. If the slot is not used, the component renders `code` as plain monospace text.

**No v-model, no editing.** This is a display component. Editing is out of scope — consumers needing editable code should use a textarea or a dedicated editor library. This keeps SCodeEditor in the `display/` category and avoids bundling highlighting dependencies.

**Adaptation:** Extract the shell (line numbers, scroll container, font styling) from Grove's implementation. No Shiki/Prism dependency in the library.

---

### 1.6 SRouteProgressBar (`feedback/SRouteProgressBar.vue`)

**Source:** Fuse — `src/components/RouteProgressBar.vue`
**Purpose:** Thin progress bar at the top of the page indicating route transition loading.

**Props:**
```typescript
interface SRouteProgressBarProps {
  loading?: boolean
  color?: string          // CSS colour value, defaults to accent
}
```

**Behaviour:** When `loading` is true, shows a thin animated bar at the top of the viewport. Animates from 0% to ~80%, then completes to 100% when loading becomes false.

**Adaptation:** Scoped CSS animation → Tailwind + CSS keyframes in a `<style>` block. Fixed positioning with z-50.

---

### 1.7 SResizableSplit (`layout/SResizableSplit.vue`)

**Source:** Fuse — `src/components/ResizableSplit.vue`
**Purpose:** Two-pane layout with a draggable divider. Supports horizontal and vertical orientation.

**Props:**
```typescript
interface SResizableSplitProps {
  direction?: 'horizontal' | 'vertical'
  initialSize?: number    // percentage for first pane, default 50
  minSize?: number        // minimum percentage, default 20
  maxSize?: number        // maximum percentage, default 80
  storageKey?: string     // localStorage key for persistence
}
```

**Slots:** `first`, `second` (the two panes)

**Behaviour:** Drag the divider to resize. Double-click to reset to `initialSize`. Size persisted to localStorage when `storageKey` provided. Cursor changes on hover/drag. localStorage access guarded with try/catch for test environments and contexts where storage is unavailable.

**Note:** The existing `useResizableSidebar` composable in the library handles sidebar-specific resize logic with collapse behaviour. `SResizableSplit` is a more general two-pane splitter without collapse semantics — they serve different purposes and do not overlap.

**Adaptation:** Scoped CSS → Tailwind. Use library border/surface tokens for the divider.

---

### 1.8 SKeyboardShortcuts (`overlay/SKeyboardShortcuts.vue`)

**Source:** Quirk — `src/components/ui/KeyboardShortcutsModal.vue`
**Purpose:** Modal overlay displaying grouped keyboard shortcuts.

**Props:**
```typescript
interface ShortcutGroup {
  title: string
  shortcuts: { keys: string; description: string }[]
}

interface SKeyboardShortcutsProps {
  open?: boolean
  groups: ShortcutGroup[]
}
```

**Emits:** `close`

**Behaviour:** Uses SModal internally — Escape handling delegated to SModal (no duplicate listener). Grouped shortcut listings rendered in columns. Uses SKbd internally for key display.

**Adaptation:** Remove hardcoded shortcut data — fully data-driven via `groups` prop.

---

### 1.9 SRowActionMenu (`overlay/SRowActionMenu.vue`)

**Source:** Kit — `src/components/base/RowActionMenu.vue`
**Purpose:** Ellipsis-button-triggered dropdown menu for row-level actions.

**Props:**
```typescript
interface SRowActionMenuProps {
  actions: { label: string; value: string; danger?: boolean; disabled?: boolean }[]
  align?: 'left' | 'right'
}
```

**Emits:** `select: [value: string]`

**Behaviour:** Renders a vertical ellipsis button. Clicking opens a positioned dropdown with action items. Click-outside to close. Danger actions styled in red. Disabled actions greyed out and non-interactive. Follows the same value-emitting pattern as SDropdownMenu — consumers handle the action in the `@select` handler rather than passing callback functions.

**Adaptation:** Wraps SDropdownMenu internally with a pre-built ellipsis trigger button. Consistent event-driven API (no callback functions on props).

---

## 2. Build Order

Phase 1 — Simple controls (no dependencies on other new components):
1. SInlineTextField
2. SViewToggle
3. SScoreBar

Phase 2 — Composite controls:
4. SSearchFilterBar (uses SSearchInput internally)
5. SRowActionMenu (wraps SDropdownMenu internally)

Phase 3 — Layout and feedback:
6. SResizableSplit
7. SRouteProgressBar

Phase 4 — Overlays:
8. SKeyboardShortcuts (uses SModal + SKbd internally)

Phase 5 — Display (last due to slot-based API complexity, not dependency):
9. SCodeEditor

---

## 3. Integration

- All components exported from `src/index.ts`
- All prop interfaces exported for consumer type safety
- No new npm dependencies added to the library (Shiki/Prism left to consumers)
- Follows existing conventions: `S`-prefix naming, Tailwind utility classes, `<script setup>` with TypeScript, exported prop interfaces

---

## 4. Second-Wave Cleanup (Future)

After these components are added, several apps still use custom implementations of components that already exist in stuntrocket-ui:
- CommandPalette (Sentinel, Dalil, Fuse, Quirk, Grove)
- ToastContainer (Sentinel, Fuse, Quirk)
- ConfirmDialog (Fuse, Quirk, Grove)
- DropdownMenu (Quirk, Grove)

These can be replaced in a follow-up migration pass once the new components are stable.
