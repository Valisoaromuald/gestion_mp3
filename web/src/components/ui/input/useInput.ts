import { computed } from "vue"
import type { InputProps } from "./input.types"

export function useInput(props: InputProps) {
  const baseClass = "form-control"

  const variantClass = computed(() => {
    switch (props.variant) {
      case "error":
        return "is-invalid"
      case "success":
        return "is-valid"
      default:
        return ""
    }
  })

  const layoutClass = computed(() => {
    return props.fullWidth ? "w-100" : ""
  })

  const classes = computed(() => [
    baseClass,
    variantClass.value,
    layoutClass.value,
  ])

  return { classes }
}