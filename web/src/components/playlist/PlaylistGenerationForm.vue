<template>
    <div class="container">
        <div class="card text-left">
            <div class="card-header fs-1 fw-bold">
                Generation de playlist
            </div>
            <div class="card-body d-grid gap-0 row-gap-3">
                <div class="row">
                    <div class="col-md-6">
                        <label for="duree" class="form-label">Durée Totale</label>
                        <input class="form-control"  v-model="playlistForm.dureeTotale" type="time" id="duree" step="1">
                    </div>
                    <div class="col-md-6">
                        <label for="artist">Artiste(s) a inclure</label>
                        <VueMultiselect id="artist" v-model="playlistForm.artistesSelectionnes" :options="artistes" :multiple="true"
                            :close-on-select="false" label="nom" track-by="id"
                            placeholder="Sélectionner un ou plusieurs artiste(s)" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <label for="genre">Genre(s)</label>
                        <VueMultiselect id="genre" v-model="playlistForm.genresSelectionnes" :options="genres" :multiple="true"
                            :close-on-select="false" label="libelle" track-by="id"
                            placeholder="Sélectionner un ou plusieurs genre(s)" />
                    </div>
                    <div class="col-md-6">
                        <label for="langue">Langue(s)</label>
                        <VueMultiselect id="langue" v-model="playlistForm.languesSelectionnees" :options="langues" :multiple="true"
                            :close-on-select="false" label="libelle" track-by="id"
                            placeholder="Sélectionner une ou plusieurs langue(s)" />
                    </div>
                </div>
                <div class="row">
                    <div class="col-6 d-flex gap-2">
                        <BaseButton>Générer</BaseButton>
                        <BaseButton variant="secondary" @click="handleReset">Annuler</BaseButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import VueMultiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'
import { usePlaylistForm } from '@/composables/playlist/usePlaylistForm';
import { onMounted, watch } from 'vue';
import BaseButton from '../ui/button/BaseButton.vue';

const { genres, artistes, langues,playlistForm,defaultForm,getInitialData,  } = usePlaylistForm()
onMounted(async () => {
    await getInitialData()
})
function handleReset(){
    Object.assign(playlistForm,defaultForm())
}
</script>