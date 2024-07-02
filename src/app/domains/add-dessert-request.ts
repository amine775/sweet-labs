import { File } from "buffer";

export interface AddDessertRequest {
    label:string, 
    recipe:string, 
    price:number,
    imageUri: string, 
    category: string
}
