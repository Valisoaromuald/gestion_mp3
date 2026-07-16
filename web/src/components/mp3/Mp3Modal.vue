<template>
    <Transition name="modalTransition">
        <div v-if="display" class="modal-overlay" @click="display = false">
            <div class="modal-dialog" @click.stop>
                <button type="button" class="btn-close-custom" @click="display = false" aria-label="Fermer">
                    &times;
                </button>
                <h1 class="display-5">Modification metadata mp3</h1>
                <div class="container">
                    
                    <form class="row g-3" @submit.prevent="handleSubmit">
                        <div class="col-md-6">
                            <label for="artiste" class="form-label">Artiste</label>
                            <input class="form-control" v-model.trim="modalForm.artiste" type="text" id="artiste" required>
                        </div>
                        <div class="col-md-6">
                            <label for="titre" class="form-label">Titre</label>
                            <input class="form-control" v-model.trim="modalForm.titre" type="text" id="titre" required>
                        </div>
                        <div class="col-md-6">
                            <label for="genre" class="form-label" >Genre</label>
                            <input class="form-control" type="text" id="genre" v-model.trim="modalForm.genre" required>
                        </div>
                        <div class="col-md-6">
                            <label for="album" class="form-label" >Album</label>
                            <input class="form-control" type="text" id="album" v-model.trim="modalForm.album" required>
                        </div>
                        <div class="col-md-6">
                            <label for="langue"  class="form-label">Langue</label>
                            <input class="form-control" v-model.trim="modalForm.langue" type="text" id="langue" required>
                        </div>
                        <div class="col-md-6">
                            <label for="annee" class="form-label" >Année</label>
                            <input class="form-control" v-model="modalForm.annee" type="number" id="annee" min="1900">
                        </div>
                        <div class="col-12">
                            <button type="submit" class="btn btn-primary">Modifier</button>
                            <button type="reset" class="btn btn-outline-secondary ms-2">
                                Reinitialiser
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </Transition>
</template>
<script setup lang="ts">
import { useMp3Modal } from '@/composables/mp3/useMp3Modal';
import type { IMp3 } from '@/types/mp3';

const display = defineModel<boolean>({ default: false });
const props = withDefaults(defineProps<{mp3? : IMp3 | null}>(),{
    mp3:null
})
const {modalForm,handleUpdateMp3} = useMp3Modal()
async function handleSubmit() {
   await handleUpdateMp3();
}
</script>
<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
}

.modal-dialog {
    background-color: #ffffff;
    padding: 2rem;
    max-width: 700px;
    width: 100%;
    border-radius: 0.5rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    pointer-events: auto;
    position: relative; 
}
.modal-dialog {
    background-color: var(--bs-body-bg);  /* 👈 s'adapte au thème */
    color: var(--bs-body-color);
}

.btn-close-custom {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.75rem;
    line-height: 1;
    color: #6c757d;
    cursor: pointer;
    padding: 0;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.25rem;
    transition: background-color 0.15s ease, color 0.15s ease;
}

.btn-close-custom:hover {
    background-color: #f1f1f1;
    color: #000;
}

.modalTransition-enter-active,
.modalTransition-leave-active {
    transition: opacity 0.3s ease;
}

.modalTransition-enter-active .modal-dialog,
.modalTransition-leave-active .modal-dialog {
    transition: transform 0.3s ease;
}

.modalTransition-enter-from,
.modalTransition-leave-to {
    opacity: 0;
}

.modalTransition-enter-to,
.modalTransition-leave-from {
    opacity: 1;
}

.modalTransition-enter-from .modal-dialog,
.modalTransition-leave-to .modal-dialog {
    transform: translateY(-100vh);
}

.modalTransition-enter-to .modal-dialog,
.modalTransition-leave-from .modal-dialog {
    transform: translateY(0);
}


</style>