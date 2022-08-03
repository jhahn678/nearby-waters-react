import { useQuery } from 'react-query'
import axios from '../../utils/axios'

interface Waterbody {

}

const getWaterbody = async (_id: string | null): Promise<Waterbody> => {
    if(!_id) Promise.reject('_id not valid')
    const result = await axios.get(`/waterbody?_id=${_id}&geometries=true`)
    return result.data
}

export const useGetWaterbody = (_id: string | null) => {

    const result = useQuery<Waterbody, Error>({
        queryKey: `waterbody-${_id}`,
        queryFn: () => getWaterbody(_id),
        enabled: false
    })

    return result
}