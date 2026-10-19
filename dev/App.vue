<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  // Controls
  SButton, SInput, SSelect, STextarea, SSegmentedControl, SSearchInput, SFormField,
  SIconButton, SInlineTextField, SViewToggle, SSearchFilterBar, SCheckbox, SToggle,
  // Display
  SCard, SBadge, STag, SStatusDot, SKbd, SListRow, SSectionHeader, SHeading, SText,
  SDivider, SAvatar, SProse, SSparkline, SScoreBar, SCodeEditor, SKpiCard, SBarChart,
  SHeatmapCalendar,
  // Feedback
  SToast, SSkeleton, SSkeletonText, SSpinner, SEmptyState, SNoticeBanner, SProgressBar,
  SToastContainer, SRouteProgressBar,
  // Navigation
  SSidebarLink, SBreadcrumbs, SBackToTop,
  // Overlay
  SModal, SConfirmDialog, SCommandPalette, SDropdownMenu, STooltip,
  SKeyboardShortcuts, SRowActionMenu, SPanel, SImageLightbox,
  // Layout
  SAmbientBlobs, STopbar, SSidebar, SResizableSplit, SPageHeader, SAppShell,
  // Composables
  useToastStack,
} from '../src/index'

// Dark mode toggle
const isDark = ref(document.documentElement.classList.contains('dark'))

function toggleDarkMode() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('stuntrocket-ui-dark', String(isDark.value))
}

// Toast stack (composable)
const { success: toastSuccess, error: toastError, info: toastInfo, warning: toastWarning } = useToastStack()

// Search input state
const searchValue = ref('')

// Form field state
const formFieldValue = ref('')
const formFieldError = ref('')

// Progress bar state
const progressValue = ref(65)

// Dropdown menu state
const dropdownItems = [
  { label: 'Edit', value: 'edit' },
  { label: 'Duplicate', value: 'duplicate' },
  { label: 'Archive', value: 'archive' },
  { label: 'Delete', value: 'delete', danger: true },
]

function onDropdownSelect(v: string) {
  toastInfo(`Selected: ${v}`)
}

// Form state
const inputValue = ref('')
const disabledInputValue = ref('Cannot edit this')
const selectValue = ref('option-1')
const textareaValue = ref('')
const segmentValue = ref('grid')

// Toast state
const showSuccessToast = ref(true)
const showErrorToast = ref(true)
const showInfoToast = ref(true)

// Modal state
const modalOpen = ref(false)
const confirmOpen = ref(false)
const confirmDangerOpen = ref(false)
const paletteOpen = ref(false)

// Tag state
const tagActive = ref(false)

// List row state
const selectedRow = ref<number | null>(null)

// Back to top
const showBackToTop = ref(true)

// --- New component state ---

// SInlineTextField
const inlineTextValue = ref('Click to edit')
const inlineTextEmpty = ref('')
const inlineTextError = ref('Has error')

// SViewToggle
const viewToggleValue = ref('cards')

// SSearchFilterBar
const filterBarSearch = ref('')
const filterBarActive = ref('all')

// SCheckbox
const checkboxChecked = ref(true)
const checkboxUnchecked = ref(false)
const checkboxDisabled = ref(false)
const checkboxDanger = ref(true)

// SToggle
const toggleOn = ref(true)
const toggleOff = ref(false)
const toggleDisabled = ref(false)

// SIconButton
const iconButtonActive = ref(false)

// SRouteProgressBar
const routeLoading = ref(false)

// SPanel
const panelOpen = ref(false)

// SKeyboardShortcuts
const shortcutsOpen = ref(false)
const shortcutGroups = [
  {
    title: 'General',
    shortcuts: [
      { keys: '⌘ + K', description: 'Open command palette' },
      { keys: '⌘ + \\', description: 'Toggle sidebar' },
      { keys: '⌘ + ,', description: 'Open settings' },
    ],
  },
  {
    title: 'Editor',
    shortcuts: [
      { keys: '⌘ + S', description: 'Save changes' },
      { keys: '⌘ + Z', description: 'Undo' },
      { keys: '⌘ + ⇧ + Z', description: 'Redo' },
    ],
  },
  {
    title: 'Navigation',
    shortcuts: [
      { keys: '⌘ + ↑', description: 'Go to top' },
      { keys: '⌘ + ↓', description: 'Go to bottom' },
      { keys: 'Esc', description: 'Close panel' },
    ],
  },
]

// SImageLightbox
const lightboxOpen = ref(false)

// SRowActionMenu
const rowActions = [
  { label: 'View details', value: 'view' },
  { label: 'Edit', value: 'edit' },
  { label: 'Duplicate', value: 'duplicate' },
  { label: 'Delete', value: 'delete', danger: true },
]

// SBarChart data
const barChartData = [
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 19 },
  { label: 'Wed', value: 8 },
  { label: 'Thu', value: 24 },
  { label: 'Fri', value: 16 },
  { label: 'Sat', value: 5 },
  { label: 'Sun', value: 10 },
]

// SHeatmapCalendar — generate sample activity data for past 112 days
const heatmapCounts = computed(() => {
  const counts: Record<string, number> = {}
  const today = new Date()
  for (let i = 0; i < 112; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    // Pseudo-random activity based on the day
    const hash = (d.getDate() * 7 + d.getMonth() * 13) % 10
    counts[key] = hash < 3 ? 0 : hash < 5 ? 1 : hash < 7 ? 3 : hash < 9 ? 5 : 8
  }
  return counts
})

// SCodeEditor sample
const sampleCode = `import { ref } from 'vue'
import { useToastStack } from '@stuntrocket/ui'

const { success, error } = useToastStack()

function handleSave() {
  try {
    await saveDocument()
    success('Document saved')
  } catch (e) {
    error('Failed to save')
  }
}`
</script>

<template>
  <!-- Ambient background -->
  <SAmbientBlobs />

  <!-- Route progress bar (fixed at top) -->
  <SRouteProgressBar :loading="routeLoading" />

  <!-- Dark mode toggle — fixed top-right -->
  <button
    class="fixed top-4 right-4 z-[100] flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface/80 backdrop-blur-sm text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors duration-150"
    @click="toggleDarkMode"
    title="Toggle dark mode"
  >
    <svg v-if="isDark" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
    <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
  </button>

  <!-- Main content -->
  <div class="relative z-10 mx-auto max-w-4xl px-6 py-12 pb-24" data-selectable>

    <!-- Page header -->
    <header class="mb-16 text-centre">
      <h1 class="text-3xl font-semibold text-text-primary tracking-tight">
        Stuntrocket UI
      </h1>
      <p class="mt-2 text-sm text-text-secondary">
        Component showcase — 57 components across 6 categories
      </p>
    </header>


    <!-- ═══════════════════════════════════════════════
         TYPOGRAPHY
         ═══════════════════════════════════════════════ -->
    <section class="mb-16">
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-text-primary">Typography</h2>
        <p class="mt-1 text-sm text-text-secondary">
          Consistent headings and text across all apps — enforced sizes, weights, tracking, and leading.
        </p>
      </div>
      <div class="h-px bg-border/60 mb-8" />

      <!-- SHeading -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SHeading</h3>
        <div class="space-y-4">
          <SHeading :level="1">Page Title (H1)</SHeading>
          <SHeading :level="2">Section Heading (H2)</SHeading>
          <SHeading :level="3">Sub-Section (H3)</SHeading>
          <SHeading :level="4">Label Heading (H4)</SHeading>
        </div>
      </div>

      <!-- SText -->
      <div>
        <h3 class="text-sm font-medium text-text-secondary mb-4">SText</h3>

        <p class="text-xs text-text-secondary/70 mb-2">Sizes</p>
        <div class="space-y-3 mb-6">
          <SText size="body">Body (15px) — The primary reading size for content-heavy views. Comfortable line height for sustained reading.</SText>
          <SText size="compact">Compact (13px) — Default for utility interfaces, list views, and tool panels. Tighter but still readable.</SText>
          <SText size="small">Small (12px) — Secondary labels, button text, descriptions alongside primary content.</SText>
          <SText size="xs">XS (11px) — Micro labels, section headers, field labels in inspector panels.</SText>
        </div>

        <p class="text-xs text-text-secondary/70 mb-2">Colours</p>
        <div class="flex flex-wrap items-baseline gap-4 mb-6">
          <SText size="compact" color="primary" as="span">Primary</SText>
          <SText size="compact" color="secondary" as="span">Secondary</SText>
          <SText size="compact" color="tertiary" as="span">Tertiary</SText>
          <SText size="compact" color="accent" as="span">Accent</SText>
          <SText size="compact" color="success" as="span">Success</SText>
          <SText size="compact" color="warning" as="span">Warning</SText>
          <SText size="compact" color="danger" as="span">Danger</SText>
        </div>

        <p class="text-xs text-text-secondary/70 mb-2">Variants</p>
        <div class="space-y-2">
          <SText size="compact" :medium="true">Medium weight — for emphasis within body text</SText>
          <SText size="compact" :mono="true" color="secondary">Monospace — for paths, code, and technical values</SText>
          <SText size="compact" color="secondary" leading="relaxed">Relaxed leading — for longer prose paragraphs that need breathing room between lines for comfortable reading.</SText>
        </div>
      </div>
    </section>


    <!-- ═══════════════════════════════════════════════
         CONTROLS
         ═══════════════════════════════════════════════ -->
    <section class="mb-16">
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-text-primary">Controls</h2>
        <p class="mt-1 text-sm text-text-secondary">
          Interactive form elements — buttons, inputs, selects, textareas, toggles, and more.
        </p>
      </div>
      <div class="h-px bg-border/60 mb-8" />

      <!-- SButton -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SButton</h3>

        <!-- Variants -->
        <p class="text-xs text-text-secondary/70 mb-2">Variants</p>
        <div class="flex flex-wrap items-center gap-3 mb-6">
          <SButton variant="primary">Primary</SButton>
          <SButton variant="secondary">Secondary</SButton>
          <SButton variant="icon">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </SButton>
        </div>

        <!-- Sizes -->
        <p class="text-xs text-text-secondary/70 mb-2">Sizes</p>
        <div class="flex flex-wrap items-center gap-3 mb-6">
          <SButton variant="primary" size="sm">Small</SButton>
          <SButton variant="primary" size="md">Medium</SButton>
          <SButton variant="primary" size="lg">Large</SButton>
        </div>
        <div class="flex flex-wrap items-center gap-3 mb-6">
          <SButton variant="secondary" size="sm">Small</SButton>
          <SButton variant="secondary" size="md">Medium</SButton>
          <SButton variant="secondary" size="lg">Large</SButton>
        </div>

        <!-- States -->
        <p class="text-xs text-text-secondary/70 mb-2">States</p>
        <div class="flex flex-wrap items-center gap-3">
          <SButton variant="primary" :disabled="true">Disabled</SButton>
          <SButton variant="primary" :loading="true">Loading</SButton>
          <SButton variant="secondary" :disabled="true">Disabled</SButton>
          <SButton variant="secondary" :loading="true">Loading</SButton>
        </div>
      </div>

      <!-- SIconButton -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SIconButton</h3>

        <p class="text-xs text-text-secondary/70 mb-2">Variants</p>
        <div class="flex flex-wrap items-center gap-3 mb-4">
          <SIconButton variant="ghost" tooltip="Ghost">
            <svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </SIconButton>
          <SIconButton variant="secondary" tooltip="Secondary">
            <svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
            </svg>
          </SIconButton>
          <SIconButton variant="danger" tooltip="Danger">
            <svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </SIconButton>
          <SIconButton variant="success" tooltip="Success">
            <svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </SIconButton>
        </div>

        <p class="text-xs text-text-secondary/70 mb-2">Sizes</p>
        <div class="flex flex-wrap items-center gap-3 mb-4">
          <SIconButton variant="ghost" size="sm" tooltip="Small">
            <svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </SIconButton>
          <SIconButton variant="ghost" size="md" tooltip="Medium">
            <svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </SIconButton>
          <SIconButton variant="ghost" size="lg" tooltip="Large">
            <svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </SIconButton>
        </div>

        <p class="text-xs text-text-secondary/70 mb-2">States</p>
        <div class="flex flex-wrap items-center gap-3">
          <SIconButton variant="ghost" :loading="true" tooltip="Loading">
            <svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </SIconButton>
          <SIconButton variant="ghost" :disabled="true" tooltip="Disabled">
            <svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </SIconButton>
          <SIconButton variant="ghost" :active="true" tooltip="Active">
            <svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </SIconButton>
        </div>
      </div>

      <!-- SInput -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SInput</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-text-secondary/70 mb-2">Default</p>
            <SInput v-model="inputValue" placeholder="Type something..." />
          </div>
          <div>
            <p class="text-xs text-text-secondary/70 mb-2">Disabled</p>
            <SInput v-model="disabledInputValue" :disabled="true" />
          </div>
          <div>
            <p class="text-xs text-text-secondary/70 mb-2">Password</p>
            <SInput model-value="" type="password" placeholder="Enter password..." />
          </div>
          <div>
            <p class="text-xs text-text-secondary/70 mb-2">Email</p>
            <SInput model-value="" type="email" placeholder="you@example.com" />
          </div>
        </div>
      </div>

      <!-- SInlineTextField -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SInlineTextField</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-text-secondary/70 mb-2">Default (click to edit)</p>
            <SInlineTextField v-model="inlineTextValue" placeholder="Enter a name..." />
          </div>
          <div>
            <p class="text-xs text-text-secondary/70 mb-2">Empty with placeholder</p>
            <SInlineTextField v-model="inlineTextEmpty" placeholder="Click to add title..." />
          </div>
          <div>
            <p class="text-xs text-text-secondary/70 mb-2">With error</p>
            <SInlineTextField v-model="inlineTextError" error="Name is required" />
          </div>
          <div>
            <p class="text-xs text-text-secondary/70 mb-2">Disabled</p>
            <SInlineTextField model-value="Cannot edit" :disabled="true" />
          </div>
        </div>
      </div>

      <!-- SSelect -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SSelect</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-text-secondary/70 mb-2">Default (md)</p>
            <SSelect v-model="selectValue">
              <option value="option-1">Option One</option>
              <option value="option-2">Option Two</option>
              <option value="option-3">Option Three</option>
            </SSelect>
          </div>
          <div>
            <p class="text-xs text-text-secondary/70 mb-2">Small (sm)</p>
            <SSelect v-model="selectValue" size="sm">
              <option value="option-1">Option One</option>
              <option value="option-2">Option Two</option>
              <option value="option-3">Option Three</option>
            </SSelect>
          </div>
          <div>
            <p class="text-xs text-text-secondary/70 mb-2">Disabled</p>
            <SSelect model-value="option-1" :disabled="true">
              <option value="option-1">Cannot change</option>
            </SSelect>
          </div>
        </div>
      </div>

      <!-- STextarea -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">STextarea</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-text-secondary/70 mb-2">Default</p>
            <STextarea v-model="textareaValue" placeholder="Write something..." :rows="3" />
          </div>
          <div>
            <p class="text-xs text-text-secondary/70 mb-2">Disabled</p>
            <STextarea model-value="This content is read-only." :disabled="true" :rows="3" />
          </div>
        </div>
      </div>

      <!-- SSegmentedControl -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SSegmentedControl</h3>
        <div class="flex flex-col gap-4">
          <div>
            <p class="text-xs text-text-secondary/70 mb-2">View mode toggle</p>
            <SSegmentedControl
              v-model="segmentValue"
              :options="[
                { value: 'grid', label: 'Grid' },
                { value: 'list', label: 'List' },
                { value: 'table', label: 'Table' },
              ]"
            />
            <p class="text-xs text-text-secondary mt-2">Selected: {{ segmentValue }}</p>
          </div>
        </div>
      </div>

      <!-- SViewToggle -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SViewToggle</h3>
        <div class="flex flex-col gap-4">
          <div>
            <p class="text-xs text-text-secondary/70 mb-2">With labels</p>
            <SViewToggle
              v-model="viewToggleValue"
              :options="[
                { value: 'cards', label: 'Cards' },
                { value: 'list', label: 'List' },
                { value: 'compact', label: 'Compact' },
              ]"
            />
            <p class="text-xs text-text-secondary mt-2">Selected: {{ viewToggleValue }}</p>
          </div>
          <div>
            <p class="text-xs text-text-secondary/70 mb-2">With scoped slot icons</p>
            <SViewToggle
              v-model="viewToggleValue"
              :options="[
                { value: 'cards', label: 'Cards' },
                { value: 'list', label: 'List' },
              ]"
            >
              <template #option="{ option, active }">
                <svg v-if="option.value === 'cards'" class="w-3.5 h-3.5 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
                <svg v-else class="w-3.5 h-3.5 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                </svg>
                {{ option.label }}
              </template>
            </SViewToggle>
          </div>
        </div>
      </div>

      <!-- SSearchInput -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SSearchInput</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-text-secondary/70 mb-2">Default</p>
            <SSearchInput v-model="searchValue" placeholder="Search components..." />
          </div>
          <div>
            <p class="text-xs text-text-secondary/70 mb-2">Compact</p>
            <SSearchInput v-model="searchValue" :compact="true" placeholder="Quick search..." />
          </div>
        </div>
      </div>

      <!-- SSearchFilterBar -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SSearchFilterBar</h3>
        <SSearchFilterBar
          v-model="filterBarSearch"
          :filters="[
            { label: 'All', value: 'all' },
            { label: 'Active', value: 'active' },
            { label: 'Archived', value: 'archived' },
          ]"
          :active-filter="filterBarActive"
          placeholder="Search items..."
          @update:active-filter="filterBarActive = $event"
        />
        <p class="text-xs text-text-secondary mt-2">Filter: {{ filterBarActive }} | Search: "{{ filterBarSearch }}"</p>
      </div>

      <!-- SCheckbox -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SCheckbox</h3>
        <div class="grid grid-cols-2 gap-4">
          <SCheckbox v-model="checkboxChecked" label="Checked" description="This checkbox is ticked on" />
          <SCheckbox v-model="checkboxUnchecked" label="Unchecked" description="This checkbox is ticked off" />
          <SCheckbox v-model="checkboxDisabled" label="Disabled" description="Cannot interact with this one" :disabled="true" />
          <SCheckbox v-model="checkboxDanger" label="Remove all data" description="This action is destructive" :danger="true" />
        </div>
      </div>

      <!-- SToggle -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SToggle</h3>
        <div class="grid grid-cols-2 gap-4">
          <SToggle v-model="toggleOn" label="Notifications" description="Receive push notifications for updates" />
          <SToggle v-model="toggleOff" label="Dark mode" description="Use dark theme across the application" />
          <SToggle v-model="toggleDisabled" label="Maintenance" description="Cannot be changed while active" :disabled="true" />
        </div>
      </div>

      <!-- SFormField -->
      <div>
        <h3 class="text-sm font-medium text-text-secondary mb-4">SFormField</h3>
        <div class="grid grid-cols-2 gap-4">
          <SFormField label="Email address" hint="We'll never share your email.">
            <SInput v-model="formFieldValue" type="email" placeholder="you@example.com" />
          </SFormField>
          <SFormField label="Username" :required="true" error="Username is already taken.">
            <SInput model-value="danny" />
          </SFormField>
        </div>
      </div>
    </section>


    <!-- ═══════════════════════════════════════════════
         DISPLAY
         ═══════════════════════════════════════════════ -->
    <section class="mb-16">
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-text-primary">Display</h2>
        <p class="mt-1 text-sm text-text-secondary">
          Presentational components — cards, badges, charts, and data visualisation.
        </p>
      </div>
      <div class="h-px bg-border/60 mb-8" />

      <!-- SCard -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SCard</h3>

        <p class="text-xs text-text-secondary/70 mb-2">Variants</p>
        <div class="grid grid-cols-2 gap-4 mb-6">
          <SCard variant="content">
            <p class="text-sm font-medium text-text-primary mb-1">Content Card</p>
            <p class="text-xs text-text-secondary">The default card variant with backdrop blur and shadow.</p>
          </SCard>
          <SCard variant="sidebar">
            <p class="text-sm font-medium text-text-primary mb-1">Sidebar Card</p>
            <p class="text-xs text-text-secondary">Floating sidebar style with compact padding.</p>
          </SCard>
          <SCard variant="list">
            <p class="text-sm font-medium text-text-primary mb-1">List Card</p>
            <p class="text-xs text-text-secondary">For list items and rows.</p>
          </SCard>
          <SCard variant="nested">
            <p class="text-sm font-medium text-text-primary mb-1">Nested Card</p>
            <p class="text-xs text-text-secondary">For nested content within other cards.</p>
          </SCard>
        </div>

        <p class="text-xs text-text-secondary/70 mb-2">Hoverable</p>
        <div class="grid grid-cols-3 gap-4">
          <SCard variant="list" :hoverable="true">
            <p class="text-sm font-medium text-text-primary">Hoverable List Item</p>
            <p class="text-xs text-text-secondary">Hover to see the effect</p>
          </SCard>
          <SCard variant="list" :hoverable="true">
            <p class="text-sm font-medium text-text-primary">Hoverable List Item</p>
            <p class="text-xs text-text-secondary">Hover to see the effect</p>
          </SCard>
          <SCard variant="list" :hoverable="true">
            <p class="text-sm font-medium text-text-primary">Hoverable List Item</p>
            <p class="text-xs text-text-secondary">Hover to see the effect</p>
          </SCard>
        </div>
      </div>

      <!-- SBadge -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SBadge</h3>

        <p class="text-xs text-text-secondary/70 mb-2">All variants</p>
        <div class="flex flex-wrap items-center gap-3">
          <SBadge variant="default">Default</SBadge>
          <SBadge variant="accent">Accent</SBadge>
          <SBadge variant="success">Success</SBadge>
          <SBadge variant="warning">Warning</SBadge>
          <SBadge variant="error">Error</SBadge>
          <SBadge variant="count">42</SBadge>
        </div>
      </div>

      <!-- STag -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">STag</h3>
        <div class="flex flex-wrap items-center gap-3">
          <STag :interactive="true" @click="tagActive = !tagActive">
            Interactive Tag (click me)
          </STag>
          <STag :interactive="true">vue</STag>
          <STag :interactive="true">typescript</STag>
          <STag :interactive="true">tailwind</STag>
          <STag :interactive="false">Non-interactive</STag>
        </div>
      </div>

      <!-- SStatusDot -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SStatusDot</h3>
        <p class="text-xs text-text-secondary/70 mb-2">Variants (md)</p>
        <div class="flex items-center gap-4 mb-4">
          <div class="flex items-center gap-2"><SStatusDot variant="success" /> <span class="text-xs text-text-secondary">Success</span></div>
          <div class="flex items-center gap-2"><SStatusDot variant="warning" /> <span class="text-xs text-text-secondary">Warning</span></div>
          <div class="flex items-center gap-2"><SStatusDot variant="danger" /> <span class="text-xs text-text-secondary">Danger</span></div>
          <div class="flex items-center gap-2"><SStatusDot variant="accent" /> <span class="text-xs text-text-secondary">Accent</span></div>
          <div class="flex items-center gap-2"><SStatusDot variant="neutral" /> <span class="text-xs text-text-secondary">Neutral</span></div>
        </div>
        <p class="text-xs text-text-secondary/70 mb-2">Sizes</p>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2"><SStatusDot variant="success" size="sm" /> <span class="text-xs text-text-secondary">sm</span></div>
          <div class="flex items-center gap-2"><SStatusDot variant="success" size="md" /> <span class="text-xs text-text-secondary">md</span></div>
        </div>
      </div>

      <!-- SKbd -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SKbd</h3>
        <div class="flex items-center gap-3">
          <SKbd>⌘K</SKbd>
          <SKbd>Esc</SKbd>
          <SKbd>⌘⇧A</SKbd>
          <SKbd>Enter</SKbd>
          <SKbd>⌘\</SKbd>
        </div>
      </div>

      <!-- SListRow -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SListRow</h3>
        <SCard variant="content">
          <SSectionHeader title="Skills" :count="4" action-label="Add" @action="() => {}" />
          <div class="flex flex-col gap-0.5">
            <SListRow :selected="selectedRow === 0" @click="selectedRow = 0">
              <template #default>
                <SStatusDot variant="success" />
                <span class="text-sm text-text-primary">code-review</span>
                <SBadge variant="accent">linked</SBadge>
              </template>
              <template #actions>
                <span class="text-xs text-text-secondary">v1.2.0</span>
              </template>
            </SListRow>
            <SListRow :selected="selectedRow === 1" @click="selectedRow = 1">
              <template #default>
                <SStatusDot variant="warning" />
                <span class="text-sm text-text-primary">debugging</span>
                <SBadge variant="warning">local</SBadge>
              </template>
              <template #actions>
                <span class="text-xs text-text-secondary">v0.3.1</span>
              </template>
            </SListRow>
            <SListRow :selected="selectedRow === 2" @click="selectedRow = 2">
              <template #default>
                <SStatusDot variant="danger" />
                <span class="text-sm text-text-primary">tdd-workflow</span>
                <SBadge variant="error">broken</SBadge>
              </template>
              <template #actions>
                <span class="text-xs text-text-secondary">v2.0.0</span>
              </template>
            </SListRow>
            <SListRow :disabled="true">
              <template #default>
                <SStatusDot variant="neutral" />
                <span class="text-sm text-text-primary">archived-skill</span>
                <SBadge variant="default">archived</SBadge>
              </template>
            </SListRow>
          </div>
        </SCard>
      </div>

      <!-- SSectionHeader -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SSectionHeader</h3>
        <div class="flex flex-col gap-2">
          <SSectionHeader title="Recent Documents" :count="12" />
          <SSectionHeader title="Bookmarks" :count="3" action-label="Manage" @action="() => {}" />
          <SSectionHeader title="No Count Example" />
        </div>
      </div>

      <!-- SDivider -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SDivider</h3>
        <p class="text-xs text-text-secondary/70 mb-2">Horizontal</p>
        <SDivider />
        <p class="text-xs text-text-secondary/70 mt-4 mb-2">Horizontal (subtle)</p>
        <SDivider :subtle="true" />
        <p class="text-xs text-text-secondary/70 mt-4 mb-2">Vertical</p>
        <div class="flex items-center gap-3 h-8">
          <span class="text-sm text-text-secondary">Left</span>
          <SDivider orientation="vertical" />
          <span class="text-sm text-text-secondary">Centre</span>
          <SDivider orientation="vertical" :subtle="true" />
          <span class="text-sm text-text-secondary">Right</span>
        </div>
      </div>

      <!-- SAvatar -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SAvatar</h3>
        <p class="text-xs text-text-secondary/70 mb-2">Sizes</p>
        <div class="flex items-center gap-4 mb-4">
          <SAvatar name="Danny Harding" size="sm" />
          <SAvatar name="Danny Harding" size="md" />
          <SAvatar name="Danny Harding" size="lg" />
        </div>
        <p class="text-xs text-text-secondary/70 mb-2">Variants</p>
        <div class="flex items-center gap-4">
          <SAvatar name="Alice Bright" variant="accent" />
          <SAvatar name="Bob Carter" variant="neutral" />
          <SAvatar name="Clara Dunn" variant="accent" size="lg" />
        </div>
      </div>

      <!-- SSparkline -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SSparkline</h3>
        <div class="flex items-center gap-8">
          <div>
            <p class="text-xs text-text-secondary/70 mb-2">Default</p>
            <SSparkline :values="[4, 7, 3, 8, 5, 9, 2, 6, 8, 4, 7, 10, 6, 3]" />
          </div>
          <div>
            <p class="text-xs text-text-secondary/70 mb-2">Gradient</p>
            <SSparkline :values="[2, 5, 3, 8, 6, 9, 4, 7, 10, 5, 8, 3]" :gradient="true" />
          </div>
          <div>
            <p class="text-xs text-text-secondary/70 mb-2">Custom colour</p>
            <SSparkline :values="[1, 4, 2, 8, 5, 7, 3, 6, 9, 4]" color="var(--color-success)" :stroke-width="2" />
          </div>
        </div>
      </div>

      <!-- SScoreBar -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SScoreBar</h3>
        <div class="flex flex-col gap-4 max-w-md">
          <SScoreBar :value="0.85" label="Performance" :show-value="true" />
          <SScoreBar :value="0.52" label="Coverage" :show-value="true" />
          <SScoreBar :value="0.18" label="Errors" :show-value="true" />
        </div>
        <p class="text-xs text-text-secondary/70 mt-4 mb-2">Sizes</p>
        <div class="flex flex-col gap-3 max-w-md">
          <SScoreBar :value="0.7" label="sm" size="sm" :show-value="true" />
          <SScoreBar :value="0.7" label="md" size="md" :show-value="true" />
        </div>
      </div>

      <!-- SCodeEditor -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SCodeEditor</h3>
        <p class="text-xs text-text-secondary/70 mb-2">With line numbers</p>
        <SCodeEditor :code="sampleCode" :line-numbers="true" />
        <p class="text-xs text-text-secondary/70 mt-4 mb-2">Without line numbers</p>
        <SCodeEditor code="npm install @stuntrocket/ui" :line-numbers="false" />
      </div>

      <!-- SKpiCard -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SKpiCard</h3>
        <div class="grid grid-cols-3 gap-4">
          <SKpiCard label="Total Users" value="12,847">
            <template #icon>
              <svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </template>
          </SKpiCard>
          <SKpiCard label="Revenue" value="$48.2K">
            <template #icon>
              <svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </template>
          </SKpiCard>
          <SKpiCard label="Uptime" value="99.97%">
            <template #icon>
              <svg class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </template>
          </SKpiCard>
        </div>
      </div>

      <!-- SBarChart -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SBarChart</h3>
        <SCard variant="content">
          <p class="text-xs text-text-secondary/70 mb-3">Weekly activity</p>
          <SBarChart :data="barChartData" :height="100" :highlight-last="true" />
          <div class="flex justify-between mt-2">
            <span v-for="d in barChartData" :key="d.label" class="text-[10px] text-text-secondary/60">{{ d.label }}</span>
          </div>
        </SCard>
      </div>

      <!-- SHeatmapCalendar -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SHeatmapCalendar</h3>
        <SCard variant="content">
          <p class="text-xs text-text-secondary/70 mb-3">Activity over the past 16 weeks</p>
          <SHeatmapCalendar :counts="heatmapCounts" :weeks="16" :cell-size="11" tooltip-suffix="commits" />
        </SCard>
      </div>

      <!-- SProse -->
      <div>
        <h3 class="text-sm font-medium text-text-secondary mb-4">SProse</h3>
        <SCard variant="content">
          <SProse>
            <h3>Rich Content Example</h3>
            <p>The <code>SProse</code> component wraps long-form content with proper typography styles, inheriting from <code>@tailwindcss/typography</code>.</p>
            <ul>
              <li>Headings with tight tracking</li>
              <li>Relaxed line height for body text</li>
              <li>Styled code and blockquotes</li>
            </ul>
          </SProse>
        </SCard>
      </div>
    </section>


    <!-- ═══════════════════════════════════════════════
         FEEDBACK
         ═══════════════════════════════════════════════ -->
    <section class="mb-16">
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-text-primary">Feedback</h2>
        <p class="mt-1 text-sm text-text-secondary">
          State indicators — toasts, skeletons, spinners, progress bars, and empty states.
        </p>
      </div>
      <div class="h-px bg-border/60 mb-8" />

      <!-- SToast -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SToast</h3>

        <div class="flex flex-wrap gap-3 mb-4">
          <SButton variant="secondary" size="sm" @click="showSuccessToast = true; showErrorToast = true; showInfoToast = true">
            Reset Toasts
          </SButton>
        </div>

        <div class="flex flex-col gap-3">
          <SToast variant="success" :visible="showSuccessToast" @dismiss="showSuccessToast = false">
            Changes saved successfully (click to dismiss)
          </SToast>
          <SToast variant="error" :visible="showErrorToast" @dismiss="showErrorToast = false">
            Something went wrong (click to dismiss)
          </SToast>
          <SToast variant="info" :visible="showInfoToast" @dismiss="showInfoToast = false">
            New version available (click to dismiss)
          </SToast>
        </div>
      </div>

      <!-- SSkeleton -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SSkeleton</h3>

        <p class="text-xs text-text-secondary/70 mb-2">Various sizes</p>
        <div class="flex flex-col gap-3 max-w-md">
          <SSkeleton width="100%" height="1rem" />
          <SSkeleton width="75%" height="1rem" />
          <SSkeleton width="50%" height="1rem" />
        </div>

        <p class="text-xs text-text-secondary/70 mt-4 mb-2">Card placeholder</p>
        <SCard variant="content">
          <div class="flex flex-col gap-3">
            <SSkeleton width="40%" height="1.25rem" />
            <SSkeleton width="100%" height="0.875rem" />
            <SSkeleton width="90%" height="0.875rem" />
            <SSkeleton width="60%" height="0.875rem" />
          </div>
        </SCard>
      </div>

      <!-- SSkeletonText -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SSkeletonText</h3>
        <div class="grid grid-cols-3 gap-6">
          <div>
            <p class="text-xs text-text-secondary/70 mb-2">Varied (default)</p>
            <SSkeletonText :lines="4" width="varied" />
          </div>
          <div>
            <p class="text-xs text-text-secondary/70 mb-2">Full width</p>
            <SSkeletonText :lines="3" width="full" />
          </div>
          <div>
            <p class="text-xs text-text-secondary/70 mb-2">Short</p>
            <SSkeletonText :lines="2" width="short" />
          </div>
        </div>
        <p class="text-xs text-text-secondary/70 mt-4 mb-2">Sizes</p>
        <div class="grid grid-cols-4 gap-6">
          <div>
            <p class="text-xs text-text-secondary/60 mb-2">xs</p>
            <SSkeletonText :lines="2" size="xs" />
          </div>
          <div>
            <p class="text-xs text-text-secondary/60 mb-2">sm</p>
            <SSkeletonText :lines="2" size="sm" />
          </div>
          <div>
            <p class="text-xs text-text-secondary/60 mb-2">md</p>
            <SSkeletonText :lines="2" size="md" />
          </div>
          <div>
            <p class="text-xs text-text-secondary/60 mb-2">lg</p>
            <SSkeletonText :lines="2" size="lg" />
          </div>
        </div>
      </div>

      <!-- SSpinner -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SSpinner</h3>

        <p class="text-xs text-text-secondary/70 mb-2">Sizes</p>
        <div class="flex items-center gap-6">
          <div class="flex flex-col items-center gap-2">
            <SSpinner size="sm" />
            <span class="text-xs text-text-secondary">sm</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SSpinner size="md" />
            <span class="text-xs text-text-secondary">md</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <SSpinner size="lg" />
            <span class="text-xs text-text-secondary">lg</span>
          </div>
        </div>
      </div>

      <!-- SEmptyState -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SEmptyState</h3>

        <div class="grid grid-cols-2 gap-4">
          <SCard variant="content">
            <SEmptyState
              title="No documents"
              description="Start by adding your first document to the collection."
            />
          </SCard>

          <SCard variant="content">
            <SEmptyState
              title="No results found"
              description="Try adjusting your search query."
            >
              <template #icon>
                <svg class="w-10 h-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </template>
              <template #action>
                <SButton variant="secondary" size="sm">Clear Search</SButton>
              </template>
            </SEmptyState>
          </SCard>
        </div>
      </div>

      <!-- SProgressBar -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SProgressBar</h3>

        <p class="text-xs text-text-secondary/70 mb-2">Variants</p>
        <div class="flex flex-col gap-3 mb-4">
          <SProgressBar :value="progressValue" variant="accent" />
          <SProgressBar :value="progressValue" variant="success" />
          <SProgressBar :value="45" variant="warning" />
          <SProgressBar :value="30" variant="danger" />
        </div>

        <p class="text-xs text-text-secondary/70 mb-2">Sizes</p>
        <div class="flex flex-col gap-3 mb-4">
          <SProgressBar :value="progressValue" size="sm" />
          <SProgressBar :value="progressValue" size="md" />
        </div>

        <p class="text-xs text-text-secondary/70 mb-2">Indeterminate</p>
        <SProgressBar :value="0" :indeterminate="true" />
      </div>

      <!-- SRouteProgressBar -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SRouteProgressBar</h3>
        <p class="text-xs text-text-secondary mb-3">
          A thin accent-coloured bar fixed to the top of the viewport. Simulates route navigation loading.
          Click the button below and watch the top of the page.
        </p>
        <div class="flex gap-3">
          <SButton
            variant="secondary"
            size="sm"
            @click="routeLoading = true; setTimeout(() => routeLoading = false, 1500)"
          >
            Simulate route loading
          </SButton>
        </div>
      </div>

      <!-- SToastContainer -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SToastContainer</h3>
        <p class="text-xs text-text-secondary mb-3">
          The toast container auto-renders toasts from the <code class="px-1 py-0.5 rounded bg-surface-secondary text-xs font-mono">useToastStack()</code> composable.
          Click the buttons to trigger live toasts in the bottom-right corner.
        </p>
        <div class="flex flex-wrap gap-3">
          <SButton variant="primary" size="sm" @click="toastSuccess('Changes saved successfully')">Success Toast</SButton>
          <SButton variant="secondary" size="sm" @click="toastError('Something went wrong')">Error Toast</SButton>
          <SButton variant="secondary" size="sm" @click="toastInfo('New version available')">Info Toast</SButton>
          <SButton variant="secondary" size="sm" @click="toastWarning('Disk space running low')">Warning Toast</SButton>
        </div>
      </div>

      <!-- SNoticeBanner -->
      <div>
        <h3 class="text-sm font-medium text-text-secondary mb-4">SNoticeBanner</h3>
        <div class="flex flex-col gap-3">
          <SNoticeBanner variant="info">
            A new version of the application is available. Restart to update.
          </SNoticeBanner>
          <SNoticeBanner variant="warning" :dismissible="true" @dismiss="() => {}">
            Some skills have unresolved conflicts that need your attention.
          </SNoticeBanner>
          <SNoticeBanner variant="danger">
            Connection to the database has been lost. Check your configuration.
          </SNoticeBanner>
        </div>
      </div>
    </section>


    <!-- ═══════════════════════════════════════════════
         NAVIGATION
         ═══════════════════════════════════════════════ -->
    <section class="mb-16">
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-text-primary">Navigation</h2>
        <p class="mt-1 text-sm text-text-secondary">
          Wayfinding components — breadcrumbs, sidebar links, and scroll helpers.
        </p>
      </div>
      <div class="h-px bg-border/60 mb-8" />

      <!-- SBreadcrumbs -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SBreadcrumbs</h3>
        <div class="flex flex-col gap-3">
          <SBreadcrumbs :segments="[
            { label: 'Engineering Handbook', to: '/' },
            { label: 'Architecture', to: '/architecture' },
            { label: 'Database Design' },
          ]" @navigate="() => {}" />
          <SBreadcrumbs :segments="[
            { label: 'Home', to: '/' },
            { label: 'Current Page' },
          ]" @navigate="() => {}" />
        </div>
      </div>

      <!-- SSidebarLink -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SSidebarLink</h3>
        <SCard variant="sidebar">
          <div class="flex flex-col gap-0.5 py-1">
            <SSidebarLink :active="true" :level="0">Getting Started</SSidebarLink>
            <SSidebarLink :level="0">Architecture</SSidebarLink>
            <SSidebarLink :level="1">Database Design</SSidebarLink>
            <SSidebarLink :level="1" :updated="true">API Layer</SSidebarLink>
            <SSidebarLink :level="1">Authentication</SSidebarLink>
            <SSidebarLink :level="0">Deployment</SSidebarLink>
            <SSidebarLink :level="1">CI/CD Pipeline</SSidebarLink>
          </div>
        </SCard>
      </div>

      <!-- SBackToTop -->
      <div>
        <h3 class="text-sm font-medium text-text-secondary mb-4">SBackToTop</h3>
        <p class="text-xs text-text-secondary">
          The circular button in the bottom-right corner is an <code class="px-1 py-0.5 rounded bg-surface-secondary text-xs font-mono">SBackToTop</code>.
          It appears when the page has been scrolled.
        </p>
      </div>
    </section>


    <!-- ═══════════════════════════════════════════════
         OVERLAY
         ═══════════════════════════════════════════════ -->
    <section class="mb-16">
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-text-primary">Overlay</h2>
        <p class="mt-1 text-sm text-text-secondary">
          Modals, dialogs, panels, menus, and lightboxes for focused interactions.
        </p>
      </div>
      <div class="h-px bg-border/60 mb-8" />

      <!-- SModal -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SModal</h3>
        <SButton variant="primary" size="md" @click="modalOpen = true">
          Open Modal
        </SButton>
        <SModal :open="modalOpen" max-width="max-w-md" @close="modalOpen = false">
          <template #header>
            <h3 class="text-base font-semibold text-text-primary">Confirm Action</h3>
          </template>
          <p class="text-sm text-text-secondary">
            This demonstrates the modal component with header, body, and footer slots.
          </p>
          <template #footer>
            <div class="flex justify-end gap-2">
              <SButton variant="secondary" size="sm" @click="modalOpen = false">Cancel</SButton>
              <SButton variant="primary" size="sm" @click="modalOpen = false">Confirm</SButton>
            </div>
          </template>
        </SModal>
      </div>

      <!-- SConfirmDialog -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SConfirmDialog</h3>
        <div class="flex gap-3">
          <SButton variant="secondary" size="md" @click="confirmOpen = true">
            Standard Confirm
          </SButton>
          <SButton variant="secondary" size="md" @click="confirmDangerOpen = true">
            Danger Confirm
          </SButton>
        </div>
        <SConfirmDialog
          :open="confirmOpen"
          title="Publish changes?"
          message="This will make your changes visible to all team members."
          confirm-label="Publish"
          @confirm="confirmOpen = false"
          @cancel="confirmOpen = false"
          @close="confirmOpen = false"
        />
        <SConfirmDialog
          :open="confirmDangerOpen"
          title="Delete this snapshot?"
          message="This action cannot be undone. The snapshot data will be permanently removed."
          confirm-label="Delete"
          :danger="true"
          @confirm="confirmDangerOpen = false"
          @cancel="confirmDangerOpen = false"
          @close="confirmDangerOpen = false"
        />
      </div>

      <!-- SDropdownMenu -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SDropdownMenu</h3>
        <div class="flex gap-4">
          <SDropdownMenu :items="dropdownItems" align="left" @select="onDropdownSelect">
            <template #trigger="{ toggle }">
              <SButton variant="secondary" size="md" @click="toggle">
                Actions (left-aligned)
              </SButton>
            </template>
          </SDropdownMenu>
          <SDropdownMenu :items="dropdownItems" align="right" @select="onDropdownSelect">
            <template #trigger="{ toggle }">
              <SButton variant="secondary" size="md" @click="toggle">
                Actions (right-aligned)
              </SButton>
            </template>
          </SDropdownMenu>
        </div>
      </div>

      <!-- SRowActionMenu -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SRowActionMenu</h3>
        <p class="text-xs text-text-secondary mb-3">
          A compact three-dot menu for table rows and list items. Built on top of <code class="px-1 py-0.5 rounded bg-surface-secondary text-xs font-mono">SDropdownMenu</code>.
        </p>
        <SCard variant="content">
          <div class="flex items-center justify-between p-2 rounded-md hover:bg-surface-secondary/40">
            <div class="flex items-center gap-2">
              <SStatusDot variant="success" />
              <span class="text-sm text-text-primary">project-alpha</span>
              <SBadge variant="accent">active</SBadge>
            </div>
            <SRowActionMenu :actions="rowActions" @select="(v) => toastInfo(`Action: ${v}`)" />
          </div>
          <div class="flex items-center justify-between p-2 rounded-md hover:bg-surface-secondary/40">
            <div class="flex items-center gap-2">
              <SStatusDot variant="warning" />
              <span class="text-sm text-text-primary">project-beta</span>
              <SBadge variant="warning">draft</SBadge>
            </div>
            <SRowActionMenu :actions="rowActions" @select="(v) => toastInfo(`Action: ${v}`)" />
          </div>
        </SCard>
      </div>

      <!-- STooltip -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">STooltip</h3>
        <div class="flex items-center gap-4">
          <STooltip text="This is a top tooltip" position="top">
            <SButton variant="secondary" size="sm">Hover me (top)</SButton>
          </STooltip>
          <STooltip text="This is a bottom tooltip" position="bottom">
            <SButton variant="secondary" size="sm">Hover me (bottom)</SButton>
          </STooltip>
          <STooltip text="Quick tooltip" :delay="100">
            <SButton variant="icon">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </SButton>
          </STooltip>
        </div>
      </div>

      <!-- SPanel -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SPanel</h3>
        <p class="text-xs text-text-secondary mb-3">
          A slide-in panel from the right edge. Supports title, subtitle, icon, content, and footer slots with focus trapping.
        </p>
        <SButton variant="secondary" size="md" @click="panelOpen = true">
          Open Panel
        </SButton>
        <SPanel
          :open="panelOpen"
          title="Item Details"
          subtitle="View and edit item properties"
          size="md"
          @close="panelOpen = false"
        >
          <div class="space-y-4">
            <SFormField label="Name">
              <SInput model-value="Example Item" placeholder="Item name..." />
            </SFormField>
            <SFormField label="Description">
              <STextarea model-value="A sample item for demonstrating the panel component." :rows="3" />
            </SFormField>
            <SDivider />
            <div class="flex flex-col gap-2">
              <SCheckbox :model-value="true" label="Published" description="Make this item visible to others" />
              <SCheckbox :model-value="false" label="Featured" description="Pin to the top of the list" />
            </div>
          </div>
          <template #footer>
            <SButton variant="secondary" size="sm" @click="panelOpen = false">Cancel</SButton>
            <SButton variant="primary" size="sm" @click="panelOpen = false">Save Changes</SButton>
          </template>
        </SPanel>
      </div>

      <!-- SKeyboardShortcuts -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SKeyboardShortcuts</h3>
        <p class="text-xs text-text-secondary mb-3">
          A modal overlay that displays grouped keyboard shortcuts with <code class="px-1 py-0.5 rounded bg-surface-secondary text-xs font-mono">SKbd</code> badges.
        </p>
        <SButton variant="secondary" size="md" @click="shortcutsOpen = true">
          View Keyboard Shortcuts
        </SButton>
        <SKeyboardShortcuts
          :open="shortcutsOpen"
          :groups="shortcutGroups"
          @close="shortcutsOpen = false"
        />
      </div>

      <!-- SImageLightbox -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SImageLightbox</h3>
        <p class="text-xs text-text-secondary mb-3">
          Full-screen image viewer with backdrop blur. Click the image below to open the lightbox.
        </p>
        <img
          src="https://picsum.photos/seed/stuntrocket/600/300"
          alt="Sample image"
          class="rounded-lg border border-border cursor-pointer max-w-xs hover:opacity-90 transition-opacity"
          @click="lightboxOpen = true"
        />
        <SImageLightbox
          :open="lightboxOpen"
          src="https://picsum.photos/seed/stuntrocket/1200/800"
          alt="Expanded sample image"
          @close="lightboxOpen = false"
        />
      </div>

      <!-- SCommandPalette -->
      <div>
        <h3 class="text-sm font-medium text-text-secondary mb-4">SCommandPalette</h3>
        <SButton variant="secondary" size="md" @click="paletteOpen = true">
          Open Command Palette
        </SButton>
        <p class="text-xs text-text-secondary mt-2">Or press <SKbd>⌘K</SKbd></p>
        <SCommandPalette
          :open="paletteOpen"
          placeholder="Search components..."
          @close="paletteOpen = false"
        >
          <div class="px-2 py-1">
            <div class="px-2 py-2 rounded-md text-sm text-text-secondary hover:bg-surface-secondary/60 cursor-pointer">SButton — Primary, Secondary, Icon variants</div>
            <div class="px-2 py-2 rounded-md text-sm text-text-secondary hover:bg-surface-secondary/60 cursor-pointer">SCard — Content, Sidebar, List, Nested variants</div>
            <div class="px-2 py-2 rounded-md text-sm text-text-secondary hover:bg-surface-secondary/60 cursor-pointer">SModal — Dialog with header, body, footer slots</div>
            <div class="px-2 py-2 rounded-md text-sm text-text-secondary hover:bg-surface-secondary/60 cursor-pointer">SListRow — Selectable row with status indicators</div>
          </div>
        </SCommandPalette>
      </div>
    </section>


    <!-- ═══════════════════════════════════════════════
         LAYOUT
         ═══════════════════════════════════════════════ -->
    <section class="mb-16">
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-text-primary">Layout</h2>
        <p class="mt-1 text-sm text-text-secondary">
          Structural components — shells, sidebars, resizable splits, and application chrome.
        </p>
      </div>
      <div class="h-px bg-border/60 mb-8" />

      <!-- SAmbientBlobs -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SAmbientBlobs</h3>
        <p class="text-xs text-text-secondary">
          The floating gradient blobs in the background of this page are rendered by
          <code class="px-1 py-0.5 rounded bg-surface-secondary text-xs font-mono">SAmbientBlobs</code>.
          They provide depth and warmth with subtle drifting animations.
        </p>
      </div>

      <!-- SPageHeader -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SPageHeader</h3>
        <p class="text-xs text-text-secondary mb-4">
          A sticky page header with prepend and actions slots. Typically sits at the top of a content area.
        </p>
        <SCard variant="content">
          <div class="relative overflow-hidden rounded-lg border border-border/40">
            <SPageHeader :sticky="false">
              <template #prepend>
                <SHeading :level="4">All Projects</SHeading>
                <SBadge variant="count">24</SBadge>
              </template>
              <template #actions>
                <SSearchInput model-value="" :compact="true" placeholder="Search..." />
                <SButton variant="primary" size="sm">New Project</SButton>
              </template>
            </SPageHeader>
          </div>
        </SCard>
      </div>

      <!-- SResizableSplit -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SResizableSplit</h3>
        <p class="text-xs text-text-secondary mb-4">
          Draggable split panes with configurable direction, min/max constraints, and localStorage persistence.
          Double-click the divider to reset.
        </p>

        <p class="text-xs text-text-secondary/70 mb-2">Horizontal</p>
        <SCard variant="content">
          <div class="h-[200px] rounded-lg border border-border/40 overflow-hidden">
            <SResizableSplit direction="horizontal" :initial-size="40" :min-size="25" :max-size="75">
              <template #first>
                <div class="h-full p-4 bg-surface-secondary/30">
                  <p class="text-xs font-medium text-text-secondary">Left pane</p>
                  <p class="text-[11px] text-text-secondary/70 mt-1">Drag the divider to resize</p>
                </div>
              </template>
              <template #second>
                <div class="h-full p-4">
                  <p class="text-xs font-medium text-text-secondary">Right pane</p>
                  <p class="text-[11px] text-text-secondary/70 mt-1">Content fills remaining space</p>
                </div>
              </template>
            </SResizableSplit>
          </div>
        </SCard>

        <p class="text-xs text-text-secondary/70 mt-4 mb-2">Vertical</p>
        <SCard variant="content">
          <div class="h-[200px] rounded-lg border border-border/40 overflow-hidden">
            <SResizableSplit direction="vertical" :initial-size="40" :min-size="20" :max-size="80">
              <template #first>
                <div class="h-full p-4 bg-surface-secondary/30">
                  <p class="text-xs font-medium text-text-secondary">Top pane</p>
                </div>
              </template>
              <template #second>
                <div class="h-full p-4">
                  <p class="text-xs font-medium text-text-secondary">Bottom pane</p>
                </div>
              </template>
            </SResizableSplit>
          </div>
        </SCard>
      </div>

      <!-- SAppShell -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SAppShell</h3>
        <p class="text-xs text-text-secondary mb-4">
          Three-pane application layout with sidebar, main content, and optional inspector panel.
        </p>
        <SCard variant="content">
          <div class="relative h-[300px] overflow-hidden rounded-lg border border-border/40">
            <SAppShell :show-inspector="true" sidebar-width="160px" inspector-width="180px">
              <template #sidebar>
                <div class="p-3">
                  <p class="text-[11px] font-semibold text-text-secondary uppercase tracking-wide mb-2">Navigation</p>
                  <div class="flex flex-col gap-0.5">
                    <SSidebarLink :active="true" :level="0">Dashboard</SSidebarLink>
                    <SSidebarLink :level="0">Projects</SSidebarLink>
                    <SSidebarLink :level="0">Settings</SSidebarLink>
                  </div>
                </div>
              </template>
              <div class="p-4">
                <SPageHeader :sticky="false">
                  <template #prepend>
                    <span class="text-sm font-medium text-text-primary">Dashboard</span>
                  </template>
                  <template #actions>
                    <SButton variant="primary" size="sm">Action</SButton>
                  </template>
                </SPageHeader>
                <div class="mt-4 grid grid-cols-2 gap-3">
                  <SKpiCard label="Users" value="1,234" />
                  <SKpiCard label="Revenue" value="$5.2K" />
                </div>
              </div>
              <template #inspector>
                <p class="text-[11px] font-semibold text-text-secondary uppercase tracking-wide mb-3">Inspector</p>
                <SSkeletonText :lines="4" size="sm" />
              </template>
            </SAppShell>
          </div>
        </SCard>
      </div>

      <!-- SSidebar -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SSidebar</h3>
        <p class="text-xs text-text-secondary mb-4">
          Application sidebar shell with header, default, and footer slots. Shown below in a contained preview.
        </p>
        <SCard variant="content">
          <div class="relative h-[280px] overflow-hidden rounded-lg border border-border/40">
            <SSidebar width="220px">
              <template #header>
                <div class="px-3 py-2">
                  <p class="text-xs font-semibold text-text-primary">Workspace</p>
                </div>
              </template>
              <div class="flex flex-col gap-0.5 px-2">
                <SSidebarLink :active="true" :level="0">Dashboard</SSidebarLink>
                <SSidebarLink :level="0">Projects</SSidebarLink>
                <SSidebarLink :level="0">Settings</SSidebarLink>
              </div>
              <template #footer>
                <div class="px-3 py-2 border-t border-border/60">
                  <p class="text-xs text-text-secondary">v0.7.0</p>
                </div>
              </template>
            </SSidebar>
          </div>
        </SCard>
      </div>

      <!-- SThemeProvider -->
      <div class="mb-10">
        <h3 class="text-sm font-medium text-text-secondary mb-4">SThemeProvider</h3>
        <p class="text-xs text-text-secondary">
          Wraps your app root with <code class="px-1 py-0.5 rounded bg-surface-secondary text-xs font-mono">&lt;SThemeProvider accent="#7C3AED"&gt;</code>
          to override the accent colour globally. Also provides <code class="px-1 py-0.5 rounded bg-surface-secondary text-xs font-mono">useTheme()</code>
          via injection for light/dark/system cycling. Not demoed inline as it sets colours on <code class="px-1 py-0.5 rounded bg-surface-secondary text-xs font-mono">:root</code>.
        </p>
      </div>

      <!-- STopbar -->
      <div>
        <h3 class="text-sm font-medium text-text-secondary mb-4">STopbar</h3>
        <p class="text-xs text-text-secondary mb-4">
          A fixed application topbar with traffic-light padding, three slot regions (left, centre, right),
          and drag-region support. Shown below in a contained preview.
        </p>

        <SCard variant="content">
          <div class="relative h-[52px] overflow-hidden rounded-lg border border-border/40">
            <STopbar traffic-light-padding="16px">
              <template #left>
                <SButton variant="icon">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </SButton>
              </template>
              <template #centre>
                <span class="text-xs font-medium text-text-secondary">Page Title</span>
              </template>
              <template #right>
                <SButton variant="icon">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </SButton>
              </template>
            </STopbar>
          </div>
        </SCard>
      </div>
    </section>


    <!-- Footer -->
    <footer class="text-center text-xs text-text-secondary/50 pt-8 border-t border-border/40">
      <p>Stuntrocket UI v0.7.0 — 57 Components</p>
    </footer>

  </div>

  <!-- Toast container (renders toasts from useToastStack) -->
  <SToastContainer />

  <!-- Back to top (always visible in showcase for demo) -->
  <SBackToTop :visible="showBackToTop" @click="scrollTo({ top: 0, behavior: 'smooth' })" />
</template>
