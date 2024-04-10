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