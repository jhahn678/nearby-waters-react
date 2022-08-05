import { useInfiniteQuery } from 'react-query'
import axios from '../../utils/axios'
import { Waterbody } from '../../types/Waterbody'
import { latlng } from '../../types/Autocomplete'

interface WaterbodyResult {
    metadata: { 
        total: number, 
        page: number,
        limit: number 
    }
    data: Waterbody[]
}

interface WaterbodyQuery {
    /** Coords for setting query location */
    coords?: latlng,
    /** Distance in miles */
    within?: number,
    /** Controls query enabled */
    shouldQuery: boolean
    /** Size of page to return */
    limit?: number
}

const getWaterbodies = async (
    { coords, within, limit=50 }: WaterbodyQuery,
    pageParam: number = 1
): Promise<WaterbodyResult> => {
    let url = `/waterbodies?page=${pageParam}&limit=${limit}&`
    if(coords) url += `lnglat=${coords.longitude},${coords.latitude}&`
    if(within) url += `within=${within}&`
    const result = await axios.get(url)
    return result.data;
}

// export const useGetWaterbodies = (params: WaterbodyQuery) => {

//     const result = useQuery<WaterbodyResult, Error>({
//         queryKey: 'waterbodies-query',
//         queryFn: () => getWaterbodies(params),
//         enabled: params.shouldQuery
//     })
//     return result;
// }

export const useGetWaterbodies = (params: WaterbodyQuery) => {
    
    const result = useInfiniteQuery<WaterbodyResult, Error>({
        queryKey: 'waterbodies-query',
        queryFn: ({ pageParam=1 }) => getWaterbodies(params, pageParam),
        enabled: params.shouldQuery,
        getNextPageParam: ({ metadata: x }) => {
            if(x.limit * (x.page - 1) < x.total){
                return x.page + 1
            }
        }
    })

    return {
        totalResults: result.data?.pages[0].metadata.total,
        ...result
    }
}