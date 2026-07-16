import type { IMp3, MorceauForm } from "@/types/mp3";
import { reactive, ref } from "vue";
import { gestionMp3Api } from "@/api/clients/gestionMp3Api";
import { mp3Service } from "@/services/mp3Service";
import { useToast } from "../../components/ui/toast/useToast";

const modalForm = reactive<Partial<MorceauForm>>({
    id: 0,
    artiste: '',
    titre: '',
    langue: '',
    album: '',
    genre: '',
    annee: 0,
    duree: ''
})
export function useMp3Modal() {
    const openModal = ref<boolean>(false);
    const toast = useToast()
    function toggleModal() {
        openModal.value = !openModal.value
    }
    function handleOpenModal(mp3: IMp3) {
        modalForm.titre = mp3.titre;
        modalForm.artiste = mp3.artiste;
        modalForm.annee = mp3.annee;
        modalForm.album = mp3.album;
        modalForm.genre = mp3.genre;
        modalForm.langue = mp3.langue;
        modalForm.id = mp3.id;
        toggleModal();
    }
    async function handleUpdateMp3() {
        try {
            const formData = new FormData();
            if (modalForm.titre) formData.append('titre', modalForm.titre)
            if (modalForm.annee !== undefined) formData.append('annee', String(modalForm.annee))
            if (modalForm.artiste) formData.append('artiste', modalForm.artiste)
            if (modalForm.album) formData.append('album', modalForm.album)
            if (modalForm.genre) formData.append('genre', modalForm.genre)
            if (modalForm.langue) formData.append('langue', modalForm.langue)
            const reponse = await gestionMp3Api.put(mp3Service.endpoint + `/${modalForm.id}`, formData);
            toast.success(`mise a jour des metadonnees avec succes mp3 #${modalForm.id}`)
            // console.log('4. APRÈS toast.success, toasts.length =', toast.toasts.value.length, toast.toasts)
        } catch (error) {
            
            toast.notifyError(`Echec lors de la mise a jour du mp3 #${modalForm.id}`)
            throw error;
        }
    }
    return {
        openModal,
        handleOpenModal,
        modalForm,
        handleUpdateMp3
    }

}