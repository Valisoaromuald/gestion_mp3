import { albumService } from '@/services/albumService.'
import { artisteService } from '@/services/ArtisteService'
import { genreService } from '@/services/genreService'
import { metadataService } from '@/services/metadataService'
import { mp3Service } from '@/services/mp3Service'
import type { IAlbum } from '@/types/album'
import type { IArtiste } from '@/types/artiste'
import type { IGenre } from '@/types/genre'
import type { IMetadata } from '@/types/metadata'
import type { IMp3, MorceauForm } from '@/types/mp3'
import { dateUtils } from '@/utils/dateUtils'
import type { AxiosResponse } from 'axios'
import { reactive, ref } from 'vue'
export function useMorceauForm() {
    const formData = reactive<MorceauForm>({
        artiste: '',
        titre:'',
        album: '',
        genre: '',
        annee: null,
        duree: ''
    })

    const fichier = ref<File | null>(null)
    const anneeMax = new Date().getFullYear()
    const artisteEndPoint: string = artisteService.endpoint
    const albumEndpoint: string = albumService.endpoint
    const genderEndpoint: string = genreService.endpoint
    const mp3Endpoint: string = mp3Service.endpoint
    const messageAfterAction  = ref<string>('')
    function handleFileChange(event: Event) {
        const target = event.target as HTMLInputElement
        fichier.value = target.files?.[0] ?? null
    }

    function resetForm() {
        formData.artiste = ''
        formData.album = ''
        formData.annee = null
        formData.duree = ''
        fichier.value = null
    }

    function isValid(): boolean {
        return !!fichier.value && !!formData.artiste && !!formData.album && !!formData.annee && !!formData.duree
    }
    async function insertMp3() {
        try {

            if (isValid()) {
                const existingArtiste: IArtiste | null = await artisteService.findByNom(formData.artiste)
                const existingAlbum: IAlbum | null = await albumService.findByLibelle<IAlbum | null>(albumService.endpoint, formData.album)
                const existingGender: IGenre | null = await genreService.findByLibelle<IGenre | null>(genreService.endpoint, formData.genre)
                let idArtiste : number = existingArtiste?.id  ?? 0; 
                let idAlbum : number = existingAlbum?.id ?? 0; 
                let idGenre : number =  existingGender?.id ?? 0; 
                if (!existingArtiste) {
                    idArtiste = (await artisteService.create<Partial<IArtiste>>(artisteEndPoint,{nom:formData.artiste})).id ?? 0;   
                }
                if (!existingAlbum) {
                    idAlbum = (await albumService.create<Partial<IGenre>>(albumEndpoint,{libelle:formData.album})).id  ?? 0;     
                }
                if (!existingGender) {
                    idGenre = (await artisteService.create<Partial<IGenre>>(genderEndpoint,{libelle:formData.genre})).id ?? 0;
                     
                }
                const mp3FormData :FormData = mp3Service.buildMp3FormData(fichier.value ,String(idArtiste),String(idAlbum),String(idGenre))
                const idMp3 = (await mp3Service.create<FormData,any>(mp3Endpoint,mp3FormData,{headers: {"Content-Type":"multipart/form-data"}})).id ?? 0
                const metadataInput :Partial<IMetadata> = metadataService.createInputObject(formData.titre,formData.annee ?? 0,dateUtils.convertTimeToSeconds(formData.duree),idMp3) 
                messageAfterAction.value = 'mp3 insere avec succes';
            }
        } catch (error) {

            throw error;
        }
    }

    return {
        formData,
        fichier,
        anneeMax,
        messageAfterAction,
        handleFileChange,
        resetForm,
        isValid,
        insertMp3
    }
}
