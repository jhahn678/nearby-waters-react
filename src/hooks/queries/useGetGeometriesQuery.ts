import { useQuery } from 'react-query'
import axios from '../../utils/axios'
import GeometryQuery from '../../types/GeometryQuery'

const fetchGeometries = async (lat, lng, maxdis, search) => {
    const res = await axios.get(`/near?lat=${lat}&lng=${lng}&maxdis=${maxdis}&coordinate=true&search=${search}`)
    return res.data
}


export const useGetGeometriesQuery = ({ lat, lng, maxdis, search }: GeometryQuery)  => {

    const result =  useQuery({
        queryKey: 'geometries', 
        queryFn: () => fetchGeometries(lat, lng, maxdis, search), 
        enabled: false 
    })

    return result


}
