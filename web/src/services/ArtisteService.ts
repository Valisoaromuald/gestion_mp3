import { gestionMp3Api } from "@/api/clients/gestionMp3Api";
import type { IArtiste } from "@/types/artiste";
import BaseService from "./baseService";
import axios from "axios";


class ArtisteService extends BaseService {
    endpoint: string = "api/artistes";

    public async findByNom(nom: string): Promise<IArtiste | null> {
        try {
            const response = await gestionMp3Api.get<IArtiste>(
                `${this.endpoint}/nom/${encodeURIComponent(nom)}`
            );

            return response.data;
        } catch (error: unknown) {

            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    return null;
                }
            }

            throw error;
        }
    }
}
export const artisteService = new ArtisteService()