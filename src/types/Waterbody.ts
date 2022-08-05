import Geometry from "./Geometry"
import { StateAbbreviation } from "./States"

export type WaterbodyClassifications = 
    'bay' | 'beach' | 'bayou' | 'bend' | 'channel' | 
    'creek' | 'dock' | 'harbor' | 'lagoon' | 'lake' | 
    'marsh' | 'oxbow' | 'pond' | 'reservoir' | 'river' | 
    'slough' | 'stream' | 'unknown'


export interface IWaterbody {
    _id: string,
    name: string,
    classification: WaterbodyClassifications,
    geometries: string[] | Geometry[]
    states: StateAbbreviation[]
    weight: number
    counties: string[]
    country: string
    ccode: string
    subregion: string
    type?: 'WATERBODY' 
}

export interface Waterbody extends IWaterbody {
    rank: number
    distanceFrom?: number
}


export interface PopulatedWaterbody extends Waterbody {
    geometries: Geometry[]
}


export default Waterbody

