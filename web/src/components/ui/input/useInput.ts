import { computed } from "vue"
import type { InputProps } from "./input.types"

export function useInput(props: InputProps) {
  const baseClass =
    "px-3 py-2 rounded-lg border outline-none transition-all duration-200 w-full"

  const variantClass = computed(() => {
    switch (props.variant) {
      case "error":
        return "border-red-500 focus:ring-2 focus:ring-red-300"
      case "success":
        return "border-green-500 focus:ring-2 focus:ring-green-300"
      default:
        return "border-gray-300 focus:ring-2 focus:ring-blue-300"
    }
  })

  const layoutClass = computed(() => {
    return props.fullWidth ? "w-full" : "inline-block"
  })

  const classes = computed(() => [
    baseClass,
    variantClass.value,
    layoutClass.value,
  ])

  return { classes }
}