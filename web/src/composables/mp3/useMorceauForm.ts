import { gestionMp3Api } from '@/api/clients/gestionMp3Api'
import { albumService } from '@/services/albumService'
import { artisteService } from '@/services/ArtisteService'
import { genreService } from '@/services/genreService'
import { langueService } from '@/services/langueService'
import { metadataService } from '@/services/metadataService'
import { mp3Service } from '@/services/mp3Service'
import type { IAlbum } from '@/types/album'
import type { IArtiste } from '@/types/artiste'
import type { IGenre } from '@/types/genre'
import type { ILangue } from '@/types/langue'
import type { IMetadata } from '@/types/metadata'
import type { MorceauForm } from '@/types/mp3'
import { dateUtils } from '@/utils/dateUtils'
import { reactive, ref } from 'vue'

export function useMorceauForm() {
    const formData = reactive<MorceauForm>({
        artiste: '',
        titre: '',
        langue: '',
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
    const messageAfterAction = ref<string>('')
    const dureeLoading = ref<boolean>(false)
    const dureeError = ref<string>('')

    // Lit la durée réelle du fichier audio via l'API HTMLAudioElement
    function extractAudioDuration(file: File): Promise<number> {
        return new Promise((resolve, reject) => {
            const audio = new Audio()
            const objectUrl = URL.createObjectURL(file)

            audio.addEventListener('loadedmetadata', () => {
                URL.revokeObjectURL(objectUrl)
                resolve(audio.duration)
            })

            audio.addEventListener('error', () => {
                URL.revokeObjectURL(objectUrl)
                reject(new Error('Impossible de lire les métadonnées du fichier audio.'))
            })

            audio.src = objectUrl
        })
    }

    // Convertit un nombre de secondes en "HH:MM:SS" (format attendu par l'input time / dateUtils)
    function secondsToHHMMSS(totalSeconds: number): string {
        const rounded = Math.round(totalSeconds)
        const h = Math.floor(rounded / 3600)
        const m = Math.floor((rounded % 3600) / 60)
        const s = rounded % 60
        return [h, m, s].map(v => String(v).padStart(2, '0')).join(':')
    }

    async function handleFileChange(event: Event) {
        const target = event.target as HTMLInputElement
        const file = target.files?.[0] ?? null
        fichier.value = file

        if (!file) {
            formData.duree = ''
            return
        }

        dureeError.value = ''
        dureeLoading.value = true
        try {
            const durationInSeconds = await extractAudioDuration(file)
            formData.duree = secondsToHHMMSS(durationInSeconds)
        } catch (error) {
            dureeError.value = "Impossible de calculer la durée automatiquement."
            formData.duree = ''
        } finally {
            dureeLoading.value = false
        }
    }

    function resetForm() {
        formData.artiste = ''
        formData.album = ''
        formData.annee = null
        formData.duree = ''
        fichier.value = null
        dureeError.value = ''
    }

    function isValid(): boolean {
        return !!fichier.value && !!formData.artiste && !!formData.album && !!formData.annee && !!formData.duree
    }

    async function insertMp3() {
        try {
            if (isValid()) {
                const existingArtiste: IArtiste | null = await artisteService.findByNom(formData.artiste)
                const existingAlbum: IAlbum | null = await albumService.findByLibelle<IAlbum>(albumService.endpoint, formData.album)
                const existingGender: IGenre | null = await genreService.findByLibelle<IGenre>(genreService.endpoint, formData.genre)
                const existingLanguage: IGenre | null = await genreService.findByLibelle<IGenre>(langueService.endpoint, formData.langue)
                let idArtiste: number = existingArtiste?.id ?? 0;
                let idAlbum: number = existingAlbum?.id ?? 0;
                let idGenre: number = existingGender?.id ?? 0;
                let idLangue: number = existingLanguage?.id ?? 0;
                if (!existingArtiste) {
                    idArtiste = (await artisteService.create<Partial<IArtiste>>(artisteEndPoint, { nom: formData.artiste })).id ?? 0;
                }
                if (!existingAlbum) {
                    idAlbum = (await albumService.create<Partial<IGenre>>(albumEndpoint, { libelle: formData.album })).id ?? 0;
                }
                if (!existingGender) {
                    idGenre = (await artisteService.create<Partial<IGenre>>(genderEndpoint, { libelle: formData.genre })).id ?? 0;
                }
                if (!existingLanguage) {
                    idGenre = (await artisteService.create<Partial<ILangue>>(genderEndpoint, { libelle: formData.genre })).id ?? 0;
                }
                const mp3FormData: FormData = mp3Service.buildMp3FormData(fichier.value, idArtiste, idAlbum, idGenre, idLangue)
                const idMp3 = (await mp3Service.create<FormData, any>(mp3Endpoint, mp3FormData, { headers: { "Content-Type": "multipart/form-data" } })).id ?? 0
                const metadataInput: Partial<IMetadata> = metadataService.createInputObject(formData.titre, formData.annee ?? 0, dateUtils.convertTimeToSeconds(formData.duree), idMp3)
                await gestionMp3Api.post<Partial<IMetadata>>(metadataService.endpoint, metadataInput)
                messageAfterAction.value = 'mp3 insere avec succes';
            }
        } catch (error) {
            messageAfterAction.value = "erreur survenu lors de l'insertion de mp3 "
            throw error;
        }
    }

    return {
        formData,
        fichier,
        anneeMax,
        messageAfterAction,
        dureeLoading,
        dureeError,
        handleFileChange,
        resetForm,
        isValid,
        insertMp3
    }
}