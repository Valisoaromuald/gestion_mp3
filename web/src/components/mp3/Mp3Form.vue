<template>
    <div class="container form-container">
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
                <label for="langue" class="form-label">Langue</label>
                <input class="form-control" type="text" id="langue" v-model="formData.langue" required>
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
</template>

<script setup lang="ts">
import { useMorceauForm } from '@/composables/mp3/useMorceauForm'
import { useToast } from '@/components/ui/toast/useToast'


const { formData, anneeMax, handleFileChange, resetForm, isValid, insertMp3 } = useMorceauForm()
const toast = useToast()
async function handleSubmit() {
    if (!isValid()) {
        toast.info('Veuillez remplir tous les champs et sélectionner un fichier.')
        return
    }
    await insertMp3()
    toast.notifyCreated("Mp3")
}
</script>

<style scoped>
.form-container {
    background-color: var(--surface-color);
    border: 1px solid var(--border-subtle);
    border-radius: 12px;
    padding: 16px;
    color: var(--text-color);
}

.form-label {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-bottom: 6px;
}

.form-control {
    background-color: var(--bg-gray);
    border: 1px solid var(--border-subtle);
    color: var(--text-color);
}

.form-control:focus {
    background-color: var(--bg-gray);
    border-color: var(--primary-color);
    color: var(--text-color);
    box-shadow: 0 0 0 0.2rem rgba(53, 178, 224, 0.25);
}

.form-control::placeholder {
    color: var(--text-tertiary);
}

/* Champ file : bouton natif */
.form-control[type="file"]::file-selector-button {
    background-color: var(--surface-hover);
    color: var(--text-color);
    border: 1px solid var(--border-subtle);
    border-radius: 6px;
    padding: 4px 10px;
    margin-right: 10px;
    transition: background-color 0.2s ease;
}

.form-control[type="file"]::file-selector-button:hover {
    background-color: var(--surface-active);
}

/* Input number : masquer les flèches n'est pas nécessaire ici, on garde natif */

/* Input date/time : forcer l'icône native en clair sur fond sombre */
.form-control[type="time"]::-webkit-calendar-picker-indicator {
    filter: invert(1) brightness(1.5);
    cursor: pointer;
}

/* Boutons */
.btn-primary {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--body-color);
    font-weight: 600;
}

.btn-primary:hover {
    background-color: #2a9bc4;
    border-color: #2a9bc4;
}

.btn-outline-secondary {
    color: var(--text-secondary);
    border-color: var(--border-subtle);
    background-color: transparent;
}

.btn-outline-secondary:hover {
    background-color: var(--surface-hover);
    color: var(--text-color);
    border-color: var(--border-subtle);
}
</style>