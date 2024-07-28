import { LocalProduct } from "./local-product"

export interface QuoteRequest {
    id: string, 
    email: string, 
    phoneNumber: string, 
    products: LocalProduct[],
    details: string, 
    creationDate?: Date, 
    isHandled: boolean
}