<script setup lang="ts">
import { watch } from "vue"
import { useModal } from "./useModal"
import type { ModalProps } from "./modal.types"
import BaseButton from "../button/BaseButton.vue";

const props = withDefaults(defineProps<ModalProps>(), {
  modelValue: false,
  closeOnOverlay: true,
  size: "md",
})

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
}>()

const { overlayClass, modalClass } = useModal(props)

function close() {
  emit("update:modelValue", false)
}

function onOverlayClick() {
  if (props.closeOnOverlay) {
    close()
  }
}

// ESC key support
function handleEsc(e: KeyboardEvent) {
  if (e.key === "Escape") close()
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) window.addEventListener("keydown", handleEsc)
    else window.removeEventListener("keydown", handleEsc)
  }
)
</script>

<template>
  <Transition name="modal">
    <div v-if="modelValue">
      <div :class="overlayClass" @click="onOverlayClick"></div>
      <div class="modal d-block" tabindex="-1" @click="onOverlayClick">
        <div :class="modalClass" @click.stop>
          <div class="modal-content">

            <!-- Header -->
            <div class="modal-header">
              <h5 class="modal-title">
                {{ title }}
              </h5>
              <button type="button" class="btn-close" aria-label="Close" @click="close"></button>
            </div>

            <!-- Body -->
            <div class="modal-body">
              <slot />
            </div>

            <!-- Footer -->
            <div class="modal-footer">
              <slot name="footer" :close="close">
                <BaseButton type="button" class="btn btn-secondary" @click="close">
                  Fermer
                </BaseButton>
              </slot>
            </div>

          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* BACKDROP + MODAL ANIMATION */

.modal-enter-active,
.modal-leave-active {
  transition: all .3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-dialog,
.modal-leave-to .modal-dialog {
  opacity: 0;
  transform: scale(0.95);
}

.modal-enter-active .modal-dialog,
.modal-leave-active .modal-dialog {
  transition: all 0.2s ease;
}
</style>