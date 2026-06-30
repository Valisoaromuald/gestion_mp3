import { gestionMp3Api } from "@/api/clients/gestionMp3Api";
import type { AxiosRequestConfig } from "axios";

export default class BaseService {
    public async create<T=any,R=T>(endpoint:string,inputObject:T,config?:AxiosRequestConfig): Promise<R> {
        try {
            const insertResponse = await gestionMp3Api.post(endpoint, inputObject,config) ;
            return insertResponse.data 
        } catch (error) {
            throw error;
        }
    }
    public async findByLibelle<T>(endpoint: string, libelle: string): Promise<T | null> {
        try {
            const params = {
                libelle: libelle
            }
            const response = await gestionMp3Api.get<T[]>(endpoint, params);
            return response.data[0] ?? null;
        } catch (error) {
            throw error;
        }
    }
}