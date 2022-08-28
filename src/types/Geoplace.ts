export interface IGeoplace {
    id: number
    name: string
    fclass: string
    fcode: string
    country: string
    ccode: string
    admin_one: string | null
    admin_two: string | null
    geom: GeoJSON.Point
    weight: number
}

export interface Geoplace extends IGeoplace {
    rank: number
    distance?: number
    type: 'GEOPLACE'
}


export default Geoplace;