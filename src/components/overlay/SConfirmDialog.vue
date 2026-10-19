<script setup lang="ts">
import { computed } from 'vue'
import SModal from './SModal.vue'
import SButton from '../controls/SButton.vue'

export interface SConfirmDialogProps {
  open?: boolean
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  variant?: 'primary' | 'danger' | 'warning'
}

const props = withDefaults(defineProps<SConfirmDialogProps>(), {
  open: false,
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  danger: false,
  variant: 'primary',
})

const emit = defineEmits<{
  confirm: []
  cancel: []
  close: []
}>()

const isDanger = computed(() => props.danger || props.variant === 'danger')
const isWarning = computed(() => props.variant === 'warning')
</script>

<template>
  <SModal :open="open" max-width="max-w-sm" role="alertdialog" @close="emit('close')">
    <template #header>
      <h3 class="text-[14px] font-semibold tracking-tight text-text-primary">{{ title }}</h3>
    </template>

    <p
      v-if="message"
      class="text-[13px] leading-relaxed text-text-secondary"
    >
{{ message }}
</p>
    <div v-if="$slots.default" class="mt-3">
      <slot />
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <SButton variant="secondary" size="sm" @click="emit('cancel')">
          {{ cancelLabel }}
        </SButton>
        <SButton
          variant="primary"
          size="sm"
          :style="isDanger
            ? { background: 'var(--color-danger)' }
            : isWarning
              ? { background: 'var(--color-warning)' }
              : undefined"
          @click="emit('confirm')"
        >
          {{ confirmLabel }}
        </SButton>
      </div>
    </template>
  </SModal>
</template>

