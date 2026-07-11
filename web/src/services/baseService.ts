import axios from "axios";
import { gestionMp3Api } from "@/api/clients/gestionMp3Api";

export default class BaseService {

    public async create<T = any, R = T>(
        endpoint: string,
        inputObject: T,
        config?: any
    ): Promise<R> {
        const res = await gestionMp3Api.post(endpoint, inputObject, config);
        return res.data;
    }

    public async findByLibelle<T>(
        endpoint: string,
        libelle: string
    ): Promise<T | null> {
        try {
            const response = await gestionMp3Api.get<T>(
                `${endpoint}/libelle/${encodeURIComponent(libelle)}`
            );

            return response.data;
        } catch (error: unknown) {

            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }

            throw error;
        }
    }
}