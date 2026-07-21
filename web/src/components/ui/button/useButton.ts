import { computed } from "vue"
import type { ButtonProps } from "./button.types"

export function useButton(props: ButtonProps) {
  const baseClass = "btn"

  const variantClass = computed(() => {
    switch (props.variant) {
      case "danger":
        return "btn-danger"
      case "success":
        return "btn-success"
      case "secondary":
        return "btn-secondary"
      default:
        return "btn-primary"
    }
  })

  const layoutClass = computed(() => {
    return [
      props.fullWidth ? "w-100" : "",
      props.grow ? "flex-fill" : "",
    ]
  })

  const classes = computed(() => [
    baseClass,
    variantClass.value,
    layoutClass.value,
  ])

  return { classes }
}