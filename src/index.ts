/**
 * @stuntrocket/ui — Shared UI component library
 *
 * Design system for Stuntrocket Tauri desktop applications.
 *
 * CSS: import '@stuntrocket/ui/style.css' in your app entry.
 * All Tailwind utilities, tokens, and base styles are pre-compiled.
 */
import './css/library.css'

// Controls
export { default as SButton } from './components/controls/SButton.vue'
export { default as SInput } from './components/controls/SInput.vue'
export { default as SSelect } from './components/controls/SSelect.vue'
export { default as STextarea } from './components/controls/STextarea.vue'
export { default as SSegmentedControl } from './components/controls/SSegmentedControl.vue'
export { default as SSearchInput } from './components/controls/SSearchInput.vue'
export { default as SFormField } from './components/controls/SFormField.vue'
export { default as SIconButton } from './components/controls/SIconButton.vue'
export { default as SInlineTextField } from './components/controls/SInlineTextField.vue'
export { default as SViewToggle } from './components/controls/SViewToggle.vue'
export { default as SSearchFilterBar } from './components/controls/SSearchFilterBar.vue'
export { default as SCheckbox } from './components/controls/SCheckbox.vue'
export { default as SToggle } from './components/controls/SToggle.vue'

// Display
export { default as SCard } from './components/display/SCard.vue'
export { default as SBadge } from './components/display/SBadge.vue'
export { default as STag } from './components/display/STag.vue'
export { default as SStatusDot } from './components/display/SStatusDot.vue'
export { default as SKbd } from './components/display/SKbd.vue'
export { default as SListRow } from './components/display/SListRow.vue'
export { default as SSectionHeader } from './components/display/SSectionHeader.vue'
export { default as SHeading } from './components/display/SHeading.vue'
export { default as SText } from './components/display/SText.vue'
export { default as SProse } from './components/display/SProse.vue'
export { default as SDivider } from './components/display/SDivider.vue'
export { default as SAvatar } from './components/display/SAvatar.vue'
export { default as SSparkline } from './components/display/SSparkline.vue'
export { default as SScoreBar } from './components/display/SScoreBar.vue'
export { default as SCodeEditor } from './components/display/SCodeEditor.vue'
export { default as SKpiCard } from './components/display/SKpiCard.vue'
export { default as SBarChart } from './components/display/SBarChart.vue'
export { default as SHeatmapCalendar } from './components/display/SHeatmapCalendar.vue'
export { default as STimeline } from './components/display/STimeline.vue'
export { default as STimelineItem } from './components/display/STimelineItem.vue'
export { default as SGauge } from './components/display/SGauge.vue'
export { default as SDataTable } from './components/display/SDataTable.vue'
export { default as SFileTree } from './components/display/SFileTree.vue'
export { default as SDistributionChart } from './components/display/SDistributionChart.vue'

// Feedback
export { default as SToast } from './components/feedback/SToast.vue'
export { default as SSkeleton } from './components/feedback/SSkeleton.vue'
export { default as SSkeletonText } from './components/feedback/SSkeletonText.vue'
export { default as SSpinner } from './components/feedback/SSpinner.vue'
export { default as SEmptyState } from './components/feedback/SEmptyState.vue'
export { default as SNoticeBanner } from './components/feedback/SNoticeBanner.vue'
export { default as SProgressBar } from './components/feedback/SProgressBar.vue'
export { default as SToastContainer } from './components/feedback/SToastContainer.vue'
export { default as SRouteProgressBar } from './components/feedback/SRouteProgressBar.vue'

// Navigation
export { default as SSidebarLink } from './components/navigation/SSidebarLink.vue'
export { default as SBreadcrumbs } from './components/navigation/SBreadcrumbs.vue'
export { default as SBackToTop } from './components/navigation/SBackToTop.vue'

// Overlay
export { default as SModal } from './components/overlay/SModal.vue'
export { default as SConfirmDialog } from './components/overlay/SConfirmDialog.vue'
export { default as SCommandPalette } from './components/overlay/SCommandPalette.vue'
export { default as SDropdownMenu } from './components/overlay/SDropdownMenu.vue'
export { default as SDropdownItem } from './components/overlay/SDropdownItem.vue'
export { default as SContextMenu } from './components/overlay/SContextMenu.vue'
export { default as STooltip } from './components/overlay/STooltip.vue'
export { default as SKeyboardShortcuts } from './components/overlay/SKeyboardShortcuts.vue'
export { default as SRowActionMenu } from './components/overlay/SRowActionMenu.vue'
export { default as SPanel } from './components/overlay/SPanel.vue'
export { default as SImageLightbox } from './components/overlay/SImageLightbox.vue'
export { default as SDrawer } from './components/overlay/SDrawer.vue'
export { default as SWizard } from './components/overlay/SWizard.vue'

// Layout
export { default as SAmbientBlobs } from './components/layout/SAmbientBlobs.vue'
export { default as STopbar } from './components/layout/STopbar.vue'
export { default as SSidebar } from './components/layout/SSidebar.vue'
export { default as SThemeProvider } from './components/layout/SThemeProvider.vue'
export { useProvidedTheme } from './components/layout/SThemeProvider.vue'
export { default as SResizableSplit } from './components/layout/SResizableSplit.vue'
export { default as SPageHeader } from './components/layout/SPageHeader.vue'
export { default as SAppShell } from './components/layout/SAppShell.vue'
export { default as SToolbar } from './components/layout/SToolbar.vue'

// Types — Controls
export type { SButtonProps } from './components/controls/SButton.vue'
export type { SInputProps } from './components/controls/SInput.vue'
export type { SSelectProps } from './components/controls/SSelect.vue'
export type { STextareaProps } from './components/controls/STextarea.vue'
export type { SSegmentedControlProps } from './components/controls/SSegmentedControl.vue'
export type { SSearchInputProps } from './components/controls/SSearchInput.vue'
export type { SFormFieldProps } from './components/controls/SFormField.vue'
export type { SIconButtonProps } from './components/controls/SIconButton.vue'
export type { SInlineTextFieldProps } from './components/controls/SInlineTextField.vue'
export type { SViewToggleProps } from './components/controls/SViewToggle.vue'
export type { SSearchFilterBarProps } from './components/controls/SSearchFilterBar.vue'
export type { SCheckboxProps } from './components/controls/SCheckbox.vue'
export type { SToggleProps } from './components/controls/SToggle.vue'

// Types — Display
export type { SCardProps } from './components/display/SCard.vue'
export type { SBadgeProps } from './components/display/SBadge.vue'
export type { STagProps } from './components/display/STag.vue'
export type { SStatusDotProps } from './components/display/SStatusDot.vue'
export type { SListRowProps } from './components/display/SListRow.vue'
export type { SSectionHeaderProps } from './components/display/SSectionHeader.vue'
export type { SHeadingProps } from './components/display/SHeading.vue'
export type { STextProps } from './components/display/SText.vue'
export type { SProseProps } from './components/display/SProse.vue'
export type { SDividerProps } from './components/display/SDivider.vue'
export type { SAvatarProps } from './components/display/SAvatar.vue'
export type { SSparklineProps } from './components/display/SSparkline.vue'
export type { SScoreBarProps } from './components/display/SScoreBar.vue'
export type { SCodeEditorProps } from './components/display/SCodeEditor.vue'
export type { SKpiCardProps } from './components/display/SKpiCard.vue'
export type { SBarChartProps } from './components/display/SBarChart.vue'
export type { SHeatmapCalendarProps } from './components/display/SHeatmapCalendar.vue'
export type { STimelineProps } from './components/display/STimeline.vue'
export type { STimelineItemProps } from './components/display/STimelineItem.vue'
export type { SGaugeProps } from './components/display/SGauge.vue'
export type { SDataTableProps, SDataTableColumn } from './components/display/SDataTable.vue'
export type { SFileTreeProps, SFileTreeItem, SFileTreeSlotProps } from './components/display/SFileTree.vue'
export type { SDistributionChartProps } from './components/display/SDistributionChart.vue'

// Types — Feedback
export type { SToastProps } from './components/feedback/SToast.vue'
export type { SSkeletonProps } from './components/feedback/SSkeleton.vue'
export type { SSkeletonTextProps } from './components/feedback/SSkeletonText.vue'
export type { SSpinnerProps } from './components/feedback/SSpinner.vue'
export type { SEmptyStateProps } from './components/feedback/SEmptyState.vue'
export type { SNoticeBannerProps } from './components/feedback/SNoticeBanner.vue'
export type { SProgressBarProps } from './components/feedback/SProgressBar.vue'
export type { SRouteProgressBarProps } from './components/feedback/SRouteProgressBar.vue'

// Types — Navigation
export type { SSidebarLinkProps } from './components/navigation/SSidebarLink.vue'
export type { SBreadcrumbsProps, BreadcrumbSegment } from './components/navigation/SBreadcrumbs.vue'
export type { SBackToTopProps } from './components/navigation/SBackToTop.vue'

// Types — Overlay
export type { SModalProps } from './components/overlay/SModal.vue'
export type { SConfirmDialogProps } from './components/overlay/SConfirmDialog.vue'
export type { SCommandPaletteProps } from './components/overlay/SCommandPalette.vue'
export type { SDropdownMenuProps, SDropdownMenuItem } from './components/overlay/SDropdownMenu.vue'
export type { SDropdownItemProps } from './components/overlay/SDropdownItem.vue'
// SContextMenu takes no props (reads from useContextMenu singleton), so no
// SContextMenuProps type is exported. This is a minor breaking change —
// consumers importing the (empty) type should remove the import.
export type { STooltipProps } from './components/overlay/STooltip.vue'
export type { SKeyboardShortcutsProps, ShortcutGroup } from './components/overlay/SKeyboardShortcuts.vue'
export type { SRowActionMenuProps } from './components/overlay/SRowActionMenu.vue'
export type { SPanelProps } from './components/overlay/SPanel.vue'
export type { SImageLightboxProps } from './components/overlay/SImageLightbox.vue'
export type { SDrawerProps } from './components/overlay/SDrawer.vue'
export type { SWizardProps, SWizardStep } from './components/overlay/SWizard.vue'

// Types — Layout
export type { SAmbientBlobsProps } from './components/layout/SAmbientBlobs.vue'
export type { STopbarProps } from './components/layout/STopbar.vue'
export type { SSidebarProps } from './components/layout/SSidebar.vue'
export type { SThemeProviderProps, ProvidedTheme } from './components/layout/SThemeProvider.vue'
export type { SResizableSplitProps } from './components/layout/SResizableSplit.vue'
export type { SPageHeaderProps } from './components/layout/SPageHeader.vue'
export type { SAppShellProps } from './components/layout/SAppShell.vue'
export type { SToolbarProps } from './components/layout/SToolbar.vue'

// Composables
export {
  useTheme,
  useToastStack,
  useKeyboardShortcut,
  useFocusTrap,
  useRelativeTime,
  formatRelativeTime,
  useClipboard,
  useSearch,
  useResizableSidebar,
  useSidebarCollapse,
  useConfirm,
  useCountUp,
  usePlatform,
  formatShortcut,
  usePersistedRef,
  useExternalLink,
  useContextMenu,
  useScrollMemory,
  registerKeydownHandler,
} from './composables'
export type {
  ThemeMode,
  UseThemeOptions,
  UseThemeReturn,
  Toast,
  UseToastStackReturn,
  KeyboardShortcutOptions,
  UseKeyboardShortcutReturn,
  SearchHighlight,
  UseSearchOptions,
  UseSearchReturn,
  UseRelativeTimeReturn,
  UseClipboardReturn,
  UseResizableSidebarOptions,
  UseResizableSidebarReturn,
  UseSidebarCollapseReturn,
  ConfirmOptions,
  UseConfirmReturn,
  UseCountUpOptions,
  UseCountUpReturn,
  ContextMenuItem,
  UseScrollMemoryReturn,
} from './composables'
