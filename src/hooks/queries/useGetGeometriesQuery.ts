import { useQuery } from 'react-query'
import axios from '../../utils/axios'
import GeometryQuery from '../../types/GeometryQuery'

const fetchGeometries = async (lat, lon, maxdis, mindis) => {
    const res = await axios.get(`/near?lat=${lat}&lon=${lon}&maxdis=${maxdis}&mindis=${mindis}`)
    return res.data
}


export const useGetGeometriesQuery = ({ lat, lon, maxdis, mindis=0 }: GeometryQuery)  => {

    const result =  useQuery({
        queryKey: 'geometries', 
        queryFn: () => fetchGeometries(lat, lon, maxdis, mindis), 
        enabled: false 
    })

    return result


}
