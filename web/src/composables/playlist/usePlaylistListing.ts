// composables/playlist/usePlaylistListing.ts
import { ref } from 'vue'
import { gestionMp3Api } from '@/api/clients/gestionMp3Api'
import { playlistService } from '@/services/playlistService'
import { useToast } from '@/components/ui/toast/useToast'
import type { IPlaylist } from '@/types/playlist'
import { useRouter } from 'vue-router'

export function usePlaylistListing() {
    const playlists = ref<IPlaylist[]>([])
    const toast = useToast()
    const router = useRouter()

    async function getPlaylists() {
        try {
            playlists.value = (await gestionMp3Api.get<IPlaylist[]>(playlistService.endpoint)).data
        } catch (error) {
            toast.notifyError("Erreur lors du chargement des playlists")
            throw error
        }
    }

    async function downloadPlaylist(playlist: IPlaylist) {
        try {
            const response = await gestionMp3Api.get<Blob>(
                `${playlistService.endpoint}/${playlist.id}/download`,
                {},
                { responseType: 'blob' } // ⚠️ adapte selon la signature réelle de ton client axios
            )
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${playlist.nom}.zip`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            toast.notifyError(`Erreur lors du téléchargement de "${playlist.nom}"`)
            throw error
        }
    }

    function listenPlaylist(playlist: IPlaylist) {
        router.push({
            name: 'playlist-player',
            params: { id: playlist.id },
            query: { nom: playlist.nom }
        })
    }

    return { playlists, getPlaylists, downloadPlaylist, listenPlaylist }
}