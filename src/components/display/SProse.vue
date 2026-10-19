<script setup lang="ts">
export interface SProseProps {
  /** Add a fade-in animation on mount */
  animate?: boolean
}

withDefaults(defineProps<SProseProps>(), {
  animate: false,
})
</script>

<template>
  <div :class="['s-prose', { 'prose-animate': animate }]" data-selectable>
    <slot />
  </div>
</template>

<style>
.s-prose {
  font-size: 15px;
  line-height: 1.6;
  color: var(--color-text-primary);
}

/* Headings */
.s-prose :where(h1, h2, h3, h4) {
  font-weight: 600;
  letter-spacing: -0.025em;
  color: var(--color-text-primary);
}

.s-prose :where(h2) {
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.s-prose :where(h4) {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  color: var(--color-text-secondary);
}

/* Links */
.s-prose :where(a) {
  color: var(--color-accent);
  text-decoration: none;
}
.s-prose :where(a):hover {
  text-decoration: underline;
}

/* Blockquotes */
.s-prose :where(blockquote) {
  border-left-color: color-mix(in srgb, var(--color-accent) 30%, transparent);
  color: var(--color-text-secondary);
  font-style: normal;
}

/* Inline code */
.s-prose :where(code):not(:where(pre *)) {
  font-family: var(--font-mono);
  font-size: 0.85em;
  font-weight: 400;
  padding: 0.15em 0.4em;
  border-radius: 0.25rem;
  background-color: var(--color-surface-secondary);
  border: 1px solid var(--color-border);
}

.s-prose :where(code):not(:where(pre *))::before,
.s-prose :where(code):not(:where(pre *))::after {
  content: none;
}

/* Code blocks */
.s-prose pre {
  border-radius: 0.5rem;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.65;
  padding: 1rem 1.25rem;
  border: 1px solid var(--color-code-border);
  background-color: var(--color-code-surface) !important;
}

/* Tables */
.s-prose table { font-size: 14px; }
.s-prose thead th { border-bottom: 2px solid var(--color-border); padding: 0.5rem 0.75rem; }
.s-prose tbody td { border-bottom: 1px solid var(--color-border); padding: 0.5rem 0.75rem; }
.s-prose tbody tr:last-child td { border-bottom: none; }

/* Lists */
.s-prose ul, .s-prose ol { padding-left: 1.25rem; }
.s-prose li { margin-top: 0.25em; margin-bottom: 0.25em; }

/* Fade-in animation */
.s-prose.prose-animate {
  animation: content-fade-in 200ms ease-out;
}
@keyframes content-fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
