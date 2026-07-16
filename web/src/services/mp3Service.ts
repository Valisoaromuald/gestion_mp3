import { gestionMp3Api } from "@/api/clients/gestionMp3Api";
import BaseService from "./baseService"
import type { IMp3 } from "@/types/mp3";

class Mp3Service extends BaseService {
    public endpoint: string = 'api/mp3'
    public buildMp3FormData(file: File | null, idArtiste: number, idAlbum: number, idGenre:  number, idLangue: number) {
        const formData = new FormData()
        if (file) {
            formData.append("fichier", file);
            formData.append("id_artiste", String(idArtiste));
            formData.append("id_album", String(idAlbum));
            formData.append("id_genre", String(idGenre));
            formData.append("id_langue", String(idLangue));
        }
        return formData;
    }
    public async getAll(): Promise<IMp3[]   >{
        try {
            return (await gestionMp3Api.get<IMp3[]>(this.endpoint)).data;
        } catch (error) {
            throw error;
        }
    }
}
export const mp3Service = new Mp3Service()