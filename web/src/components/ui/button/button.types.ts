export type ButtonVariant =
  | "primary"
  | "danger"
  | "success"
  | "secondary"
  | "warning"
  | "info"

  export type ButtonSize = "sm" | "md" | "lg"

export interface ButtonProps {
  variant?: ButtonVariant
  fullWidth?: boolean
  grow?: boolean
  loading?: boolean
  disabled?: boolean
}