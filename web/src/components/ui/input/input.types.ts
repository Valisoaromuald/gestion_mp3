export type InputVariant = "default" | "error" | "success"

export interface InputProps {
  modelValue: string | number | boolean | null
  type?: string
  placeholder?: string
  disabled?: boolean
  variant?: InputVariant
  fullWidth?: boolean
}
