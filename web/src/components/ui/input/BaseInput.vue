<script setup lang="ts">
import { useInput } from "./useInput"
import type { InputProps } from "./input.types"

const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  variant: "default",
  fullWidth: true,
})

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
}>()

const { classes } = useInput(props)

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit("update:modelValue", target.value)
}
</script>

<template>
  <input
    :class="classes"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    @input="onInput"
  />
</template>