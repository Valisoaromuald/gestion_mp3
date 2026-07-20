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
interface PlaylistGenerationForm {
    dureeTotale: string
    artistesSelectionnes: IArtiste[]
    genresSelectionnes: IGenre[]
    languesSelectionnees: ILangue[]
}
export function usePlaylistForm() {
    const genres = ref<IGenre[]>([]);
    const artistes = ref<IArtiste[]>([]);
    const langues = ref<ILangue[]>([]);
    const generatedPlaylist = ref<IMorceauPlaylist[]>([]);
    const toast = useToast();
    const playlistName = ref<string>('')
    const {convertInSeconds} = useDurationConverter()
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
    async function generatePlaylist(){
        try {

            const params : Object = {
                dureeTotale: convertInSeconds(playlistGenerationForm.dureeTotale)+59,
                idsArtistes: playlistGenerationForm.artistesSelectionnes.map(a=>a.id),
                idsGenres: playlistGenerationForm.genresSelectionnes.map(g=>g.id),
                idsLangues: playlistGenerationForm.languesSelectionnees.map(l=>l.id),
            }
            generatedPlaylist.value = (await gestionMp3Api.get<IMorceauPlaylist[]>(playlistService.endpoint+"/generation",params)).data;
            toast.success("Playlist genere avec succes");
            playlistName.value = ''
        } catch (error) {
            toast.notifyError("erreur lors de la generation de playlist");
            throw error;
        }
    }
    async function saveGeneratedPlaylist(playlistName:string){
        try {
            if(playlistName !== ""){
                const playlistInputObj = playlistService.createInputObject(playlistName,1);
                const createdPlaylistId = (await gestionMp3Api.post<number>(playlistService.endpoint+"/save",playlistInputObj)).data;
                const mp3Ids = generatedPlaylist.value.map(playList=> playList.id);
                const playlistMp3Object ={
                    idsMp3 : mp3Ids,
                    idPlaylist: createdPlaylistId
                };
                const playlistMp3Ids : number[] = (await gestionMp3Api.post<number[]>(playlistMp3Service.endpoint+`/save-batch`,playlistMp3Object)).data;
            toast.notifyCreated(`playlist ${playlistName} enregistre avec succes`);
            }
            else{
                toast.notifyError(`aucun nom de playlist n'est fourni`)
            }
        } catch (error) {
            toast.notifyError(`erreur lors de l'enregistrement du playlist ${playlistName}`)
            throw error;
        }
    }
    return {
        genres,
        artistes,
        langues,
        playlistGenerationForm,
        generatedPlaylist,
        playlistName,
        saveGeneratedPlaylist,
        defaultForm,
        getInitialData,
        generatePlaylist
    }
}