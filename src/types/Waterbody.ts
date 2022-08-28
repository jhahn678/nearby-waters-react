import { GeometryCollection, MultiLineString, MultiPolygon } from "geojson"
import { StateAbbreviation } from "./States"

export type WaterbodyClassifications = 
    'bay' | 'beach' | 'bayou' | 'bend' | 'channel' | 
    'creek' | 'dock' | 'harbor' | 'lagoon' | 'lake' | 
    'marsh' | 'oxbow' | 'pond' | 'reservoir' | 'river' | 
    'slough' | 'stream' | 'strait' | 'unknown'


export interface IWaterbody {
    id: number,
    name: string,
    classification: WaterbodyClassifications,
    weight: number
    country: string
    ccode: string
    subregion: string
    admin_one: StateAbbreviation[]
    admin_two: string[]
}

export interface Waterbody extends IWaterbody {
    rank: number
    distance?: number
    type: 'WATERBODY'
}


export interface PopulatedWaterbody extends Waterbody {
    geometries: GeometryCollection | MultiLineString | MultiPolygon,
    total_geometries: number
}


export default Waterbody

