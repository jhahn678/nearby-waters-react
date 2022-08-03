import { GeometryObject } from 'geojson'
import { StateAbbreviation } from './States';
import { Waterbody, WaterbodyClassifications } from './Waterbody'

export interface Geometry {
    _id: string
    osm_id?: number
    name: string
    classification: WaterbodyClassifications
    geometry: GeometryObject
    states: StateAbbreviation[]
    parent_waterbody: string | Waterbody
    geometry_simplified: GeometryObject
    counties: string[]
    name_lower: string
}

export default Geometry