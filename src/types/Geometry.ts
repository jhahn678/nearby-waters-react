import { GeometryObject } from 'geojson'

type Geometry = {
    _id: string,
    osm_id: number,
    name: string,
    classification: string,
    geometry: GeometryObject
}


export default Geometry;