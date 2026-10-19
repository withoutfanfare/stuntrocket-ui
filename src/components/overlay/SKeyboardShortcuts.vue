<script setup lang="ts">
import SModal from './SModal.vue'
import SKbd from '../display/SKbd.vue'

export interface ShortcutGroup {
  title: string
  shortcuts: { keys: string; description: string }[]
}

export interface SKeyboardShortcutsProps {
  open?: boolean
  groups: ShortcutGroup[]
}

withDefaults(defineProps<SKeyboardShortcutsProps>(), {
  open: false,
})

const emit = defineEmits<{ 'close': [] }>()
</script>

<template>
  <SModal :open="open" maxWidth="max-w-2xl" @close="emit('close')">
    <template #header>
      <h2 class="text-base font-semibold text-text-primary">Keyboard Shortcuts</h2>
    </template>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div v-for="group in groups" :key="group.title">
        <h3 class="text-[12px] font-semibold text-text-secondary uppercase tracking-wider mb-3">
          {{ group.title }}
        </h3>
        <div class="space-y-2">
          <div
            v-for="(shortcut, i) in group.shortcuts"
            :key="`${shortcut.keys}-${i}`"
            class="flex items-center justify-between gap-3"
          >
            <span class="text-[13px] text-text-primary">{{ shortcut.description }}</span>
            <span class="flex items-center gap-1 shrink-0">
              <template v-for="(key, i) in shortcut.keys.split('+')" :key="i">
                <span v-if="i > 0" class="text-[10px] text-text-secondary/50">+</span>
                <SKbd>{{ key.trim() }}</SKbd>
              </template>
            </span>
          </div>
        </div>
      </div>
    </div>
  </SModal>
</template>
