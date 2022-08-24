import { GeometryObject } from 'geojson'
import { IWaterbody, WaterbodyClassifications } from './Waterbody'

export interface Geometry {
    _id: string
    osm_id?: number
    name: string
    classification: WaterbodyClassifications
    geometry: GeometryObject
    parent_waterbody: string | IWaterbody
    geometry_simplified: GeometryObject
    name_lower: string
    states?: string[],
    admin_one?: string[],
    admin_two?: string[],
    counties?: string[],
}

export default Geometry