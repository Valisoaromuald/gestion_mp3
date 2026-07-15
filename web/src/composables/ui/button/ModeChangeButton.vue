<script setup lang="ts">
import { useDarkMode } from '@/composables/display/useDarkMode'

const { isDark, toggleDarkMode } = useDarkMode()
</script>

<template>
  <button class="btn btn-outline-secondary" @click="toggleDarkMode">
    <i :class="isDark ? 'bi bi-sun' : 'bi bi-moon'"></i>
    {{ isDark ? 'Mode clair' : 'Mode sombre' }}
  </button>
</template>