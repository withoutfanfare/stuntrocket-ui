# Stuntrocket Visual Identity Styleguide

**Purpose**: Single source of truth for the visual identity of all Stuntrocket desktop and web applications
**Implementation**: `@stuntrocket/ui` — shared Vue 3 component library consumed by all Tauri apps
**Design philosophy**: Premium native macOS — warm paper-like surfaces, translucent depth, shadows over borders, micro-animations, generous whitespace

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Typography](#2-typography)
3. [Colour System](#3-colour-system)
4. [Spacing & Sizing](#4-spacing--sizing)
5. [Border Radius](#5-border-radius)
6. [Shadows & Elevation](#6-shadows--elevation)
7. [Surfaces & Translucency](#7-surfaces--translucency)
8. [Motion & Animation](#8-motion--animation)
9. [Buttons](#9-buttons)
10. [Form Controls](#10-form-controls)
11. [Navigation Patterns](#11-navigation-patterns)
12. [Cards & Panels](#12-cards--panels)
13. [Badges, Tags & Status Indicators](#13-badges-tags--status-indicators)
14. [Lists & Rows](#14-lists--rows)
15. [Overlays & Modals](#15-overlays--modals)
16. [Toast Notifications](#16-toast-notifications)
17. [Notice Banners](#17-notice-banners)
18. [Loading & Empty States](#18-loading--empty-states)
19. [Iconography](#19-iconography)
20. [Prose / Long-Form Content](#20-prose--long-form-content)
21. [Dark Mode](#21-dark-mode)
22. [Scrollbars](#22-scrollbars)
23. [Focus & Accessibility](#23-focus--accessibility)
24. [macOS Native Integration](#24-macos-native-integration)
25. [Ambient Background](#25-ambient-background)
26. [Layout Blueprints](#26-layout-blueprints)
27. [Z-Index Scale](#27-z-index-scale)
28. [CSS Token Reference](#28-css-token-reference)
29. [Implementation Notes](#29-implementation-notes)

---

## 1. Design Principles

### Core Philosophy

The visual identity draws from **Things.app** (Cultured Code) and premium macOS desktop applications. Every surface should feel like quality stationery — warm, tactile, and considered.

### Guiding Rules

| Principle | Description |
|-----------|-------------|
| **Warmth over clinical** | Off-white surfaces (`#F5F5F3`, `#F9F9F7`) instead of pure white. Warm stone tones instead of cold greys. |
| **Shadows over borders** | Prefer soft, diffused shadows to communicate depth. When borders are used, keep them subtle (opacity 60–78%). |
| **Translucency & blur** | Key surfaces (topbar, sidebar, panels) use `backdrop-blur` with semi-transparent backgrounds to create depth and connection to content beneath. |
| **Restraint in colour** | A single blue accent carries all interactive meaning. Semantic colours (success, warning, danger) appear only for status feedback. Everything else is neutral. |
| **Micro-animations** | Every interactive element has subtle motion — scale on press, translate on hover, fade on appear. Motion is fast (80–280ms), never bouncy, and respects `prefers-reduced-motion`. |
| **Generous whitespace** | Content breathes. Padding is generous. Spacing between sections is deliberate and consistent. |
| **Typography hierarchy** | Size, weight, and colour establish hierarchy. Headings are tight-tracked and semibold. Body is relaxed and readable. |
| **Native feel** | On macOS: transparent titlebar with overlay traffic lights, platform fonts as fallback, platform scrollbar behaviour, blur effects. The app should feel like it belongs on the platform. |
| **One system, flexible density** | The same palette, components, and tokens are used everywhere. Apps vary padding and font size for their context, but never the colours, radii, shadows, or interaction patterns. A utility app and a reading app should feel like siblings, not strangers. |

---

## 2. Typography

### Font Stack

```css
--font-sans: 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'SF Mono', 'Fira Code', ui-monospace, SFMono-Regular, monospace;
```

**Poppins** is the primary typeface for all apps. Load via Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet">
```

**Required weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold). Italic variants for 400 and 500.

### Root Settings

```css
html {
  font-size: 15px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Named Font Size Tokens

These tokens allow apps to pick from a shared scale depending on density:

| Token | Value | Typical Usage |
|-------|-------|---------------|
| `--text-xs` | `11px` | Section headers (uppercase), micro labels, compact badges |
| `--text-sm` | `12px` | Button text, secondary labels, compact body text |
| `--text-md` | `13px` | Sidebar links, default body text in compact apps |
| `--text-base` | `15px` | Root body text, body copy in content apps |
| `--text-lg` | `1.25rem` (20px) | Section headings (H2) |
| `--text-xl` | `1.95rem` → `2.15rem` | Page titles (H1), responsive |

### Named Font Weight Tokens

| Token | Value |
|-------|-------|
| `--weight-normal` | `400` |
| `--weight-medium` | `500` |
| `--weight-semibold` | `600` |
| `--weight-bold` | `700` |

### Type Scale

Every app uses the same type scale. Pick from the named sizes based on context — do not invent new sizes.

| Element | Size | Weight | Line Height | Extras |
|---------|------|--------|-------------|--------|
| **Page title (H1)** | `1.95rem` → `2.15rem` (sm+) | 600 | `leading-tight` | `tracking-tight` |
| **Section heading (H2)** | `1.25rem` | 600 | `leading-tight` | `tracking-tight`, bottom border in prose |
| **Sub-heading (H3)** | `1rem` | 600 | `leading-tight` | `tracking-tight` |
| **Label heading (H4)** | `0.875rem` | 600, uppercase | Normal | `tracking-wide`, `text-secondary` |
| **Section header** | `--text-xs` (11px) | 600, uppercase | Normal | `letter-spacing: 0.04em`, `text-secondary` |
| **Body (spacious)** | `--text-base` (15px) | 400 | 1.6 | Default for reading-heavy views |
| **Body (compact)** | `--text-md` (13px) | 400 | 1.4 | Default for list/tool views |
| **Button text** | `--text-sm` (12px) | 500 | Normal | All buttons, all apps |
| **Field labels** | `--text-xs` (11px) | 500 | Normal | Inspector/form labels |
| **Sidebar links** | `--text-md` (13px) | 400 (normal), 500 (active) | Normal | Navigation items |
| **Monospace** | `--text-xs` (11px) | 400 | Normal | Paths, code snippets |
| **Prose body** | `--text-base` (15px) | 400 | `leading-relaxed` | Long-form content only |

### Heading Spacing (Prose Context)

| Heading | Margin Top | Margin Bottom | Extra |
|---------|-----------|---------------|-------|
| H1 | `mt-8` | `mb-4` | — |
| H2 | `mt-10` | `mb-3` | `pb-2 border-b border-border` |
| H3 | `mt-7` | `mb-2` | — |
| H4 | `mt-5` | `mb-1.5` | Uppercase, `tracking-wide`, secondary colour |

---

## 3. Colour System

### Design Tokens

All colours are defined as CSS custom properties. When using Tailwind CSS v4, wrap them in a `@theme` directive to expose as utilities.

### Light Mode Palette

#### Surfaces

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-surface` | `#FFFFFF` | Primary background, cards, input fields |
| `--color-surface-secondary` | `#F5F5F3` | Secondary surfaces, hover backgrounds, code bg |
| `--color-sidebar` | `#F9F9F7` | Sidebar background (used with backdrop blur) |
| `--color-surface-app` | `#F5F5F4` | App-level background (behind translucent layers) |
| `--color-surface-hover` | `rgba(0, 0, 0, 0.04)` | Universal hover overlay |
| `--color-surface-selected` | `rgba(100, 120, 140, 0.10)` | Selected row/item |
| `--color-surface-selected-strong` | `rgba(100, 120, 140, 0.16)` | Selected + hover |
| `--color-code-surface` | `#F7F8FB` | Code block background |

#### Text

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-text-primary` | `#1A1A1A` | Headings, body copy, primary labels |
| `--color-text-secondary` | `#6B6B6B` | Secondary labels, descriptions |
| `--color-text-tertiary` | `#999999` | Hints, placeholders, muted meta text |
| `--color-text-inverse` | `#FFFFFF` | Text on dark/accent backgrounds |

#### Chrome

| Token | Value | Usage |
|-------|-------|-------|
| `--color-border` | `#E5E5E2` | Standard warm borders, dividers |
| `--color-border-subtle` | `rgba(0, 0, 0, 0.08)` | Very subtle borders |
| `--color-border-default` | `rgba(0, 0, 0, 0.12)` | Standard borders (alpha-based, works on any surface) |
| `--color-border-strong` | `rgba(0, 0, 0, 0.18)` | Prominent borders |

#### Accent

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-accent` | `#2563EB` | Links, active states, CTA buttons, interactive highlights |
| `--color-accent-hover` | `#1D4ED8` | Accent hover state |
| `--color-accent-subtle` | `rgba(37, 99, 235, 0.10)` | Accent tinted background |

#### Semantic Status Colours

| Token | Hex | Subtle Variant | Usage |
|-------|-----|----------------|-------|
| `--color-success` | `#5A9A6B` | `rgba(90, 154, 107, 0.10)` | Positive actions, connected, saved |
| `--color-warning` | `#C49432` | `rgba(196, 148, 50, 0.10)` | Warnings, pending state |
| `--color-danger` | `#C45454` | `rgba(196, 84, 84, 0.10)` | Errors, broken, destructive actions |

#### Code

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-code-surface` | `#F7F8FB` | Code block background |
| `--color-code-border` | `#DCE1EA` | Code block border |

### Dark Mode Palette

#### Surfaces

| Token | Hex |
|-------|-----|
| `--color-surface` | `#171717` |
| `--color-surface-secondary` | `#262626` |
| `--color-sidebar` | `#1A1A1A` |
| `--color-surface-app` | `#1E1E1E` |
| `--color-surface-hover` | `rgba(255, 255, 255, 0.06)` |
| `--color-surface-selected` | `rgba(140, 160, 180, 0.12)` |
| `--color-surface-selected-strong` | `rgba(140, 160, 180, 0.20)` |
| `--color-code-surface` | `#1E1F24` |

#### Text

| Token | Hex |
|-------|-----|
| `--color-text-primary` | `#EDEDED` |
| `--color-text-secondary` | `#999999` |
| `--color-text-tertiary` | `#666666` |
| `--color-text-inverse` | `#1A1A1A` |

#### Chrome

| Token | Value |
|-------|-------|
| `--color-border` | `#303030` |
| `--color-border-subtle` | `rgba(255, 255, 255, 0.06)` |
| `--color-border-default` | `rgba(255, 255, 255, 0.10)` |
| `--color-border-strong` | `rgba(255, 255, 255, 0.16)` |

#### Accent & Status (Dark)

| Token | Hex |
|-------|-----|
| `--color-accent` | `#60A5FA` |
| `--color-accent-hover` | `#93C5FD` |
| `--color-accent-subtle` | `rgba(96, 165, 250, 0.14)` |
| `--color-success` | `#6AAA7B` |
| `--color-success-subtle` | `rgba(106, 170, 123, 0.14)` |
| `--color-warning` | `#D4A442` |
| `--color-warning-subtle` | `rgba(212, 164, 66, 0.14)` |
| `--color-danger` | `#D46464` |
| `--color-danger-subtle` | `rgba(212, 100, 100, 0.14)` |

### Accent Opacity Scale

The accent colour at varying opacities creates depth without introducing new hues:

| Opacity | Usage |
|---------|-------|
| `accent/5` | Very subtle hover background |
| `accent/8` | Active sidebar link background |
| `accent/10` | Active button bg, matches `--accent-subtle` |
| `accent/12` | Changed section highlighting |
| `accent/15` | Updated badge background |
| `accent/20` | Subtle accent border |
| `accent/30` | Active element border |
| `accent/40` | Prominent accent border |
| `accent` (100%) | CTA buttons, filter pills, links |

### Colour Mixing

For nuanced surface treatments, use CSS `color-mix()`:

```css
/* Semi-transparent surface */
background: color-mix(in srgb, var(--color-surface-secondary) 78%, transparent);

/* Accent-tinted border */
border-color: color-mix(in srgb, var(--color-accent) 38%, var(--color-border));

/* Accent-tinted surface */
background: color-mix(in srgb, var(--color-accent) 12%, var(--color-surface-secondary));
```

---

## 4. Spacing & Sizing

### Spacing Scale

A named 4px-grid scale shared across all apps:

| Token | Value | Tailwind | Common Usage |
|-------|-------|----------|--------------|
| `--space-1` | `4px` | `1` | Micro gaps, indicator dot spacing |
| `--space-2` | `8px` | `2` | Inner padding on small elements, list item spacing |
| `--space-3` | `12px` | `3` | Sidebar padding, card inner spacing, section gaps |
| `--space-4` | `16px` | `4` | Standard padding, inspector padding |
| `--space-5` | `20px` | `5` | Modal body padding, dialog content spacing |
| `--space-6` | `24px` | `6` | Page horizontal padding |
| `--space-8` | `32px` | `8` | Large horizontal padding (lg breakpoint) |
| `--space-10` | `40px` | `10` | Page vertical padding, empty state padding |

### Layout Dimension Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--titlebar-height` | `28px` | macOS title bar reserved space |
| `--toolbar-height` | `52px` | Topbar height (all apps) |
| `--sidebar-width` | `220px` | Standard sidebar width |
| `--sidebar-width-wide` | `280px` | Wider sidebar (for resizable or content-heavy nav) |
| `--inspector-width` | `260px` | Right-side inspector panel |
| `--right-sidebar-width` | `21rem` (336px) | Content-app right sidebar (table of contents, tools) |
| `--sidebar-row-height` | `30px` | Compact sidebar navigation row |
| `--list-row-height` | `34px` | Content list row |

---

## 5. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-xs` | `4px` | Inner nested radii (segmented control segments) |
| `--radius-sm` | `6px` | Buttons, badges, inputs, list rows, menu items |
| `--radius-md` | `10px` | Cards, dropdown menus, toasts, panels |
| `--radius-lg` | `14px` | Modals, dialogs, sheets |
| `--radius-xl` | `12px` | Content cards with backdrop blur |
| `--radius-full` | `999px` | Pills, filter chips, scrollbar thumbs, circles |

---

## 6. Shadows & Elevation

### Named Shadow Scale

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | `0 1px 2px rgba(0,0,0,0.2)` | Segmented control active, inline lift |
| `--shadow-md` | `0 2px 8px rgba(0,0,0,0.08)` | `0 2px 8px rgba(0,0,0,0.3)` | Dropdowns, menus, toasts |
| `--shadow-lg` | `0 4px 16px rgba(0,0,0,0.12)` | `0 4px 16px rgba(0,0,0,0.4)` | Floating panels, error bar |
| `--shadow-sheet` | `0 8px 32px rgba(0,0,0,0.16)` | `0 8px 32px rgba(0,0,0,0.5)` | Modals, sheets, dialogs |

### Warm Shadows (Content Context)

For content-rich cards and panels, use these bespoke warm shadows:

```css
/* Content header card */
shadow-[0_14px_30px_-26px_rgba(15,23,42,0.8)]

/* Floating tool panels (right sidebar) */
shadow-[0_10px_30px_-24px_rgba(0,0,0,0.85)]
```

### Elevation Hierarchy

| Level | Surface | Properties | Usage |
|-------|---------|------------|-------|
| **Ground** | `surface` | No shadow | Main content area |
| **Recessed** | `surface-secondary/45` | No shadow | Input fields, code blocks |
| **Raised** | `surface/50 backdrop-blur-xl` | Warm shadow | Content header cards |
| **Floating** | `surface/52 backdrop-blur-xl` | Warm shadow | Right sidebar cards |
| **Dropdown** | `surface` | `--shadow-md` | Menus, action dropdowns |
| **Overlay** | `surface shadow-2xl ring-1 ring-border` | — | Command palette, modals |
| **Sheet** | `surface` | `--shadow-sheet` | Full-screen dialogs |
| **Toast** | Glassmorphic | `--shadow-md` + `backdrop-blur` | Notifications |
| **Fixed UI** | `surface/72 backdrop-blur-xl` | Border only | Topbar, fixed toolbars |

---

## 7. Surfaces & Translucency

### Backdrop Blur Patterns

| Context | Background | Blur |
|---------|------------|------|
| Topbar | `bg-surface/72` | `backdrop-blur-xl` |
| Sidebar | `bg-sidebar/72` | `backdrop-blur-xl` |
| Right sidebar cards | `bg-surface/52` | `backdrop-blur-xl` |
| Content header | `bg-surface/50` | `backdrop-blur-xl` |
| Command palette overlay | `bg-black/40` | `backdrop-blur-sm` |
| Back-to-top button | `bg-surface/75` | `backdrop-blur` |
| Toast (glassmorphic) | Background + border | `backdrop-filter: blur(8px)` |

### Border Opacity Conventions

| Opacity | Usage |
|---------|-------|
| `subtle` (~8%) | Very light separators, sidebar borders |
| `/55` | Search input border |
| `/60` | Card borders, panel borders |
| `/70` | Topbar border, sidebar footer, standard dividers |
| `default` (~12%) | Standard borders |
| `strong` (~18%) | Prominent borders, hover escalation |
| Full (100%) | Focus borders, modal dividers |

---

## 8. Motion & Animation

### Named Duration Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-instant` | `80ms` | Button press transforms |
| `--duration-fast` | `120ms` | Hover colour changes, menu appear |
| `--duration-normal` | `180ms` | Standard transitions, fade in/out |
| `--duration-smooth` | `200ms` | Modal open/close, theme transition |
| `--duration-slow` | `280ms` | Sheet/panel transitions |

### Named Easing Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-default` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Most interactive elements |
| `--ease-out` | `cubic-bezier(0, 0, 0.25, 1)` | Enter animations |
| `--ease-in` | `cubic-bezier(0.25, 0.1, 1, 1)` | Exit animations |

### Transition Presets

```css
/* Standard interactive element */
transition: background var(--duration-fast) var(--ease-default),
            color var(--duration-fast) var(--ease-default);

/* Button with transform */
transition: background var(--duration-fast) var(--ease-default),
            color var(--duration-fast) var(--ease-default),
            transform var(--duration-instant) var(--ease-default);

/* Chip/pill */
transition: border-color 140ms ease, background-color 140ms ease,
            color 140ms ease, box-shadow 140ms ease;

/* Form control */
transition: border-color var(--duration-fast) var(--ease-default),
            box-shadow var(--duration-fast) var(--ease-default);

/* Global background (theme switching) */
transition: background-color var(--duration-smooth);
```

### Micro-Interactions

```css
/* Sidebar nav links — subtle scale */
nav a:active, nav button:active { transform: scale(0.98); }

/* Toolbar buttons — more pronounced */
[style*="no-drag"] button:active { transform: scale(0.94); }

/* Tab pills — lift on hover, settle on press */
.topbar-tab-pill:hover { transform: translateY(-1px); }
.topbar-tab-pill:active { transform: translateY(0); }
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .ambient-blob { animation: none !important; }
  .prose[data-enter] { animation: none !important; }
  *, *::before, *::after {
    transition-duration: 0.01s !important;
    animation-duration: 0.01s !important;
  }
}
```

---

## 9. Buttons

### Primary (CTA)

| Property | Value |
|----------|-------|
| Background | `var(--color-accent)` |
| Text | `var(--color-text-inverse)`, weight 500 |
| Radius | `var(--radius-sm)` (6px) |
| Hover | `opacity: 0.9` or `background: var(--color-accent-hover)` |
| Active | `opacity: 0.85` |
| Disabled | `opacity: 0.5`, `cursor: not-allowed` |
| Focus | `box-shadow: 0 0 0 2px var(--color-surface), 0 0 0 4px var(--color-accent)` |
| Loading | 12px spinner, 1.5px border, 600ms rotation |

### Secondary (Ghost)

| Property | Value |
|----------|-------|
| Background | `transparent` |
| Border | `1px solid var(--color-border-default)` |
| Hover | `background: var(--color-surface-hover)`, border escalates |

### Danger

Same as primary with `background: var(--color-danger)`.

### Icon Button

Square — `w-7 h-7` (28px) or `w-[26px] h-[26px]` (compact). Rounded `var(--radius-sm)`. Colour `text-secondary` → `text-primary` on hover, `surface-hover` bg on hover.

### Topbar Chip Button

Translucent toolbar button using `color-mix()` for layered surfaces. See `tokens.css` for full CSS.

### Small Action Button

`text-[11px]`, `px-2 py-1`, `border border-border/70`, `bg-surface-secondary/25`. Active: `bg-accent/10 text-accent border-accent/30`.

---

## 10. Form Controls

### Text Input

`rounded-md border border-border bg-surface px-3 py-2 text-sm`. Focus: `border-accent` + `ring-1 ring-accent` or `box-shadow: 0 0 0 2px var(--color-accent-subtle)`.

### Select (`.ui-select`)

Custom native select, `min-height: 2.5rem`, `border-radius: var(--radius-md)`, CSS chevron. Focus ring: `0 0 0 3px accent/22%`. Small: `.ui-select-sm` at `2rem`.

### Search Field

Compact: `30px` height, icon overlay at `left: 8px`, `padding-left: 32px`. Focus: `border-color: accent` + `box-shadow: 0 0 0 2px accent-subtle`.

### Segmented Control

Inline toggle: `surface-hover` bg, `border-subtle`, `2px` padding, segments at `24px` height, `11px` font. Active segment: `surface` bg + `shadow-sm`.

### Textarea

`rounded-lg border border-border/70 bg-surface-secondary/45 px-3 py-2`. Focus same as input.

### Inline Editable Field

Display: `13px text-primary`, hover shows `surface-hover`. Edit: transparent bg, `border-bottom: 1px solid accent`. Error: `border-bottom-color: danger`.

### Keyboard Shortcut (`<kbd>`)

`px-1.5 py-0.5 rounded border border-border bg-surface-secondary text-[10px] font-mono text-text-tertiary`.

---

## 11. Navigation Patterns

### Topbar (`STopbar`)

All apps use the same topbar: `fixed top-0 h-[52px] bg-surface/72 backdrop-blur-xl border-b border-border/70`. Traffic light offset: `pl-[78px]`. `-webkit-app-region: drag`. Three slots: left, centre, right.

### Sidebar Links

`text-[13px] rounded-md px-2 py-[5px]`. Active: `bg-accent/8 text-accent font-medium`. Nesting indent: `12px` per level, base `20px`. For denser nav, reduce to `font-size: 12px`, `min-height: 30px`.

### Breadcrumbs

`text-xs text-secondary`, chevron separators at `w-3 h-3 text-secondary/40`, links with `hover:bg-surface-secondary/45`.

### Tab Pills

Hover: `translateY(-1px)`. Active: `inset 0 0 0 1px accent/16%`. Close button: `opacity: 0.72` → `1` on hover.

### Back-to-Top

`fixed bottom-5 right-6 z-[70] h-9 w-9 rounded-full border bg-surface/75 shadow-lg backdrop-blur`.

---

## 12. Cards & Panels

### Content Header (`SCard` variant: `content`)

`rounded-xl border border-border/60 bg-surface/50 backdrop-blur-xl px-4 py-4 shadow-[0_14px_30px_-26px_rgba(15,23,42,0.8)]`.

### Sidebar Tool Card (`SCard` variant: `sidebar`)

`rounded-xl border border-border/60 bg-surface/52 backdrop-blur-xl p-3.5 shadow-[0_10px_30px_-24px_rgba(0,0,0,0.85)]`. Card header: `text-[11px] font-semibold uppercase tracking-[0.08em] text-secondary`.

### Inspector Panel

`width: 260px`, `border-left: 1px solid border-subtle`, `padding: 16px`. Labels: `11px tertiary`. Values: `12px primary`. Paths: `11px mono secondary`.

### List Card

`rounded-lg border border-border bg-surface p-3 hover:bg-surface-secondary/70`. Updated variant: `border-accent/20 bg-accent/5 hover:bg-accent/10`.

---

## 13. Badges, Tags & Status Indicators

### Tag

`rounded-full text-xs font-medium bg-surface-secondary text-secondary hover:text-accent hover:bg-accent/10`.

### Filter Pill

Inactive: `rounded-full text-[11px] bg-surface-secondary text-secondary`. Active: `bg-accent text-white`.

### Badge (Semantic Variants)

`height: 20px`, `px: 8px`, `font: 11px/500`, `radius: var(--radius-sm)`.

| Variant | Text | Background |
|---------|------|------------|
| `default` | `text-secondary` | `surface-hover` |
| `accent` | `accent` | `accent-subtle` |
| `success` | `success` | `success-subtle` |
| `warning` | `warning` | `warning-subtle` |
| `danger` | `danger` | `danger-subtle` |

Compact: `height: 16px`, `px: 4px`, `font: 10px`.

### Status Dot

`8px` circle, `rounded-full`, `flex-shrink: 0`. Colours: success (green), danger (red), accent (blue), warning (amber), tertiary (grey).

### Save State Badge

Saved: `border-emerald-500/35 bg-emerald-500/10 text-emerald-500`. Saving: `border-amber-500/40 bg-amber-500/10 text-amber-500`.

---

## 14. Lists & Rows

### List Row

`min-height: 34px`, `padding: 0 12px`, `radius: var(--radius-sm)`, `cursor: pointer`, `user-select: none`. Hover: `surface-hover`. Selected: `surface-selected`. Focus: `inset 0 0 0 2px accent`.

### Section Header

`text-[11px] font-semibold uppercase tracking-[0.04em] text-secondary`. Optional count badge (compact). Optional action link in `accent`.

---

## 15. Overlays & Modals

### Command Palette

Overlay: `bg-black/40 backdrop-blur-sm z-[100]`. Panel: `max-w-lg rounded-xl bg-surface shadow-2xl ring-1 ring-border`. Transition: `scale(0.98)` → `1`, 150ms.

### Modal (Settings)

Overlay: `bg-black/30 dark:bg-black/50 z-50`. Panel: `max-w-lg rounded-xl border shadow-2xl max-h-[80vh]`. Header/footer with `border-b`/`border-t`. Transition: `scale(0.95)` → `1`, 200ms.

### Confirm Dialog

Overlay: `bg-black/25 z-300`. Panel: `max-w-[360px] rounded-[14px] shadow-lg p-5`. Transition: `scale(0.96)` → `1`, 180ms.

### Sheet

Panel: `max-w-[800px] max-h-[85vh] rounded-[14px] shadow-sheet`. Transition: `translateY(24px)` → `0`, 280ms.

### Slide-Over

`fixed right-0 w-[460px] max-w-[90vw] shadow-xl`. Transition: `translateX(100%)` → `0`, 250ms.

---

## 16. Toast Notifications

Position: `fixed bottom-5 right-5 z-[200]`.

**Glassmorphic style** (recommended for all apps):

```css
.toast {
  padding: 8px 16px;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(8px);
  max-width: 320px;
}
```

| Type | Background | Text |
|------|-----------|------|
| `success` | `var(--color-success)` | `white` |
| `error` | `var(--color-danger)` | `white` |
| `info` | `var(--color-surface)` | `var(--color-text-primary)` + border |

Transition: Enter `translateY(8px) scale(0.95)` → normal, 180ms. Leave: `translateX(16px)` + fade, 120ms.

---

## 17. Notice Banners

Inline contextual alerts:

`flex gap-8px p-[8px_12px] text-sm rounded-sm line-height-1.5`.

| Variant | Text | Background |
|---------|------|------------|
| `info` | `accent` | `accent-subtle` |
| `warning` | `warning` | `warning-subtle` |
| `danger` | `danger` | `danger-subtle` |

Optional dismiss: `20px` button, `opacity: 0.6` → `1`.

---

## 18. Loading & Empty States

### Skeleton

```css
.ui-skeleton-bar {
  border-radius: 0.5rem;
  border: 1px solid color-mix(in srgb, var(--color-border) 74%, transparent);
  background: color-mix(in srgb, var(--color-surface-secondary) 92%, var(--color-surface));
  box-shadow: inset 0 1px 0 color-mix(in srgb, white 4%, transparent);
}
```

Use `animate-pulse` and vary widths (`w-3/4`, `w-1/2`, `w-5/6`) for rhythm.

### Spinner

`border-[1.5px] border-secondary/30 border-t-secondary animate-spin`. Button: `12px`, `600ms`, white border.

### Empty State

Centred column: icon (`w-10 h-10 text-secondary/40`), title (`text-base font-semibold`), description (`text-sm text-secondary`), optional CTA button. Max width `280px`, `padding: 40px`.

---

## 19. Iconography

**Inline SVG**, Heroicons outline style. `fill="none" stroke="currentColor" stroke-width="1.5"`, `stroke-linecap="round" stroke-linejoin="round"`.

| Context | Size |
|---------|------|
| Toolbar | `14px` (`w-3.5 h-3.5`) |
| Standard | `16px` (`w-4 h-4`) |
| Section header | `12px` (`w-3 h-3`) |
| Sidebar nav (compact) | `18px` |
| Empty state small | `40px` |
| Empty state large | `64px` |

Colour via `currentColor`. Default `text-secondary`, hover `text-primary`, active `accent`.

---

## 20. Prose / Long-Form Content

Only for content-rich apps. Uses `@tailwindcss/typography` with overrides for headings, links, code, tables, blockquotes, lists. H2 gets a bottom border. Inline code: mono, `0.85em`, surface-secondary bg. Code blocks: mono, `13px`, `1.65` line height. Heading anchors: hover-reveal with copy feedback. Code copy button: absolute top-right, appears on hover.

---

## 21. Dark Mode

Class-based (`.dark` on `<html>`) with `localStorage` persistence and flash prevention script. Key shifts: accent lightens, overlays darken, shadows deepen, status colours lighten, blobs reduce opacity. See Section 3 for full dark token table.

---

## 22. Scrollbars

All apps use the same branded scrollbar: accent-tinted gradient thumbs, `10px` width, `border-radius: 999px`. This is a distinctive design touch that ties every app together visually, even in areas users don't consciously notice.

Imported via `@stuntrocket/ui/scrollbar.css`. See `tokens.css` for full CSS.

---

## 23. Focus & Accessibility

Focus ring: `outline: 2px solid accent/55%, offset: 2px`. Button focus (Kit): double-ring `box-shadow`. List row focus: inset `box-shadow`. Skip-to-content link. Text selection disabled on chrome, enabled in `.prose` and `[data-selectable]`. Selection colour: `accent-subtle`. ARIA: `role="status"` on toasts, `aria-live` on search, focus traps on modals, `aria-hidden` on decorative elements.

---

## 24. macOS Native Integration

Titlebar: `-webkit-app-region: drag` on topbar, `no-drag` on interactive children. Traffic light offset: `~76–78px` left padding. Transparency via Tauri `macOSPrivateApi: true`. Window hidden listener pauses ambient animations.

---

## 25. Ambient Background

All apps include the ambient background via `SAmbientBlobs`. The subtle warmth and motion is part of the visual identity — it's what makes the apps feel alive and premium rather than flat.

Three blurred circles (600/500/400px) drifting slowly (20–30s cycles) behind content at `opacity: 0.18` (light) / `0.10` (dark), `blur: 80px`. Colours: accent blue, `#8B5CF6` violet, `#06B6D4` cyan. Paused when window hidden. Disabled under `prefers-reduced-motion`.

---

## 26. Layout Blueprints

### Blueprint A: Content-Reading App

```text
┌──────────────────────────────────────────────────────┐
│  Topbar (52px, fixed, backdrop-blur, z-50)           │
├────────────┬─────────────────────────────────────────┤
│  Sidebar   │  Main Content (scrollable)              │
│  (resizable│  ┌───────────────────┬────────────┐     │
│  ~280px)   │  │ Article (flex-1)  │ Right side │     │
│            │  │ Breadcrumbs       │ (21rem)    │     │
│            │  │ Header card       │ sticky     │     │
│            │  │ Prose body        │ ToC/tools  │     │
│            │  └───────────────────┴────────────┘     │
└────────────┴─────────────────────────────────────────┘
```

### Blueprint B: Compact Utility App

```text
┌──────────────────────────────────────────────────────┐
│  STopbar (52px, fixed, backdrop-blur)                │
├────────┬──────────────┬──────────────────────────────┤
│Sidebar │ Master List  │ Inspector (260px, optional)  │
│(220px) │ (flex-1)     │ Metadata, actions            │
│        │ Section hdrs │ Field labels + values        │
│        │ List rows    │                              │
└────────┴──────────────┴──────────────────────────────┘
```

---

## 27. Z-Index Scale

| Layer | Z-Index |
|-------|---------|
| Ambient blobs | `1` |
| Content | `10` |
| Resize handle | `30` |
| Topbar | `50` |
| Settings modal | `50` |
| Collapsed sidebar toggle | `60` |
| Back-to-top | `70` |
| Dropdown menus | `100` |
| Command palette | `100` |
| Slide-over panels | `110` |
| Toast notifications | `150–200` |
| Confirm dialogs | `300` |

---

## 28. CSS Token Reference

The canonical token source is `src/css/tokens.css` in this repository. It is published as `@stuntrocket/ui/tokens.css` for consuming apps.

| Location | Description |
|----------|-------------|
| `src/css/tokens.css` | Design tokens — the single source of truth |
| `src/css/base.css` | Resets, focus rings, selection, micro-animations |
| `src/css/scrollbar.css` | Branded accent-tinted scrollbars |
| `src/css/ambient.css` | Background blob animations |
| `docs/COLOUR_SWATCHES.md` | Visual colour reference with swatches |

---

## 29. Implementation

### The `@stuntrocket/ui` Library

All Stuntrocket Tauri apps consume the shared component library:

```bash
npm install @stuntrocket/ui
```

**CSS imports** (in order, in your app's main CSS):
```css
@import '@stuntrocket/ui/tokens.css';    /* Design tokens + shared classes */
@import '@stuntrocket/ui/base.css';      /* Resets, focus, selection, micro-animations */
@import '@stuntrocket/ui/scrollbar.css'; /* Branded scrollbars */
@import '@stuntrocket/ui/ambient.css';   /* Background blob animations */
```

**Poppins font** in `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet">
```

**Components** (all `S`-prefixed):
```vue
<script setup>
import { SButton, SCard, SBadge, SModal, STopbar, SAmbientBlobs } from '@stuntrocket/ui'
</script>
```

### Starting a New App

1. Install `@stuntrocket/ui` and import all four CSS modules.
2. Add the Poppins Google Fonts `<link>`.
3. Add the dark mode flash prevention script in `<body>`.
4. Use `STopbar` for the titlebar and `SAmbientBlobs` for the background.
5. Build your views from `@stuntrocket/ui` components — do not create one-off styles.
6. If the library is missing a component you need, add it to the library, not your app.

### Quality Checklist

- [ ] Uses only `@stuntrocket/ui` tokens and components (no arbitrary hex values)
- [ ] Border opacity appropriate for context
- [ ] Hover and focus states on all interactive elements
- [ ] Transitions on all interactive elements (never instant state changes)
- [ ] `prefers-reduced-motion` respected
- [ ] Dark mode tested (light, dark, and system)
- [ ] Text selection: disabled on chrome, enabled in content
- [ ] Focus-visible ring on all interactive elements
- [ ] Z-index from the defined scale
- [ ] Poppins font loading confirmed
- [ ] Status colours used only for semantic meaning (never decorative)
- [ ] Ambient blobs present
- [ ] Branded scrollbars active
