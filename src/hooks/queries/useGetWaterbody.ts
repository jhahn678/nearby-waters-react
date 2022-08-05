import { useQuery } from 'react-query'
import { PopulatedWaterbody } from '../../types/Waterbody'
import axios from '../../utils/axios'


const getWaterbody = async (_id: string | null): Promise<PopulatedWaterbody> => {
    if(!_id) Promise.reject('_id not valid')
    const result = await axios.get(`/waterbody?_id=${_id}&geometries=true`)
    return result.data
}

export const useGetWaterbody = (_id: string | null) => {

    const result = useQuery<PopulatedWaterbody, Error>({
        queryKey: `waterbody-${_id}`,
        queryFn: () => getWaterbody(_id),
        enabled: false
    })

    return result
}