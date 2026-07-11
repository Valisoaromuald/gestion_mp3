import { gestionMp3Api } from "@/api/clients/gestionMp3Api";
import type { IAlbum } from "@/types/album"
import BaseService from "./baseService";

class AlbumService extends BaseService{
    endpoint:string = 'api/albums'
}
export const albumService = new AlbumService()