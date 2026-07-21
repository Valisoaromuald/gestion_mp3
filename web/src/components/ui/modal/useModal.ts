import { computed } from "vue"
import type { ModalProps } from "./modal.types"

export function useModal(props?: ModalProps) {
  const sizeClass = computed(() => {
    switch (props?.size) {
      case "sm":
        return "modal-sm"
      case "lg":
        return "modal-lg"
      default:
        return ""
    }
  })

  const overlayClass = "modal-backdrop fade show"

  const modalClass = computed(() => [
    "modal-dialog",
    "modal-dialog-centered",
    sizeClass.value,
  ])

  function toggleModal(openModal: boolean): boolean {
    return !openModal
  }

  return {
    overlayClass,
    modalClass,
    toggleModal
  }
}