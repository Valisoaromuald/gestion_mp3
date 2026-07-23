<!-- src/components/ui/Pagination.vue -->
<template>
  <nav v-if="totalPages > 1" aria-label="Navigation de pagination">
    <ul class="pagination justify-content-center">
      <!-- Bouton "Précédent" -->
      <li class="page-item" :class="{ disabled: currentPage === 0 }">
        <button class="page-link" @click="goTo(currentPage - 1)" :disabled="currentPage === 0">
          Précédent
        </button>
      </li>

      <!-- Première page + "..." si on est loin du début -->
      <li v-if="showFirstPage" class="page-item">
        <button class="page-link" @click="goTo(0)">1</button>
      </li>
      <li v-if="showStartEllipsis" class="page-item disabled">
        <span class="page-link">…</span>
      </li>

      <!-- Pages autour de la page actuelle -->
      <li
        v-for="p in visiblePages"
        :key="p"
        class="page-item"
        :class="{ active: p === currentPage }"
      >
        <button class="page-link" @click="goTo(p)">{{ p + 1 }}</button>
      </li>

      <!-- "..." + dernière page si on est loin de la fin -->
      <li v-if="showEndEllipsis" class="page-item disabled">
        <span class="page-link">…</span>
      </li>
      <li v-if="showLastPage" class="page-item">
        <button class="page-link" @click="goTo(totalPages - 1)">{{ totalPages }}</button>
      </li>

      <!-- Bouton "Suivant" -->
      <li class="page-item" :class="{ disabled: currentPage === totalPages - 1 }">
        <button class="page-link" @click="goTo(currentPage + 1)" :disabled="currentPage === totalPages - 1">
          Suivant
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number   // page actuelle, indexée à partir de 0
  totalPages: number
}>()

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void
}>()

const DELTA = 2 // nombre de pages affichées de chaque côté de la page actuelle

const visiblePages = computed(() => {
  const start = Math.max(0, props.currentPage - DELTA)
  const end = Math.min(props.totalPages - 1, props.currentPage + DELTA)
  const pages: number[] = []
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const showFirstPage = computed(() => visiblePages.value[0]! > 0)
const showStartEllipsis = computed(() => visiblePages.value[0]! > 1)
const showLastPage = computed(() => visiblePages.value[visiblePages.value.length - 1]! < props.totalPages - 1)
const showEndEllipsis = computed(() => visiblePages.value[visiblePages.value.length - 1]! < props.totalPages - 2)

function goTo(page: number) {
  if (page < 0 || page > props.totalPages - 1) return
  if (page === props.currentPage) return
  emit('update:currentPage', page)
}
</script>

<style scoped>
.pagination {
    margin-top: 20px;
    gap: 4px;
}

.page-link {
    background-color: var(--surface-color);
    border: 1px solid var(--border-subtle);
    color: var(--text-secondary);
    border-radius: 6px !important;
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.page-link:hover {
    background-color: var(--surface-hover);
    color: var(--primary-color);
    border-color: var(--primary-color);
}

.page-link:focus {
    box-shadow: 0 0 0 0.2rem rgba(53, 178, 224, 0.25);
}

.page-item.active .page-link {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--body-color);
    font-weight: 600;
}

.page-item.disabled .page-link {
    background-color: transparent;
    border-color: var(--border-subtle);
    color: var(--text-tertiary);
    cursor: not-allowed;
}
</style>