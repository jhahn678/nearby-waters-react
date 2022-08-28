import { GeometryObject } from 'geojson'

export interface Geometry {
    id: number
    osm_id: number
    name: string
    country: string
    ccode: string
    classification?: string
    geom: GeometryObject
    waterbody: number
    admin_one: string[] | null,
}

export default Geometry