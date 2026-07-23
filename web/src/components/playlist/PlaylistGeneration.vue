<template>
    <div class="container-fluid d-flex flex-column row-gap-4">
        <div class="card text-left">
            <div class="card-header fs-1 fw-bold">
                Generation de playlist
            </div>
            <div class="card-body d-grid gap-0 row-gap-3">
                <div class="row">
                    <div class="col-md-6">
                        <label for="duree" class="form-label">Durée Totale</label>
                        <input class="form-control" v-model="playlistGenerationForm.dureeTotale" type="time" id="duree"
                            step="1">
                    </div>
                    <div class="col-md-6">
                        <label for="artist" class="form-label">Artiste(s) a inclure</label>
                        <VueMultiselect id="artist" v-model="playlistGenerationForm.artistesSelectionnes"
                            :options="artistes" :multiple="true" :close-on-select="false" label="nom" track-by="id"
                            placeholder="Sélectionner un ou plusieurs artiste(s)" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <label for="genre" class="form-label">Genre(s)</label>
                        <VueMultiselect id="genre" v-model="playlistGenerationForm.genresSelectionnes" :options="genres"
                            :multiple="true" :close-on-select="false" label="libelle" track-by="id"
                            placeholder="Sélectionner un ou plusieurs genre(s)" />
                    </div>
                    <div class="col-md-6">
                        <label for="langue" class="form-label">Langue(s)</label>
                        <VueMultiselect id="langue" v-model="playlistGenerationForm.languesSelectionnees"
                            :options="langues" :multiple="true" :close-on-select="false" label="libelle" track-by="id"
                            placeholder="Sélectionner une ou plusieurs langue(s)" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-6 d-flex gap-2">
                        <BaseButton @click="generatePlaylist">Générer</BaseButton>
                        <BaseButton variant="secondary" @click="handleReset">Annuler</BaseButton>
                    </div>
                </div>
            </div>
        </div>
        <div class="card" v-if="generatedPlaylist.length !== 0">
            <div class="card-body">
                <BaseTable :columns="playlistColumns" :items="generatedPlaylist" :page-size="5">
                    <template #cell-url="{ item }">
                        <audio :src="`http://localhost:8080${item.url}`" controls></audio>
                    </template>
                    <template #cell-actions="{ item }">
                        <div class="d-flex gap-2">
                            <BaseButton variant="success" @click="openReplace(item)">Remplacer</BaseButton>
                            <BaseButton variant="danger" @click="deleteTrack(item.id)">Supprimer</BaseButton>
                        </div>
                    </template>
                </BaseTable>
                <BaseButton @click="handleOpenPlaylistModal" class="mt-4">Sauvegarder</BaseButton>
            </div>
        </div>
    </div>
    <BaseModal v-model="openModal" title="Enregistrement de playlist" size="md">
        <div>
            <label>Entrer le nom du playlist</label>
            <BaseInput v-model="playlistName" type="text"></BaseInput>
        </div>
        <template #footer="{ close }">
            <BaseButton variant="secondary" @click="close">Fermer</BaseButton>
            <BaseButton @click="saveGeneratedPlaylist(playlistName)">Enregistrer</BaseButton>
        </template>
    </BaseModal>

    <BaseModal v-model="openReplaceModal" title="Remplacer le morceau" size="md">
        <p>Morceau actuel : {{ trackToReplace?.titre }} — {{ trackToReplace?.nomArtiste }}</p>
        <VueMultiselect v-model="selectedReplacement" :options="candidateTracks" label="titre" track-by="id"
            placeholder="Choisir un morceau de remplacement" />
        <audio v-if="selectedReplacement" :src="`http://localhost:8080${selectedReplacement.url}`" controls></audio>
        <template #footer="{ close }">
            <BaseButton variant="secondary" @click="close">Annuler</BaseButton>
            <BaseButton :disabled="!selectedReplacement" @click="confirmReplace(close)">Confirmer</BaseButton>
        </template>
    </BaseModal>
</template>
<script setup lang="ts">
import VueMultiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'
import { usePlaylistGeneration } from '@/composables/playlist/usePlaylistGeneration.ts';
import { onMounted, ref } from 'vue';
import BaseButton from '../ui/button/BaseButton.vue';
import type { TableColumn } from '../ui/table/BaseTable.types.ts';
import type { IMorceauPlaylist } from '@/types/morceauPlaylist.ts';
import BaseTable from '../ui/table/BaseTable.vue';
import { useDurationConverter } from '@/composables/global/useDurationConverter.ts';
import BaseModal from '../ui/modal/BaseModal.vue';
import BaseInput from '../ui/input/BaseInput.vue';

const { genres, artistes, langues, playlistGenerationForm, generatedPlaylist, playlistName, openReplaceModal, candidateTracks,
    trackToReplace,
    selectedReplacement, defaultForm, getInitialData, generatePlaylist, saveGeneratedPlaylist, deleteTrack, confirmReplace, openReplace } = usePlaylistGeneration()
const { convertInHHMMSS } = useDurationConverter()
const openModal = ref<boolean>(false)
onMounted(async () => {
    await getInitialData()
})
function handleReset() {
    Object.assign(playlistGenerationForm, defaultForm())
}
function handleOpenPlaylistModal() {
    openModal.value = !openModal.value
}
const playlistColumns: TableColumn<IMorceauPlaylist>[] = [
    { key: "nomArtiste", label: "artiste", align: "center" },
    { key: "titre", label: "titre", align: "center" },
    { key: "libelleGenre", label: "genre", align: "center" },
    { key: "libelleLangue", label: "langue", align: "center" },
    { key: "url", label: "mp3", align: 'center' },
    { key: "duree", label: "duree", formatter: (v) => convertInHHMMSS(v), align: "center", total: true, totalFormatter: (v) => convertInHHMMSS(v) },
    { key: "actions", label: "Actions", align: "center" }
]
</script>

<style scoped>
.card {
    background-color: var(--surface-color);
    border: 1px solid var(--border-subtle);
    color: var(--text-color);
}

.card-header {
    background-color: var(--bg-gray);
    border-bottom: 1px solid var(--border-subtle);
    color: var(--text-color);
}

.form-label,
label {
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

.form-control[type="time"]::-webkit-calendar-picker-indicator {
    filter: invert(1) brightness(1.5);
    cursor: pointer;
}

audio {
    filter: invert(0.85) hue-rotate(180deg) brightness(1.1);
    border-radius: 6px;
}

/* ==== Overrides vue-multiselect (composant tiers, DOM hors template) ==== */
:deep(.multiselect) {
    color: var(--text-color);
}

:deep(.multiselect__tags) {
    background-color: var(--bg-gray);
    border: 1px solid var(--border-subtle);
    min-height: 38px;
}

:deep(.multiselect__input),
:deep(.multiselect__single) {
    background-color: transparent;
    color: var(--text-color);
}

:deep(.multiselect__placeholder) {
    color: var(--text-tertiary);
    padding-top: 2px;
}

:deep(.multiselect__content-wrapper) {
    background-color: var(--surface-color);
    border: 1px solid var(--border-subtle);
}

:deep(.multiselect__option) {
    color: var(--text-color);
}

:deep(.multiselect__option--highlight) {
    background-color: var(--primary-color);
    color: var(--body-color);
}

:deep(.multiselect__option--selected) {
    background-color: var(--surface-active);
    color: var(--primary-color);
    font-weight: 600;
}

:deep(.multiselect__option--selected.multiselect__option--highlight) {
    background-color: var(--error-color);
    color: var(--w-color);
}

:deep(.multiselect__tag) {
    background-color: var(--primary-color);
    color: var(--body-color);
}

:deep(.multiselect__tag-icon:after) {
    color: var(--body-color);
}

:deep(.multiselect__tag-icon:hover) {
    background-color: #2a9bc4;
}

:deep(.multiselect__select::before) {
    border-color: var(--text-secondary) transparent transparent;
}
</style>