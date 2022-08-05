import { StateAbbreviation, StateName } from "./States";

export interface IGeoplace {
    _id: string
    name: string
    fclass: string
    fcode: string
    country: string
    state: StateName
    abbr: StateAbbreviation
    geometry: GeoJSON.Point
    county: string
    weight: number
    type?: 'GEOPLACE'
}

export interface Geoplace extends IGeoplace {
    rank: number
    distanceFrom?: number
}


export default Geoplace;