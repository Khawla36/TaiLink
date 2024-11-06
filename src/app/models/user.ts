import { Address } from "./address";

export interface User {
    id?: number,
    name?: string,
    birthdate?: Date,
    address: Address[]// This is defined in the address interface, and here we use it as an array to add multiple addresses dynamically.

}
