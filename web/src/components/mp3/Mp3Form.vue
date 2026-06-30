<template>
    <div class="container">
        <form class="row g-3" @submit.prevent="handleSubmit">
            <div class="col-md-6">
                <label for="fichier" class="form-label">Fichier</label>
                <input class="form-control" type="file" id="fichier" accept="audio/*" @change="handleFileChange">
            </div>

            <div class="col-md-6">
                <label for="artiste" class="form-label">Artiste</label>
                <input class="form-control" type="text" id="artiste" v-model="formData.artiste" required>
            </div>
            <div class="col-md-6">
                <label for="titre" class="form-label">Titre</label>
                <input class="form-control" type="text" id="titre" v-model="formData.titre" required>
            </div>
            <div class="col-md-6">
                <label for="genre" class="form-label">Genre</label>
                <input class="form-control" type="text" id="genre" v-model="formData.genre" required>
            </div>
            <div class="col-md-6">
                <label for="album" class="form-label">Album</label>
                <input class="form-control" type="text" id="album" v-model="formData.album" required>
            </div>
            <div class="col-md-6">
                <label for="annee" class="form-label">Année</label>
                <input class="form-control" type="number" id="annee" v-model.number="formData.annee" min="1900"
                    :max="anneeMax">
            </div>

            <div class="col-md-6">
                <label for="duree" class="form-label">Durée</label>
                <input class="form-control" type="time" id="duree" v-model="formData.duree" step="1">
            </div>

            <div class="col-12">
                <button type="submit" class="btn btn-primary">Créer</button>
                <button type="reset" class="btn btn-outline-secondary ms-2" @click="resetForm">
                    Annuler
                </button>
            </div>
        </form>
    </div>
    {{ messageAfterAction }}
</template>
<script setup lang="ts">
import { useMorceauForm } from '@/composables/mp3/useMorceauForm'

const { formData, fichier, anneeMax, handleFileChange, resetForm, isValid,messageAfterAction } = useMorceauForm()

function handleSubmit() {
    if (!isValid()) {
        alert('Veuillez remplir tous les champs et sélectionner un fichier.')
        return
    }

    console.log('Données du formulaire :', { ...formData, fichier: fichier.value })
    // emit('submit', { ...formData, fichier: fichier.value })
}
</script>