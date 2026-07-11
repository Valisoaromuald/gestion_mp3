import type { IMetadata } from "@/types/metadata"

class MetadataService{
    endpoint :string = 'api/metadata'
    createInputObject(
    titre:string,
    annee: number,
    duree:number,
    idMp3:number) : Partial<IMetadata>{
        return{
            titre: titre,
            annee:annee,
            duree:duree,
            mp3:{
                id:idMp3
            }
        }
        
    }
}
export const metadataService= new MetadataService()