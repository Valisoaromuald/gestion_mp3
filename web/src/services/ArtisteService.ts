import { gestionMp3Api } from "@/api/clients/gestionMp3Api";
import type { IArtiste } from "@/types/artiste";
import BaseService from "./baseService";

class ArtisteService extends BaseService{
    endpoint:string = 'api/artistes'
    public async findByNom(nom: string): Promise<IArtiste | null> {
            try {
                const params = {
                    nom: nom
                }
                const response = await gestionMp3Api.get<IArtiste[]>(this.endpoint, params);
                return response.data[0] ?? null;
            } catch (error) {
                throw error;
            }
        }
}
export const artisteService = new ArtisteService()