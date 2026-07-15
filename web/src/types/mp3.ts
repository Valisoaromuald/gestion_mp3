export interface MorceauForm {
    artiste: string
    titre:string
    album: string
    genre:string
    langue:string
    annee: number | null
    duree: string
}
export interface IMp3{
    id: number
    file : File
    id_artiste: number
    id_genre:number
    id_album:number
    [key:string]:any
}