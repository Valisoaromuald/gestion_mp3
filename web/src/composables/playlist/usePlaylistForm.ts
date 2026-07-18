import { gestionMp3Api } from "@/api/clients/gestionMp3Api";
import { artisteService } from "@/services/ArtisteService";
import { genreService } from "@/services/genreService";
import { langueService } from "@/services/langueService";
import type { IArtiste } from "@/types/artiste";
import type { IGenre } from "@/types/genre"
import type { ILangue } from "@/types/langue";
import { reactive, ref } from "vue"
interface PlaylistForm {
    dureeTotale: string
    artistesSelectionnes: IArtiste[]
    genresSelectionnes: IGenre[]
    languesSelectionnees: ILangue[]
}
export function usePlaylistForm() {
    const genres = ref<IGenre[]>([]);
    const artistes = ref<IArtiste[]>([]);
    const langues = ref<ILangue[]>([]);

    const playlistForm = reactive<PlaylistForm>(
        defaultForm()
    )
    function defaultForm() {
        return {
            dureeTotale: '',
            artistesSelectionnes: [],
            genresSelectionnes: [],
            languesSelectionnees: []
        }
    }
    async function getInitialData() {
        try {
            const [genresRes, artistesRes, languesRes] = await Promise.all([
                gestionMp3Api.get<IGenre[]>(genreService.endpoint),
                gestionMp3Api.get<IArtiste[]>(artisteService.endpoint),
                gestionMp3Api.get<ILangue[]>(langueService.endpoint)
            ]);

            genres.value = genresRes.data;
            artistes.value = artistesRes.data;
            langues.value = languesRes.data;
        } catch (error) {
            console.error("Erreur lors du chargement des données initiales :", error);
        }
    }

    return {
        genres,
        artistes,
        langues,
        playlistForm,
        defaultForm,
        getInitialData
    }
}