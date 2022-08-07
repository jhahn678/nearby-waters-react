import { useInfiniteQuery } from 'react-query'
import axios from '../../utils/axios'
import { Waterbody } from '../../types/Waterbody'
import { latlng } from '../../types/Autocomplete'
import { useEffect } from 'react'

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
    coords: latlng,
    /** Distance in miles 
    * @default 50
    */
    within: number,
    /** Array of classifications to filter by */
    classifications: string[],
    /** Controls query enabled */
    shouldQuery: boolean
    /** Size of page to return */
    limit?: number
}

const getWaterbodies = async (
    { coords, within, classifications, limit=50 }: WaterbodyQuery,
    pageParam: number = 1
): Promise<WaterbodyResult> => {

    let url = `/waterbodies?page=${pageParam}&limit=${limit}&`
    if(coords.longitude && coords.latitude) url += `lnglat=${coords.longitude},${coords.latitude}&`
    if(within) url += `within=${within}&`
    if(classifications.length > 0) url += `classifications=${classifications.join(',')}&`
    const result = await axios.get(url)
    return result.data;
}

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

    useEffect(() => {
        result.refetch()
    }, [params.classifications, params.within])

    return {
        totalResults: result.data?.pages[0].metadata.total,
        ...result
    }
}