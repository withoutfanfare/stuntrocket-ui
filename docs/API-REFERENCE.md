# @stuntrocket/ui — API Reference

Component library for Stuntrocket Tauri desktop applications. Vue 3 + Tailwind CSS v4.

## CSS Setup

Import in your app's main stylesheet, in this order:

```css
@import 'tailwindcss';
@import '@stuntrocket/ui/tokens.css';
@import '@stuntrocket/ui/base.css';
@import '@stuntrocket/ui/scrollbar.css';
@import '@stuntrocket/ui/ambient.css';
```

---

## Controls

### SButton

Renders a `<button>` or `<RouterLink>` depending on whether `to` is provided.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'danger' \| 'ghost' \| 'icon'` | `'primary'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size (ignored for `icon` variant) |
| `disabled` | `boolean` | `false` | Disabled and non-interactive state |
| `loading` | `boolean` | `false` | Shows a spinner and disables interaction |
| `to` | `string` | — | When provided, renders as a `RouterLink` |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `default` | — | Button label and/or icon content |

---

### SIconButton

An accessible icon-only button with tooltip support. Warns in development when `tooltip` is absent.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'ghost' \| 'secondary' \| 'danger' \| 'success'` | `'ghost'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button dimensions (28 / 32 / 40 px) |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Shows a spinner |
| `active` | `boolean` | `false` | Applies the active/pressed visual state |
| `tooltip` | `string` | — | Used as `title` and `aria-label` |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | `MouseEvent` | Emitted on click (suppressed when disabled or loading) |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `default` | — | SVG icon content (sized automatically) |

---

### SInput

Text input with optional label, hint, and error message.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number` | `''` | Bound value (`v-model`) |
| `type` | `string` | `'text'` | HTML input type |
| `placeholder` | `string` | `''` | Placeholder text |
| `disabled` | `boolean` | `false` | Disabled state |
| `label` | `string` | — | Label rendered above the input |
| `error` | `string` | — | Error message shown below the input (replaces hint) |
| `hint` | `string` | — | Hint text shown below the input |
| `required` | `boolean` | `false` | Appends a red asterisk to the label |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted on every keystroke |

---

### STextarea

Multi-line text input with optional label, hint, and error message.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | Bound value (`v-model`) |
| `placeholder` | `string` | `''` | Placeholder text |
| `rows` | `number` | `4` | Initial row height |
| `disabled` | `boolean` | `false` | Disabled state |
| `label` | `string` | — | Label rendered above the textarea |
| `error` | `string` | — | Error message (replaces hint) |
| `hint` | `string` | — | Hint text shown below |
| `required` | `boolean` | `false` | Appends a red asterisk to the label |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted on every keystroke |

---

### SSelect

Native `<select>` element with optional label, hint, and error.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | Bound value (`v-model`) |
| `size` | `'sm' \| 'md'` | `'md'` | Visual size variant |
| `disabled` | `boolean` | `false` | Disabled state |
| `label` | `string` | — | Label rendered above the select |
| `error` | `string` | — | Error message (replaces hint) |
| `hint` | `string` | — | Hint text shown below |
| `required` | `boolean` | `false` | Appends a red asterisk to the label |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted when selection changes |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `default` | — | `<option>` elements |

---

### SSearchInput

Search input with a leading icon and an optional clear button.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | Bound value (`v-model`) |
| `placeholder` | `string` | `'Search...'` | Placeholder text |
| `compact` | `boolean` | `false` | Reduces height to 28 px and font to 12 px |
| `clearable` | `boolean` | `true` | Shows a clear button when there is a value |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted on every keystroke and on clear |
| `keydown` | `KeyboardEvent` | Forwards native keydown events |

---

### SSearchFilterBar

Combines `SSearchInput` with a group of filter toggle buttons.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | Search query (`v-model`) |
| `filters` | `{ label: string; value: string }[]` | `[]` | Filter options to render as toggles |
| `activeFilter` | `string` | `''` | Currently active filter value (`v-model:activeFilter`) |
| `placeholder` | `string` | `'Search...'` | Search input placeholder |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted when the search query changes |
| `update:activeFilter` | `string` | Emitted when a filter button is clicked |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `default` | — | Additional controls appended after the filter buttons |

---

### SSegmentedControl

Pill-style segmented tab control.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | — | Currently selected value (`v-model`, required) |
| `options` | `{ value: string; label: string }[]` | — | Segment options (required) |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted when a segment is selected |

---

### SViewToggle

Accessible radio-group style toggle with keyboard navigation (arrow keys).

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | — | Currently active value (`v-model`, required) |
| `options` | `{ value: string; label: string }[]` | — | Toggle options (required) |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted when selection changes |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `option` | `{ option: { value, label }, active: boolean }` | Custom option content; falls back to `option.label` |

---

### SFormField

Layout wrapper for form controls, providing a label, hint, and error message without wrapping a specific input type.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Label rendered above the default slot |
| `error` | `string` | — | Error message shown below (replaces hint) |
| `hint` | `string` | — | Hint text shown below |
| `required` | `boolean` | `false` | Appends a red asterisk to the label |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `default` | — | The form control to wrap |

---

### SCheckbox

Styled checkbox with optional label and description.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | — | Checked state (`v-model`, required) |
| `label` | `string` | — | Label text |
| `description` | `string` | — | Secondary description below the label |
| `disabled` | `boolean` | `false` | Disabled state |
| `danger` | `boolean` | `false` | Styles the checkbox and label in danger/red colour |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Emitted on toggle |

---

### SToggle

Animated switch control with optional label and description.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `boolean` | — | On/off state (`v-model`, required) |
| `label` | `string` | — | Label text |
| `description` | `string` | — | Secondary description below the label |
| `disabled` | `boolean` | `false` | Disabled state |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `boolean` | Emitted on toggle |

---

### SInlineTextField

Click-to-edit text field that displays as plain text and reveals an input on interaction.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | — | Current value (`v-model`, required) |
| `placeholder` | `string` | `''` | Shown in display mode and input mode when empty |
| `error` | `string` | `''` | Error message shown below |
| `disabled` | `boolean` | `false` | Prevents entering edit mode |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Emitted on save (blur or Enter); not emitted on Escape |

---

## Display

### SCard

Container card with several visual variants.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'content' \| 'sidebar' \| 'list' \| 'nested' \| 'glass'` | `'content'` | Visual style variant |
| `hoverable` | `boolean` | `false` | Adds hover interaction styles |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `default` | — | Card body content |

---

### SBadge

Inline status badge.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'accent' \| 'success' \| 'warning' \| 'error' \| 'info' \| 'count'` | `'default'` | Colour variant |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `default` | — | Badge label text |

---

### STag

Pill-shaped tag, optionally interactive.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `interactive` | `boolean` | `true` | Renders as a `<button>` with hover styles; `false` renders as `<span>` |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `default` | — | Tag label |

---

### SStatusDot

Coloured dot indicator for status values.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'success' \| 'warning' \| 'danger' \| 'accent' \| 'neutral'` | `'neutral'` | Dot colour |
| `size` | `'sm' \| 'md'` | `'md'` | Dot diameter (6 px / 8 px) |

---

### SKbd

Keyboard key badge styled to resemble a physical key. No props — place key name(s) in the default slot.

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `default` | — | Key name(s) to display |

---

### SAvatar

User avatar showing an image, initials derived from `name`, or a generic person icon.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | — | Full name; initials (up to two characters) are derived automatically |
| `src` | `string` | — | Image URL; takes priority over initials and the placeholder icon |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Dimensions (24 / 32 / 40 px) |
| `variant` | `'accent' \| 'neutral'` | `'neutral'` | Background colour when displaying initials or icon |

---

### SHeading

Semantic heading element with design-system typography presets.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `level` | `1 \| 2 \| 3 \| 4` | `2` | Visual and semantic heading level |
| `as` | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'p' \| 'span'` | — | Override the rendered HTML element; defaults to `h{level}` |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `default` | — | Heading text |

---

### SText

Inline or block text with size, colour, and weight variants.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'body' \| 'compact' \| 'small' \| 'xs'` | `'body'` | Font size (15 / 13 / 12 / 11 px) |
| `color` | `'primary' \| 'secondary' \| 'tertiary' \| 'accent' \| 'success' \| 'warning' \| 'danger'` | `'primary'` | Text colour token |
| `as` | `'p' \| 'span' \| 'div' \| 'label'` | `'p'` | Rendered HTML element |
| `medium` | `boolean` | `false` | Applies medium font weight |
| `mono` | `boolean` | `false` | Applies monospace font |
| `leading` | `'relaxed' \| 'snug' \| 'none'` | — | Line height; defaults automatically per size |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `default` | — | Text content |

---

### SProse

Wrapper for long-form HTML content (Markdown output, rich text) with opinionated typography styles applied via CSS.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `animate` | `boolean` | `false` | Adds a fade-in animation on mount |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `default` | — | HTML content to style |

---

### SDivider

Horizontal or vertical separator line.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction of the divider |
| `subtle` | `boolean` | `false` | Reduces opacity for a lighter visual weight |

---

### SListRow

Clickable list row with selection state and an actions slot.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selected` | `boolean` | `false` | Applies the selected background colour |
| `disabled` | `boolean` | `false` | Disables click and keyboard interaction |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | — | Emitted on click or Enter/Space keypress |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `default` | — | Main row content (left-aligned, fills available space) |
| `actions` | — | Right-aligned actions (e.g. `SIconButton`, `SRowActionMenu`) |

---

### SSectionHeader

Labelled section header with an optional item count badge and an optional action button.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Section label text (required) |
| `count` | `number` | — | Item count shown in a pill badge |
| `actionLabel` | `string` | — | Label for the optional action button |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `action` | — | Emitted when the action button is clicked |

---

### SSparkline

Inline SVG line chart for small trend visualisations.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `values` | `number[]` | — | Data points to plot (required) |
| `width` | `number` | `120` | SVG width in pixels |
| `height` | `number` | `32` | SVG height in pixels |
| `color` | `string` | `'var(--color-accent)'` | Stroke and fill colour |
| `gradient` | `boolean` | `false` | Fills the area below the line with a gradient |
| `strokeWidth` | `number` | `1.5` | Line stroke width |

---

### SScoreBar

Horizontal progress-style bar whose fill colour changes automatically based on the value (green ≥ 70%, amber ≥ 40%, red below).

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | — | Score as a decimal between 0 and 1 (required) |
| `label` | `string` | — | Label displayed to the left of the bar |
| `showValue` | `boolean` | `false` | Shows the percentage value to the right of the bar |
| `size` | `'sm' \| 'md'` | `'md'` | Bar height (6 px / 8 px) |

---

### SCodeEditor

Read-only code display block with optional line numbers and a scoped slot for syntax-highlighted content.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `code` | `string` | — | Source code string to display (required) |
| `lineNumbers` | `boolean` | `true` | Renders a line-number gutter |
| `maxHeight` | `string` | — | CSS `max-height` value; enables vertical scrolling |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `default` | `{ code: string, lines: string[] }` | Custom rendering of the code content; falls back to a plain `<pre>` |

---

### SKpiCard

Metric card displaying a label and a large numeric or text value.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Metric label (required) |
| `value` | `string \| number` | — | Metric value (required) |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `icon` | — | Optional icon displayed in a container to the left of the metric |

---

### SBarChart

Responsive SVG bar chart that adapts bar widths to the container.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `{ label: string; value: number }[]` | — | Data points to render (required) |
| `height` | `number` | `120` | SVG height in pixels |
| `highlightLast` | `boolean` | `false` | Renders the final bar in full accent colour |

---

### SHeatmapCalendar

GitHub-style activity heatmap grid showing daily counts over recent weeks.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `counts` | `Record<string, number>` | — | Map of ISO date strings (`'YYYY-MM-DD'`) to counts (required) |
| `weeks` | `number` | `16` | Number of weeks to display |
| `cellSize` | `number` | `10` | Width and height of each day cell in pixels |
| `tooltipSuffix` | `string` | `'events'` | Noun appended to the count in each cell's tooltip |

---

## Feedback

### SToast

Single toast notification. Use `SToastContainer` for automated queue management.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'success' \| 'error' \| 'info'` | `'info'` | Colour scheme |
| `visible` | `boolean` | `true` | Controls visibility with an enter/leave transition |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `dismiss` | — | Emitted when the toast is clicked |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `default` | — | Toast message content |

---

### SToastContainer

Drop-in toast queue renderer. Teleports to `<body>` and connects to the `useToastStack` singleton. Add once at the app root; no props required.

---

### SSkeleton

Block-level loading placeholder with preset shape variants.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'bar' \| 'text' \| 'card' \| 'list'` | `'bar'` | Skeleton shape preset |
| `width` | `string` | `'100%'` | CSS width (only used by `bar` variant) |
| `height` | `string` | `'1rem'` | CSS height (only used by `bar` variant) |

---

### SSkeletonText

Configurable stack of skeleton text lines.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `lines` | `number` | `3` | Number of skeleton lines to render |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Height of each line (8 / 10 / 14 / 16 px) |
| `width` | `'full' \| 'varied' \| 'short'` | `'varied'` | Width pattern across lines |

---

### SSpinner

Minimal animated loading spinner.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'sm'` | Spinner diameter (14 / 20 / 32 px) |

---

### SEmptyState

Centred empty-state illustration with title, description, and an optional action.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `''` | Bold heading text |
| `description` | `string` | `''` | Secondary descriptive text |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `icon` | — | Custom illustration or icon; falls back to a default box icon |
| `action` | — | Optional action (e.g. a button) rendered below the description |

---

### SNoticeBanner

Inline notice banner for informational, warning, or error messages.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'info' \| 'warning' \| 'danger'` | `'info'` | Colour scheme |
| `dismissible` | `boolean` | `false` | Shows a dismiss button |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `dismiss` | — | Emitted when the dismiss button is clicked |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `default` | — | Banner message content |

---

### SProgressBar

Horizontal progress indicator with an optional indeterminate animation.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | — | Progress percentage (0–100, required) |
| `variant` | `'accent' \| 'success' \| 'warning' \| 'danger'` | `'accent'` | Fill colour |
| `size` | `'sm' \| 'md'` | `'sm'` | Bar height (4 px / 6 px) |
| `indeterminate` | `boolean` | `false` | Plays a looping animation; `value` is ignored |

---

### SRouteProgressBar

Thin top-of-page loading bar driven by a reactive `loading` boolean. Typically bound to a Vue Router navigation guard.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loading` | `boolean` | `false` | Set to `true` to start, `false` to complete |
| `color` | `string` | `'var(--color-accent)'` | Bar colour as any valid CSS colour value |

---

## Navigation

### SSidebarLink

Navigation item for use inside a sidebar. Renders as a `RouterLink` or a `<button>` depending on whether `to` is provided.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `to` | `string` | — | Route path; triggers `RouterLink` rendering |
| `active` | `boolean` | `false` | Applies the active visual state |
| `level` | `number` | `0` | Nesting depth; each level adds 12 px of left indentation |
| `updated` | `boolean` | `false` | Shows a small accent dot when `active` is false |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | `MouseEvent` | Forwarded native click event |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `default` | — | Link label and optional icon |

---

### SBreadcrumbs

Breadcrumb trail rendered as a `<nav>` element.

**Types:**

```ts
interface BreadcrumbSegment {
  label: string
  to?: string  // Renders as a clickable button when present
}
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `segments` | `BreadcrumbSegment[]` | — | Ordered segments from root to current page (required) |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `navigate` | `string` | Emitted with the `to` value when a segment button is clicked |

---

### SBackToTop

Fixed-position button that scrolls the user back to the top, shown conditionally via `visible`.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | `false` | Controls button visibility with a transition |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | — | Emitted when the button is clicked |

---

## Overlay

### SModal

Accessible modal dialog with backdrop, keyboard dismissal (Escape), and click-outside dismissal. Teleports to `<body>`.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Controls visibility |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | — | Preset max-width; overrides `maxWidth` when set |
| `maxWidth` | `string` | `'max-w-lg'` | Tailwind max-width class (used when `size` is not set) |
| `title` | `string` | — | Title text rendered in the default header |
| `description` | `string` | — | Secondary text below the title in the default header |
| `closable` | `boolean` | `true` | Shows the close button and enables Escape/backdrop dismissal |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `close` | — | Emitted when the modal should close |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `header` | — | Custom header content (replaces title/description) |
| `default` | — | Modal body content |
| `footer` | — | Footer content rendered below the body |

---

### SConfirmDialog

Pre-built confirmation dialog built on top of `SModal`. Pairs with `useConfirm` for programmatic use.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Controls visibility |
| `title` | `string` | — | Dialog title (required) |
| `message` | `string` | — | Descriptive message below the title |
| `confirmLabel` | `string` | `'Confirm'` | Confirm button label |
| `cancelLabel` | `string` | `'Cancel'` | Cancel button label |
| `danger` | `boolean` | `false` | Styles the confirm button in danger red |
| `variant` | `'primary' \| 'danger' \| 'warning'` | `'primary'` | Confirm button colour variant |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `confirm` | — | Emitted when the confirm button is clicked |
| `cancel` | — | Emitted when the cancel button is clicked |
| `close` | — | Emitted when the modal requests closure |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `default` | — | Additional custom content below the message |

---

### SCommandPalette

Full-screen command palette with a search input, keyboard navigation, and a results slot. Teleports to `<body>`.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Controls visibility |
| `placeholder` | `string` | `'Search...'` | Search input placeholder |
| `resultCount` | `number` | `0` | Number of results in the default slot; used to clamp keyboard selection |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `close` | — | Emitted on Escape or backdrop click |
| `update:query` | `string` | Emitted on every keystroke |
| `select` | `number` | Emitted with the selected index when Enter is pressed |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `actions` | — | Optional filter pills or controls rendered below the search input |
| `default` | `{ selectedIndex: number }` | Result items; add `data-index="<n>"` to each for scroll-into-view support |

---

### SDropdownMenu

Dropdown menu with keyboard navigation. Supports an items array or fully custom slot-based content.

**Types:**

```ts
interface SDropdownMenuItem {
  label: string
  value: string
  danger?: boolean
  disabled?: boolean
}
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `SDropdownMenuItem[]` | `[]` | Menu items to render; when empty, the `content` slot is used instead |
| `align` | `'left' \| 'right'` | `'right'` | Horizontal alignment of the dropdown panel |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `select` | `string` | Emitted with the selected item's `value` |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `trigger` | `{ toggle: () => void, open: boolean }` | The element that opens the menu |
| `content` | `{ close: () => void }` | Custom menu content (used when `items` is empty) |

---

### SDropdownItem

Individual item for use inside `SDropdownMenu`'s `content` slot.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Item label; overridden by the default slot |
| `danger` | `boolean` | `false` | Styles the item in danger/red colour |
| `disabled` | `boolean` | `false` | Disables click interaction |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `default` | — | Custom item content; falls back to `label` |

---

### SRowActionMenu

Compact three-dot action menu designed for list rows. A thin wrapper around `SDropdownMenu`.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `actions` | `{ label: string; value: string; danger?: boolean; disabled?: boolean }[]` | — | Action items (required) |
| `align` | `'left' \| 'right'` | `'right'` | Dropdown alignment |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `select` | `string` | Emitted with the selected action's `value` |

---

### STooltip

Hover tooltip with configurable delay. Wraps content in an inline `<span>`.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | — | Tooltip text (required) |
| `position` | `'top' \| 'bottom'` | `'top'` | Tooltip placement relative to the trigger |
| `delay` | `number` | `400` | Hover delay in milliseconds before the tooltip appears |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `default` | — | The element that triggers the tooltip |

---

### SKeyboardShortcuts

Modal that displays keyboard shortcuts grouped by category.

**Types:**

```ts
interface ShortcutGroup {
  title: string
  shortcuts: { keys: string; description: string }[]
}
```

`keys` uses `+` as a separator, e.g. `'⌘+K'` or `'Ctrl+K'`.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Controls visibility |
| `groups` | `ShortcutGroup[]` | — | Shortcut groups to display (required) |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `close` | — | Emitted when the modal requests closure |

---

### SPanel

Slide-in side panel (right edge) with focus trap and body scroll lock. Teleports to `<body>`.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Controls visibility |
| `title` | `string` | — | Panel title rendered in the default header |
| `subtitle` | `string` | — | Secondary text below the title |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Panel max-width (384 / 448 / 512 / 672 px) |
| `closable` | `boolean` | `true` | Shows the close button and enables Escape dismissal |
| `overlay` | `boolean` | `true` | Renders a dark backdrop behind the panel |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `close` | — | Emitted when the panel should close |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `icon` | — | Icon displayed to the left of the header text |
| `header` | — | Custom header content (replaces title/subtitle) |
| `default` | — | Scrollable panel body |
| `footer` | — | Sticky footer with right-aligned content |

---

### SImageLightbox

Full-screen image lightbox with focus trap and body scroll lock. Teleports to `<body>`.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Controls visibility |
| `src` | `string` | — | Image URL (required) |
| `alt` | `string` | `''` | Image alt text and aria-label for the dialog |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| `close` | — | Emitted on Escape or clicking outside the image |

---

## Layout

### SThemeProvider

Provides theme context (`mode`, `isDark`, `toggle`, `setMode`) to descendants via `inject('stuntrocket-theme')`. Sets accent colour overrides on `:root`.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `accent` | `string` | — | CSS colour string to override `--color-accent` |
| `accentHover` | `string` | — | Custom hover colour; auto-derived from `accent` if omitted |
| `storageKey` | `string` | `'stuntrocket-theme'` | `localStorage` key for persisting theme mode |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `default` | — | Application content |

---

### STopbar

Fixed top navigation bar with macOS traffic-light padding support and three layout zones.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `trafficLightPadding` | `string` | `'78px'` | Left padding to clear macOS window controls |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `left` | — | Left zone content (logo, back button, etc.) |
| `centre` | — | Centre zone content (search, title, etc.) |
| `right` | — | Right zone content (actions, avatar, etc.) |

---

### SSidebar

Sidebar panel that respects the topbar height and provides header, scrollable body, and footer zones.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `string` | `'280px'` | CSS width of the sidebar |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `header` | — | Content above the scrollable area (search, section title) |
| `default` | — | Scrollable navigation content |
| `footer` | — | Pinned bottom content (user profile, settings link) |

---

### SAppShell

Main application layout composed of a sidebar, a content area, and an optional inspector panel.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sidebarWidth` | `string` | `'220px'` | CSS width of the sidebar column |
| `showInspector` | `boolean` | `false` | Renders the inspector panel on the right |
| `inspectorWidth` | `string` | `'260px'` | CSS width of the inspector panel |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `sidebar` | — | Sidebar content |
| `default` | — | Main content area |
| `inspector` | — | Inspector/detail panel content (only rendered when `showInspector` is true) |

---

### SPageHeader

Sticky page-level header bar with a prepend zone and an actions zone.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sticky` | `boolean` | `true` | Sticks to the top of the scroll container with a blur backdrop |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `prepend` | — | Left zone (page title, breadcrumbs, back button) |
| `actions` | — | Right zone (action buttons) |

---

### SResizableSplit

Two-pane layout with a draggable divider. Supports both horizontal and vertical orientations and optionally persists divider position to `localStorage`.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Axis along which panes are split |
| `initialSize` | `number` | `50` | Initial size of the first pane as a percentage |
| `minSize` | `number` | `20` | Minimum first-pane size as a percentage |
| `maxSize` | `number` | `80` | Maximum first-pane size as a percentage |
| `storageKey` | `string` | — | `localStorage` key for persisting divider position |

**Slots:**

| Slot | Scope | Description |
|------|-------|-------------|
| `first` | — | First pane content |
| `second` | — | Second pane content |

---

### SAmbientBlobs

Decorative ambient gradient orbs for atmospheric backgrounds. Requires `ambient.css` to be imported.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color1` | `string` | `'var(--color-accent)'` | Top-right blob colour |
| `color2` | `string` | `'#8B5CF6'` | Bottom-left blob colour |
| `color3` | `string` | `'#06B6D4'` | Centre blob colour |

---

## Composables

### `useTheme(options?)`

Manages light/dark/system theme mode, persists selection to `localStorage`, and applies the `.dark` class to `<html>`.

```ts
function useTheme(options?: { storageKey?: string }): UseThemeReturn
```

| Return | Type | Description |
|--------|------|-------------|
| `mode` | `Ref<'light' \| 'dark' \| 'system'>` | Current theme mode |
| `isDark` | `ComputedRef<boolean>` | Whether dark mode is currently active |
| `toggle()` | `() => void` | Cycles through light → dark → system |
| `setMode(m)` | `(m: ThemeMode) => void` | Sets a specific mode directly |

---

### `useToastStack()`

Module-level singleton toast queue. All callers share the same stack. Use `SToastContainer` to render toasts.

```ts
function useToastStack(): UseToastStackReturn
```

| Return | Type | Description |
|--------|------|-------------|
| `toasts` | `Ref<Toast[]>` | Reactive list of active toasts |
| `addToast(message, variant?, duration?)` | `(string, variant?, number?) => void` | Adds a toast with optional duration (default 4 000 ms) |
| `removeToast(id)` | `(string) => void` | Removes a toast by ID |
| `success(message, duration?)` | `(string, number?) => void` | Shorthand for `addToast` with `'success'` variant |
| `error(message, duration?)` | `(string, number?) => void` | Shorthand for `addToast` with `'error'` variant |
| `info(message, duration?)` | `(string, number?) => void` | Shorthand for `addToast` with `'info'` variant |
| `warning(message, duration?)` | `(string, number?) => void` | Shorthand for `addToast` with `'warning'` variant |

**`Toast` type:**

```ts
interface Toast {
  id: string
  message: string
  variant: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}
```

---

### `useKeyboardShortcut(key, handler, options?)`

Registers a global keydown listener. Ignored when focus is inside an editable element (unless `key` is `'Escape'`). Automatically unregistered on unmount.

```ts
function useKeyboardShortcut(
  key: string,
  handler: () => void,
  options?: KeyboardShortcutOptions,
): UseKeyboardShortcutReturn
```

**`KeyboardShortcutOptions`:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `meta` | `boolean` | `false` | Requires Cmd (macOS) or Ctrl (Windows/Linux) |
| `shift` | `boolean` | `false` | Requires Shift |
| `preventDefault` | `boolean` | `true` | Calls `event.preventDefault()` on match |

| Return | Type | Description |
|--------|------|-------------|
| `unregister()` | `() => void` | Manually remove the listener before unmount |

---

### `useFocusTrap(containerRef, active)`

Traps Tab focus within a container element when `active` is `true`. Restores focus to the previously focused element when deactivated.

```ts
function useFocusTrap(containerRef: Ref<HTMLElement | null>, active: Ref<boolean>): void
```

---

### `useRelativeTime(date, updateInterval?)`

Reactive relative time string that refreshes on a configurable interval.

```ts
function useRelativeTime(
  date: Ref<string | Date | null>,
  updateInterval?: number,  // default 60000 ms
): UseRelativeTimeReturn
```

| Return | Type | Description |
|--------|------|-------------|
| `relative` | `ComputedRef<string \| null>` | e.g. `'just now'`, `'3h ago'`, `'2 weeks ago'` |
| `full` | `ComputedRef<string \| null>` | Full date formatted as `'14 March 2025'` (en-GB) |

**Standalone utility:**

```ts
function formatRelativeTime(date: string | Date): string
```

---

### `useClipboard()`

Copies text to the clipboard with a reactive `copied` flag for button feedback.

```ts
function useClipboard(): UseClipboardReturn
```

| Return | Type | Description |
|--------|------|-------------|
| `copy(text)` | `(string) => Promise<boolean>` | Copies text; resolves `true` on success |
| `copied` | `Ref<boolean>` | `true` for 2 000 ms after a successful copy |

---

### `useSearch(items, searchFn, options?)`

Generic reactive search over a list with optional debouncing and match highlighting.

```ts
function useSearch<T>(
  items: Ref<T[]>,
  searchFn: (item: T, query: string) => boolean,
  options?: { debounceMs?: number },
): UseSearchReturn<T>
```

| Return | Type | Description |
|--------|------|-------------|
| `query` | `Ref<string>` | Bind to a search input |
| `filtered` | `ComputedRef<T[]>` | Items that pass `searchFn` against the current query |
| `clearQuery()` | `() => void` | Resets the query to `''` |
| `highlightMatch(text)` | `(string) => SearchHighlight` | Splits `text` into before/match/after segments |

**`SearchHighlight` type:**

```ts
interface SearchHighlight {
  before: string
  match: string
  after: string
  hasMatch: boolean
}
```

---

### `useResizableSidebar(options?)`

Drag-to-resize sidebar with `localStorage` persistence and `requestAnimationFrame` throttling.

```ts
function useResizableSidebar(options?: UseResizableSidebarOptions): UseResizableSidebarReturn
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `defaultWidth` | `number` | `280` | Default width in pixels |
| `minWidth` | `number` | `180` | Minimum allowed width in pixels |
| `maxWidth` | `number` | `480` | Maximum allowed width in pixels |
| `storageKey` | `string` | `'sidebar-width'` | `localStorage` key |

| Return | Type | Description |
|--------|------|-------------|
| `width` | `Ref<number>` | Current sidebar width in pixels |
| `isResizing` | `Ref<boolean>` | `true` while a drag is in progress |
| `startResize(e)` | `(MouseEvent) => void` | Attach to `@mousedown` on the drag handle |
| `resetWidth()` | `() => void` | Resets to `defaultWidth` |

---

### `useSidebarCollapse(storageKey?)`

Persisted collapsed/expanded sidebar state.

```ts
function useSidebarCollapse(storageKey?: string): UseSidebarCollapseReturn
// storageKey default: 'sidebar-collapsed'
```

| Return | Type | Description |
|--------|------|-------------|
| `collapsed` | `Ref<boolean>` | Current collapsed state |
| `toggle()` | `() => void` | Toggles between collapsed and expanded |
| `collapse()` | `() => void` | Collapses the sidebar |
| `expand()` | `() => void` | Expands the sidebar |

---

### `useConfirm()`

Module-level singleton for a global confirmation dialog. Pair with `SConfirmDialog` at the app root.

```ts
function useConfirm(): UseConfirmReturn
```

| Return | Type | Description |
|--------|------|-------------|
| `isOpen` | `Ref<boolean>` | Bind to `SConfirmDialog`'s `:open` prop |
| `options` | `Ref<ConfirmOptions>` | Bind to `SConfirmDialog`'s props |
| `confirm(opts)` | `(ConfirmOptions) => Promise<boolean>` | Shows the dialog; resolves `true` on confirm, `false` on cancel |
| `handleConfirm()` | `() => void` | Bind to `SConfirmDialog`'s `@confirm` |
| `handleCancel()` | `() => void` | Bind to `SConfirmDialog`'s `@cancel` and `@close` |

**`ConfirmOptions` type:**

```ts
interface ConfirmOptions {
  title: string
  message?: string
  confirmLabel?: string   // default 'Confirm'
  cancelLabel?: string    // default 'Cancel'
  danger?: boolean
}
```

---

### `useCountUp(target, options?)`

Animates a numeric value to a new target using `requestAnimationFrame`.

```ts
function useCountUp(
  target: Ref<number>,
  options?: { duration?: number; easing?: (t: number) => number },
): { displayValue: Ref<number> }
// duration default: 400 ms
// easing default: easeOutCubic
```

---

### `usePersistedRef(key, defaultValue)`

A `Ref` backed by `localStorage`. Reads on creation, writes on every change.

```ts
function usePersistedRef<T>(key: string, defaultValue: T): Ref<T>
```

---

### `useExternalLink()`

Opens a URL in the system browser. Uses Tauri's `open_external_url` command when available, falling back to `window.open`.

```ts
function useExternalLink(): { openExternal: (url: string) => Promise<void> }
```

---

### `useContextMenu()`

Module-level singleton for a custom context menu. Tracks position and items.

```ts
function useContextMenu(): {
  visible: Ref<boolean>
  position: Ref<{ x: number; y: number }>
  items: Ref<ContextMenuItem[]>
  open: (event: MouseEvent, items: ContextMenuItem[]) => void
  close: () => void
}
```

**`ContextMenuItem` type:**

```ts
interface ContextMenuItem {
  label: string
  action: () => void
  danger?: boolean
  disabled?: boolean
}
```

---

### `useScrollMemory(router, selector?)`

Saves and restores scroll position for each route using Vue Router navigation hooks.

```ts
function useScrollMemory(router: Router, selector?: string): void
// selector default: 'main'
```

Stores up to 100 route positions in a module-level `Map`. Call once at app setup.

---

### `usePlatform()`

Detects the host operating system.

```ts
function usePlatform(): { isMac: boolean }
```

---

### `formatShortcut(key, options?)`

Formats a keyboard shortcut string for display using platform-appropriate symbols.

```ts
function formatShortcut(
  key: string,
  options?: { meta?: boolean; shift?: boolean; alt?: boolean },
): string
// e.g. formatShortcut('K', { meta: true }) → '⌘K' on macOS, 'Ctrl+K' on Windows
```

---

### `registerKeydownHandler(priority, handler)`

Registers a low-level keydown handler in a shared priority-sorted dispatcher. Handlers returning `true` stop propagation to lower-priority handlers. Returns an unregister function.

```ts
function registerKeydownHandler(
  priority: number,
  handler: (e: KeyboardEvent) => boolean | void,
): () => void
```

Higher `priority` values run first.
