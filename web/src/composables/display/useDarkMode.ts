import { ref, watch } from 'vue'

const savedTheme = localStorage.getItem('theme')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const isDark = ref(
  savedTheme ? savedTheme === 'dark' : prefersDark
)

function applyTheme() {
  document.documentElement.setAttribute(
    'data-bs-theme',
    isDark.value ? 'dark' : 'light'
  )
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// Applique le thème dès le chargement du module
applyTheme()

watch(isDark, applyTheme)

export function useDarkMode() {
  function toggleDarkMode() {
    isDark.value = !isDark.value
  }

  return { isDark, toggleDarkMode }
}