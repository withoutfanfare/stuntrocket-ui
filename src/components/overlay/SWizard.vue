<script setup lang="ts">
import { ref, computed, watch, toRef, onMounted, onBeforeUnmount, useId } from 'vue'
import { useFocusTrap } from '../../composables'

/**
 * SWizard — multi-step wizard with progress indicator.
 * Used for onboarding, setup flows, and guided processes.
 */
export interface SWizardStep {
  title: string
  description?: string
}

export interface SWizardProps {
  steps: SWizardStep[]
  currentStep?: number
  title?: string
  open?: boolean
  closable?: boolean
}

const props = withDefaults(defineProps<SWizardProps>(), {
  currentStep: 0,
  open: true,
  closable: true,
})

const emit = defineEmits<{
  'update:currentStep': [step: number]
  complete: []
  close: []
}>()

const wizardRef = ref<HTMLElement | null>(null)
// Per-instance id so multiple wizards never share DOM ids.
const wizardId = `s-wizard-title-${useId()}`

useFocusTrap(wizardRef, toRef(props, 'open'))

const isFirstStep = computed(() => props.currentStep === 0)
const isLastStep = computed(() => props.currentStep === props.steps.length - 1)
const progressPercent = computed(() =>
  props.steps.length <= 1 ? 100 : (props.currentStep / (props.steps.length - 1)) * 100,
)

function goBack() {
  if (!isFirstStep.value) {
    emit('update:currentStep', props.currentStep - 1)
  }
}

function goNext() {
  if (isLastStep.value) {
    emit('complete')
  } else {
    emit('update:currentStep', props.currentStep + 1)
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open && props.closable) {
    emit('close')
  }
}

// Body scroll lock. `immediate: true` covers mounting with `open: true`.
watch(
  () => props.open,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  },
  { immediate: true },
)

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-start justify-center bg-black/30 dark:bg-black/50"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-[0.96]"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-[0.96]"
          appear
        >
          <div
            ref="wizardRef"
            class="mt-[10vh] w-full max-w-lg rounded-xl border border-border bg-surface shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="title ? wizardId : undefined"
          >
            <!-- Header -->
            <div class="flex-shrink-0 border-b border-border/80 px-5 py-4">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <h3
                    v-if="title"
                    :id="wizardId"
                    class="text-[14px] font-semibold tracking-tight text-text-primary"
                  >
                    {{ title }}
                  </h3>
                  <p class="mt-0.5 text-[12px] text-text-secondary">
                    Step {{ currentStep + 1 }} of {{ steps.length }}
                    <template v-if="steps[currentStep]"> — {{ steps[currentStep].title }}</template>
                  </p>
                </div>
                <button
                  v-if="closable"
                  type="button"
                  aria-label="Close wizard"
                  class="flex-shrink-0 p-1.5 -m-1 rounded-md text-text-secondary/60 hover:text-text-primary hover:bg-[var(--color-surface-hover)] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface outline-none"
                  @click="emit('close')"
                >
                  <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                  </svg>
                </button>
              </div>

              <!-- Progress bar — single role="progressbar" for the whole flow,
                   not one per step (per WAI-ARIA semantics). -->
              <div
                class="mt-3 h-1 rounded-full bg-border/40 overflow-hidden"
                role="progressbar"
                :aria-valuenow="Math.round(progressPercent)"
                aria-valuemin="0"
                aria-valuemax="100"
                :aria-label="`Step ${currentStep + 1} of ${steps.length}`"
              >
                <div
                  class="h-full bg-accent transition-[width] duration-200 ease-out"
                  :style="{ width: `${progressPercent}%` }"
                />
              </div>

              <!-- Step indicators -->
              <div class="mt-3 flex items-center gap-2">
                <div
                  v-for="(step, i) in steps"
                  :key="`indicator-${i}`"
                  :class="[
                    'flex items-center gap-1.5 text-[11px] leading-snug',
                    i === currentStep ? 'text-text-primary font-medium' : 'text-text-secondary/50',
                  ]"
                >
                  <span
                    :class="[
                      'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium flex-shrink-0 border',
                      i < currentStep
                        ? 'bg-accent border-accent text-white'
                        : i === currentStep
                          ? 'border-accent text-accent'
                          : 'border-border/60 text-text-secondary/40',
                    ]"
                  >
                    <!-- Completed check -->
                    <svg v-if="i < currentStep" class="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2.5-2.5a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z" />
                    </svg>
                    <template v-else>{{ i + 1 }}</template>
                  </span>
                  <span class="hidden sm:inline truncate">{{ step.title }}</span>
                </div>
              </div>
            </div>

            <!-- Step content -->
            <div class="flex-1 overflow-y-auto px-5 py-5">
              <template v-for="(step, i) in steps" :key="`step-content-${i}`">
                <div v-show="i === currentStep">
                  <slot :name="`step-${i}`" :step="step" :index="i">
                    <p v-if="step.description" class="text-[13px] text-text-secondary">
                      {{ step.description }}
                    </p>
                  </slot>
                </div>
              </template>
            </div>

            <!-- Footer -->
            <div class="flex-shrink-0 flex items-center justify-between gap-3 px-5 py-4 border-t border-border/80">
              <slot name="footer" :current-step="currentStep" :is-first="isFirstStep" :is-last="isLastStep" :go-back="goBack" :go-next="goNext">
                <button
                  type="button"
                  :disabled="isFirstStep"
                  :class="[
                    'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors duration-150',
                    'border border-border text-text-primary hover:bg-surface-secondary hover:border-border-strong',
                    'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface outline-none',
                    isFirstStep ? 'opacity-50 cursor-not-allowed' : '',
                  ]"
                  @click="goBack"
                >
                  Back
                </button>
                <button
                  type="button"
                  :class="[
                    'px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150',
                    'bg-accent text-white hover:opacity-90 active:opacity-85',
                    'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface outline-none',
                  ]"
                  @click="goNext"
                >
                  {{ isLastStep ? 'Complete' : 'Next' }}
                </button>
              </slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
