<script setup lang="ts">
import { computed } from 'vue'

export interface SCodeEditorProps {
  code: string
  lineNumbers?: boolean
  maxHeight?: string
}

const props = withDefaults(defineProps<SCodeEditorProps>(), {
  lineNumbers: true,
})

const lines = computed(() => (props.code ?? '').split('\n'))
</script>

<template>
  <div
    class="overflow-hidden rounded-lg border border-code-border bg-code-surface"
    :style="maxHeight ? { maxHeight, overflow: 'auto' } : undefined"
  >
    <div class="flex">
      <!-- Line numbers gutter -->
      <div
        v-if="lineNumbers"
        class="flex-shrink-0 select-none py-3 pl-3 pr-2 text-right"
        aria-hidden="true"
      >
        <div
          v-for="(_, i) in lines"
          :key="i"
          class="font-mono text-[12px] leading-[1.65] text-text-secondary/40"
        >
          {{ i + 1 }}
        </div>
      </div>

      <!-- Code content -->
      <div class="flex-1 overflow-x-auto py-3 pr-4" :class="lineNumbers ? 'pl-2' : 'pl-4'">
        <slot :code="code" :lines="lines">
          <pre class="font-mono text-[12px] leading-[1.65] text-text-primary whitespace-pre">{{ code }}</pre>
        </slot>
      </div>
    </div>
  </div>
</template>
