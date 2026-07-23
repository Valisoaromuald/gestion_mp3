<template>
    <div class="container mt-4">
        <!-- État de chargement -->
        <div v-if="loading" class="d-flex flex-column align-items-center justify-content-center py-5">
            <div class="spinner-border" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Chargement...</span>
            </div>
            <p class="mt-3 loading-text">Chargement de la bibliothèque...</p>
        </div>

        <!-- État d'erreur -->
        <div v-else-if="error.length !== 0" class="alert alert-danger" role="alert">
            {{ error }}
        </div>

        <!-- Liste des mp3 -->
        <ul v-else class="list-group">
            <li v-for="mp3 in mp3List" :key="mp3.id" class="list-group-item">
                <strong>{{ mp3.titre || 'Titre inconnu' }}</strong>
                — <span class="text-secondary">{{ mp3.artiste || 'Artiste inconnu' }}</span>
                <span v-if="mp3.album" class="text-tertiary">({{ mp3.album }})</span>
                <span v-if="mp3.annee" class="text-tertiary">, {{ mp3.annee }}</span>

                <div class="mt-2">
                    <audio :src="`http://localhost:8080${mp3.url}`" controls class="w-100"></audio>
                </div>
                <div style="grid-template-columns: 1fr 1fr;" class="d-grid gap-0 column-gap-3">
                    <button type="button" class="btn btn-success" @click="handleOpenModal(mp3)">Modifier</button>
                    <button type="button" class="btn btn-danger" @click="handleDeleteMp3(mp3.id)">Supprimer</button>
                </div>
            </li>
        </ul>
    </div>
    <Mp3Modal v-model="openModal" />
    <Pagination v-model:currentPage="currentPage" :total-pages="totalPages" />
</template>

<script setup lang="ts">
import { useMp3List } from '@/composables/mp3/useMp3List'
import { useMp3Modal } from '@/composables/mp3/useMp3Modal'
import { onMounted, ref } from 'vue'
import Mp3Modal from './mp3/Mp3Modal.vue'
import { useMp3Delete } from '@/composables/mp3/useMp3Delete.js'
import Pagination from './ui/pagination/Pagination.vue'
import { watch } from 'vue'
const { mp3List, error, loading, getMp3List, currentPage, totalPages } = useMp3List()
const { openModal, handleOpenModal } = useMp3Modal()
const { handleDeleteMp3 } = useMp3Delete()
watch(currentPage, async (newValue) => {
    currentPage.value = newValue;
    await getMp3List(currentPage.value);
})
onMounted(async () => {
    await getMp3List()
    loading.value = false
})
</script>

<style scoped>
.spinner-border {
    color: var(--primary-color);
}

.loading-text {
    color: var(--text-secondary);
}

.alert-danger {
    background-color: var(--error-bg);
    border-color: var(--error-border);
    color: var(--error-color);
}

.list-group-item {
    background-color: var(--surface-color);
    border: 1px solid var(--border-subtle);
    color: var(--text-color);
    margin-bottom: 12px;
    border-radius: 8px !important;
    padding: 16px;
    transition: background-color 0.2s ease;
}

.list-group-item:hover {
    background-color: var(--surface-hover);
}

.list-group-item strong {
    color: var(--text-color);
    font-size: 1.05rem;
}

.text-secondary {
    color: var(--text-secondary) !important;
}

.text-tertiary {
    color: var(--text-tertiary);
    font-size: 0.9rem;
}

/* Lecteur audio natif : le rendre cohérent avec le thème sombre */
audio {
    filter: invert(0.85) hue-rotate(180deg) brightness(1.1);
    border-radius: 6px;
}

.btn-success {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--body-color);
    font-weight: 500;
}

.btn-success:hover {
    background-color: #2a9bc4;
    border-color: #2a9bc4;
}

.btn-danger {
    background-color: var(--error-color);
    border-color: var(--error-border);
    color: var(--w-color);
    font-weight: 500;
}

.btn-danger:hover {
    background-color: #c94545;
    border-color: #c94545;
}
</style>