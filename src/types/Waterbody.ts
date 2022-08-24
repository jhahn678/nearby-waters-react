import Geometry from "./Geometry"
import { StateAbbreviation } from "./States"

export type WaterbodyClassifications = 
    'bay' | 'beach' | 'bayou' | 'bend' | 'channel' | 
    'creek' | 'dock' | 'harbor' | 'lagoon' | 'lake' | 
    'marsh' | 'oxbow' | 'pond' | 'reservoir' | 'river' | 
    'slough' | 'stream' | 'strait' | 'unknown'


export interface IWaterbody {
    _id: string,
    name: string,
    classification: WaterbodyClassifications,
    geometries: string[] | Geometry[]
    weight: number
    country: string
    ccode: string
    subregion: string
    admin_one: StateAbbreviation[]
    admin_two: string[]
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

