import { mp3Service } from "@/services/mp3Service";
import type { IMp3 } from "@/types/mp3";
import { ref } from "vue";

export function useMp3List(){
    const mp3List = ref<IMp3[]>([])
    const loading = ref<boolean>(true)
    const error = ref<string>('');
    async function getMp3List() {
        try {
            mp3List.value = await mp3Service.getAll();
        } catch (err) {
            error.value = "erreur lors de la recuperation des mp3";
            loading.value = false
            throw err;
        }
    }
    return {
        mp3List,
        loading,
        error,
        getMp3List
    }
}