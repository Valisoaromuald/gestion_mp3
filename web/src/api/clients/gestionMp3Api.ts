import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";

class GestionMp3Api {
    public instance: AxiosInstance;
    constructor() {
        this.instance = axios.create({
            baseURL: import.meta.env.API_URL,
        })
    }
    public async get<T = any>(
        endpoint: string,
        params: any = {},
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        return this.instance.get<T>(endpoint, {
            params,
            paramsSerializer: {
                indexes: null 
            },
            ...config
        })
    }
    public async post<T = any>(
        endpoint: string,
        data: any = {},
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> {
        return this.instance.post<T>(endpoint, data,{
            paramsSerializer: {
                indexes: null 
            },
            ...config
        } );
    }
    public async put<T = any>(endpoint: string, data: any = {}): Promise<AxiosResponse<T>> {
        return this.instance.put(endpoint, data)
    }
    public async delete<T = any>(endpoint: string): Promise<AxiosResponse<T>> {
        return this.instance.delete(endpoint)
    }
}
export const gestionMp3Api = new GestionMp3Api()