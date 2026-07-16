import { gestionMp3Api } from "@/api/clients/gestionMp3Api";
import { mp3Service } from "@/services/mp3Service";
import type { IMp3 } from "@/types/mp3";
import { ref } from "vue";

export function useMp3List() {
    const mp3List = ref<IMp3[]>([])
    const loading = ref<boolean>(false)
    const error = ref<string>('');
    const currentPage = ref(0)
    const totalPages = ref(0)
    const pageSize = ref(4)
    async function getMp3List(page: number = 0) {
        try {
            loading.value =true;
            mp3List.value = []
            const response = await gestionMp3Api.get(mp3Service.endpoint, {
                page,
                size: pageSize.value
            })
            mp3List.value = response.data.items
            currentPage.value = response.data.currentPage
            totalPages.value = response.data.totalPages
        } catch (err) {
            error.value = "erreur lors de la recuperation des mp3";
            throw err;
        }
        finally {
            loading.value = false
        }
    }
    return {
        mp3List,
        loading,
        error,
        currentPage,
        totalPages,
        getMp3List
    }
}