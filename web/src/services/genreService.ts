
import BaseService from "./baseService";

class GenreService extends BaseService{
    endpoint: string = 'api/genres'
}
export const genreService = new GenreService()