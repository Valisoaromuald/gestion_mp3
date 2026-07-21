import type { IPlaylist } from "@/types/playlist"

class PlaylistService{
    endpoint : string ='api/playlist'
    createInputObject(playlistName:string,idUtilisateur:number):Partial<IPlaylist>{
        return {
            nom:playlistName,
            idUtilisateur : idUtilisateur
        }
    }
}
export const playlistService = new PlaylistService()