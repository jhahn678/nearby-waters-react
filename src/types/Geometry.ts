import { GeoJsonTypes } from 'geojson'

type GeometryObject = {
    type: GeoJsonTypes,
    coordinates: [
        longitude: number, 
        latitude: number
    ]
}

type Geometry = {
    _id: string,
    osm_id?: number,
    name: string,
    classification: string,
    geometry: GeometryObject
}


export default Geometry;