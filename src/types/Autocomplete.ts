import { WaterbodyClassifications } from './Waterbody';
import { StateName, StateAbbreviation } from './States'
import { Point } from 'geojson'

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

export type AutocompleteGeoplace = {
    type: 'GEOPLACE',
    _id: string,
    name: string,
    state: StateName
    abbr: StateAbbreviation,
    fcode: string,
    geometry: Point,
    county: string,
    distanceFrom?: number,
    rank: number
}

export type AutocompleteWaterbody = {
    type: 'WATERBODY'
    _id: string,
    name: string,
    states: [StateAbbreviation],
    classification: WaterbodyClassifications,
    distanceFrom?: number,
    rank: number
}


export type AutocompleteResult = AutocompleteGeoplace | AutocompleteWaterbody