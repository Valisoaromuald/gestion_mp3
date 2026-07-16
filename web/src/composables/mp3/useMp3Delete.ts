import { gestionMp3Api } from "@/api/clients/gestionMp3Api";
import { useToast } from "@/components/ui/toast/useToast";
import { mp3Service } from "@/services/mp3Service";

export function useMp3Delete() {
    const toast = useToast();
    async function handleDeleteMp3(mp3Id:number) {
        try {
            const confirmed :boolean= confirm(`Voulez vous vraiment supprimer mp3 #${mp3Id}`)
            if(confirmed){
                await gestionMp3Api.delete(mp3Service.endpoint+`/${mp3Id}`)
                toast.notifyDeleted("Mp3")
            }
        } catch (error) {
            toast.notifyError(`Echec lors de la suppression  du mp3 #${mp3Id}`)
            throw error;
        }
    }
    return {
        handleDeleteMp3
    }
}