import { gestionMp3Api } from "@/api/clients/gestionMp3Api";
import { useToast } from "@/components/ui/toast/useToast";
import { artisteService } from "@/services/ArtisteService";
import { genreService } from "@/services/genreService";
import { langueService } from "@/services/langueService";
import type { IArtiste } from "@/types/artiste";
import type { IGenre } from "@/types/genre"
import type { ILangue } from "@/types/langue";
import { reactive, ref } from "vue"
import { useDurationConverter } from "../global/useDurationConverter";
import type { IMorceauPlaylist } from "@/types/morceauPlaylist";
import { playlistService } from "@/services/playlistService";
import { playlistMp3Service } from "@/services/playlistMp3Service";
import { mp3Service } from "@/services/mp3Service";
interface PlaylistGenerationForm {
    dureeTotale: string
    artistesSelectionnes: IArtiste[]
    genresSelectionnes: IGenre[]
    languesSelectionnees: ILangue[]
}
export function usePlaylistGeneration() {
    const genres = ref<IGenre[]>([]);
    const artistes = ref<IArtiste[]>([]);
    const langues = ref<ILangue[]>([]);
    const generatedPlaylist = ref<IMorceauPlaylist[]>([]);
    const toast = useToast();
    const playlistName = ref<string>('')
    const { convertInSeconds } = useDurationConverter()
    const openReplaceModal = ref<boolean>(false)
    const trackToReplace = ref<IMorceauPlaylist | null>(null)
    const selectedReplacement = ref<IMorceauPlaylist | null>(null)
    const candidateTracks = ref<IMorceauPlaylist[]>([])
    const playlistGenerationForm = reactive<PlaylistGenerationForm>(
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
    async function generatePlaylist() {
        try {

            const params: Object = {
                dureeTotale: convertInSeconds(playlistGenerationForm.dureeTotale) + 59,
                idsArtistes: playlistGenerationForm.artistesSelectionnes.map(a => a.id),
                idsGenres: playlistGenerationForm.genresSelectionnes.map(g => g.id),
                idsLangues: playlistGenerationForm.languesSelectionnees.map(l => l.id),
            }
            generatedPlaylist.value = (await gestionMp3Api.get<IMorceauPlaylist[]>(playlistService.endpoint + "/generation", params)).data;
            toast.success("Playlist genere avec succes");
            playlistName.value = ''
        } catch (error) {
            toast.notifyError("erreur lors de la generation de playlist");
            throw error;
        }
    }
    async function saveGeneratedPlaylist(playlistName: string) {
        try {
            if (playlistName !== "") {
                const playlistInputObj = playlistService.createInputObject(playlistName, 1);
                const createdPlaylistId = (await gestionMp3Api.post<number>(playlistService.endpoint + "/save", playlistInputObj)).data;
                const mp3Ids = generatedPlaylist.value.map(playList => playList.mp3Id);
                const playlistMp3Object = {
                    idsMp3: mp3Ids,
                    idPlaylist: createdPlaylistId
                };
                const playlistMp3Ids: number[] = (await gestionMp3Api.post<number[]>(playlistMp3Service.endpoint + `/save-batch`, playlistMp3Object)).data;
                toast.notifyCreated(`playlist ${playlistName} enregistre avec succes`);
            }
            else {
                toast.notifyError(`aucun nom de playlist n'est fourni`)
            }
        } catch (error) {
            toast.notifyError(`erreur lors de l'enregistrement du playlist ${playlistName}`)
            throw error;
        }
    }
    function deleteTrack(mp3Id: number) {
        const deletionConfirmed = confirm(`Voulez vous supprimer mp3 #${mp3Id} du playlist`)
        if (deletionConfirmed) {
            generatedPlaylist.value = generatedPlaylist.value.filter(tr => tr.mp3Id !== mp3Id);
            toast.notifyDeleted(`mp3 #${mp3Id}  a ete supprime du playlist genere`)
        }
    }
    async function openReplace(item: IMorceauPlaylist) {
        trackToReplace.value = item
        selectedReplacement.value = null
        await getCandidateTracks(item)
        openReplaceModal.value = true
    }
    function confirmReplace(close: () => void) {
        if (trackToReplace.value && selectedReplacement.value) {
            replaceTrack(trackToReplace.value.mp3Id, selectedReplacement.value)
        }
        close()
    }
    function replaceTrack(oldTrackId: number, newTrack: IMorceauPlaylist) {
        const index = generatedPlaylist.value.findIndex(track => track.mp3Id === oldTrackId)
        if (index === -1) {
            toast.notifyError("Morceau à remplacer introuvable dans la playlist")
            return
        }
        generatedPlaylist.value.splice(index, 1, newTrack)
        toast.success(`Morceau remplacé par "${newTrack.titre}"`)
    }
    async function getCandidateTracks(item: IMorceauPlaylist) {
        try {
            const excludedIds = generatedPlaylist.value.map(track => track.mp3Id)
            const params = {
                excludedIds: excludedIds
            }
            candidateTracks.value = (await gestionMp3Api.get<IMorceauPlaylist[]>(
                `${mp3Service.endpoint}/${item.mp3Id}/candidats`,
                params
            )).data
            console.log(candidateTracks.value.length)
        } catch (error) {
            toast.notifyError("Erreur lors de la récupération des morceaux de remplacement")
            candidateTracks.value = []
            throw error
        }
    }

    return {
        genres,
        artistes,
        langues,
        playlistGenerationForm,
        generatedPlaylist,
        playlistName,
        openReplaceModal,
        trackToReplace,
        selectedReplacement,
        candidateTracks,
        saveGeneratedPlaylist,
        defaultForm,
        getInitialData,
        deleteTrack,
        openReplace,
        getCandidateTracks,
        confirmReplace,
        generatePlaylist
    }
}