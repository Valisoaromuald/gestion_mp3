<template>
  <div class="container mt-4">
    <!-- État de chargement -->
    <div v-if="loading" class="d-flex flex-column align-items-center justify-content-center py-5">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Chargement...</span>
      </div>
      <p class="mt-3 text-muted">Chargement de la bibliothèque...</p>
    </div>

    <!-- État d'erreur -->
    <div v-if="error.length!==0" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <!-- Liste des mp3 -->
    <ul v-else class="list-group">
      <li v-for="mp3 in mp3List" :key="mp3.id" class="list-group-item">
        <strong>{{ mp3.titre || 'Titre inconnu' }}</strong>
        — {{ mp3.artiste || 'Artiste inconnu' }}
        <span v-if="mp3.album">({{ mp3.album }})</span>
        <span v-if="mp3.annee">, {{ mp3.annee }}</span>

        <div class="mt-2">
          <audio :src="`http://localhost:8080${mp3.url}`" controls class="w-100"></audio>
        </div>
        <div style="grid-template-columns: 1fr 1fr;" class="d-grid gap-0 column-gap-3">
          <button type="button" class="btn btn-success" @click="handleOpenModal(mp3)">Modifier</button>
          <button type="button" class="btn btn-danger">Supprimer</button>
        </div>
      </li>
    </ul>
  </div>
  <Mp3Modal v-model="openModal" />
</template>

<script setup lang="ts">
import { useMp3List } from '@/composables/mp3/useMp3List'
import { useMp3Modal } from '@/composables/mp3/useMp3Modal'
import { onMounted } from 'vue'
import Mp3Modal from './mp3/Mp3Modal.vue'

const { mp3List, error, loading, getMp3List } = useMp3List()
const {openModal,handleOpenModal} = useMp3Modal()
onMounted(async () => {
  await getMp3List()
  loading.value = false
})
</script>