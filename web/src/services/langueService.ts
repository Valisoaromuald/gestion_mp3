
import BaseService from "./baseService";

class LangueService extends BaseService{
    endpoint: string = 'api/langues'
}
export const langueService = new LangueService()