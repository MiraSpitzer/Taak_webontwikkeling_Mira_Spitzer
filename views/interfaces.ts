import { ObjectId } from "mongodb";

export interface Element {
    id: string,
    name: string,
    description: string,
    valenceElectrons: number,
    synthetic: boolean,
    imgUrl: string,
    type: string,
    discoveryDate: number,
    discoverer: Discoverer,
    use: string[]
}

export interface Discoverer {
    id: string,
    name: string,
    birthDate: string,
    passingDate: string,
    nationality: string,
    description: string,
    imgUrl: string
}

export interface User {
    _id?: ObjectId;
    email: string;
    password?: string;
    role: "ADMIN" | "USER";
}

export interface FlashMessage {
    type: "error" | "success" | "info"
    message: string;
}