<script setup lang="ts">
import { useButton } from "./useButton"
import type { ButtonProps } from "./button.types"

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: "primary",
  fullWidth: false,
  grow: false,
})

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void
}>()

const { classes } = useButton(props)

function handleClick(e: MouseEvent) {
  if (props.disabled || props.loading) return
  emit("click", e)
}
</script>

<template>
  <button 
    :class="classes" 
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading">Loading...</span>
    <span v-else><slot /></span>
  </button>
</template>