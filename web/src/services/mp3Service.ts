import BaseService from "./baseService"

class Mp3Service extends BaseService{
    public endpoint :string = 'api/mp3'
    public  buildMp3FormData(file:File | null,idArtiste:string,idAlbum:string,idGenre:string){
        const formData = new FormData()
        if(!!file){
            formData.append("fichier",file)
            formData.append("id_artiste",idArtiste)
            formData.append("id_album",idAlbum)
            formData.append("ig_genre",idGenre)
        }
        return formData;
    }
}
export const mp3Service = new Mp3Service()