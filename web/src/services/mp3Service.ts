import BaseService from "./baseService"

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
}
export const mp3Service = new Mp3Service()