import { GeometryCollection } from "geojson"
import Geometry from "./Geometry"
import { StateAbbreviation } from "./States"

export type WaterbodyClassifications = 
    'bay' | 'beach' | 'bayou' | 'bend' | 'channel' | 
    'creek' | 'dock' | 'harbor' | 'lagoon' | 'lake' | 
    'marsh' | 'oxbow' | 'pond' | 'reservoir' | 'river' | 
    'slough' | 'stream' | 'unknown'



export interface Waterbody {
    _id: string,
    name: string,
    classification: WaterbodyClassifications,
    geometries: string[] | Geometry[]
    states: StateAbbreviation[]
    weight: number
    simplified_geometries: GeometryCollection,
    counties: string[]
    country: string
    ccode: string
    subregion: string
}

export default Waterbody