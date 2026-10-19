# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@stuntrocket/ui` — shared Vue 3 + Tailwind CSS v4 component library for Stuntrocket's Tauri desktop app portfolio. Pure Vue + Tailwind with zero external UI dependencies. Published to the public npm registry.

## Commands

```bash
npm run dev:showcase    # Interactive component showcase on port 5188
npm run dev             # Library build with file watcher (vite build --watch)
npm run build           # Type-check (vue-tsc) + production build
npm run typecheck       # Type-check only (vue-tsc --noEmit)
npm run test            # Run all tests once (vitest run)
npm run test:watch      # Run tests in watch mode (vitest)
```

Run a single test file: `npx vitest run src/composables/useSearch.test.ts`

No linter is configured.

Publishing: bump version in `package.json`, `npm run build`, then `npm publish`.

## Architecture

### Component patterns

All components use `<script setup lang="ts">`. Every component exports a props interface (e.g. `SButtonProps`) alongside its default export in `src/index.ts`.

- **Styling**: Tailwind utility classes + CSS custom properties from `tokens.css`. No `<style scoped>` blocks — all styling is inline via class bindings
- **Slots**: Named slots for composition (`header`, `default`, `footer`, `actions`, `icon`)

### Design token system

`src/css/tokens.css` defines all design tokens inside a Tailwind `@theme` block plus `.dark` class overrides. Tokens use CSS custom properties (`--color-*`, `--space-*`, `--shadow-*`, etc.).

Dark mode uses the `.dark` class on `<html>`, not `prefers-color-scheme`. Components reference token variables, never hardcode colours.

Per-app accent colour override: `SThemeProvider` sets `--color-accent` on `:root`, and hover/subtle variants are derived automatically.

### CSS import order (matters for consumers)

```css
@import 'tailwindcss';
@import '@stuntrocket/ui/tokens.css';   /* Must be first */
@import '@stuntrocket/ui/base.css';
@import '@stuntrocket/ui/scrollbar.css';
@import '@stuntrocket/ui/ambient.css';
```

### Composable patterns

- `useToastStack()` — module-level singleton, all consumers share the same toast stack
- `useTheme()` — 3-mode cycling (light/dark/system), persists to localStorage, applies `.dark` class
- `useKeyboardShortcut()` — global keydown listener, ignores editable elements (INPUT, TEXTAREA, SELECT)
- `useFocusTrap()` — tab-wrapping within a container, restores previous focus on deactivation

## Conventions

- Peer dependencies: Vue 3.4+, Tailwind CSS 4.0+, Vue Router 4.0+
- Component file naming: `S` prefix (e.g. `SButton.vue`, `SModal.vue`)
- Component categories: `controls/`, `display/`, `feedback/`, `navigation/`, `overlay/`, `layout/`
- Consumed by 12 apps (Aug 2026) — breaking changes propagate; check before renaming props or tokens
