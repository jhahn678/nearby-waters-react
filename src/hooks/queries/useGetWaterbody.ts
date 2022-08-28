import { useQuery } from 'react-query'
import { PopulatedWaterbody } from '../../types/Waterbody'
import axios from '../../utils/axios'


const getWaterbody = async (id: number | null): Promise<PopulatedWaterbody> => {
    if(!id) Promise.reject('_id not valid')
    const result = await axios.get(`/waterbody?id=${id}&geometries=true`)
    return result.data
}

export const useGetWaterbody = (id: number | null) => {

    const result = useQuery<PopulatedWaterbody, Error>({
        queryKey: `waterbody-${id}`,
        queryFn: () => getWaterbody(id),
        enabled: false
    })

    return result
}