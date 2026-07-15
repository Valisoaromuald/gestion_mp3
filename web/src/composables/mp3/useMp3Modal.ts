import type { IMp3, MorceauForm } from "@/types/mp3";
import { reactive, ref } from "vue";

const modalForm = reactive<Partial<MorceauForm>>({
        artiste: '',
        titre: '',
        langue: '',
        album: '',
        genre: '',
        annee: 0,
        duree: ''
    })
export function useMp3Modal(){
    const openModal = ref<boolean>(false);
    function toggleModal(){
        openModal.value = !openModal.value
    }
    function handleOpenModal(mp3:IMp3){
        console.log(mp3.artiste)
        console.log(mp3.annee)
        console.log(mp3.langue)
        modalForm.artiste = mp3.artiste;
        modalForm.annee = mp3.annee;
        modalForm.duree = mp3.duree;
        modalForm.langue = mp3.langue;
        toggleModal();
    }
    return{
        openModal,
        handleOpenModal,
        modalForm
    }
    
}