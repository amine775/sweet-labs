import { UUID } from "crypto"
import { Timestamp } from "firebase/firestore"

export interface ContactRequest {
    id: UUID | undefined,
    name: string,
    email: string,
    phoneNumber: string,
    details: string,
    creationDate: Date | Timestamp,
    isHandled: boolean
}
