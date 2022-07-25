type GeometryQuery = {
    search?: string,
    lat: number,
    lng: number,
    mindis?: number,
    maxdis: number
}

export default GeometryQuery;