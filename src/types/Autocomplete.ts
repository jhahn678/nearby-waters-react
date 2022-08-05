import Waterbody from "./Waterbody"
import Geoplace from './Geoplace'

export type latlng = {
    latitude: string | number,
    longitude: string | number
}

export type AutocompleteQuery = {
    value: string,
    lng: number | string,
    lat: number | string
}

export type DataType = 'GEOPLACE' | 'WATERBODY'

export type AutocompleteQueryType = 'ALL' | 'GEOPLACES' | 'WATERBODIES'

export type AutocompleteResult = Geoplace | Waterbody