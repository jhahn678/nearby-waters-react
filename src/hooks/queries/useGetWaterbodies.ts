import { useQuery } from 'react-query'
import axios from '../../utils/axios'
import { Waterbody } from '../../types/Waterbody'
import { latlng } from '../../types/Autocomplete'

interface WaterbodyResult {
    metadata: { 
        total: number, 
        page: number 
    }
    data: Waterbody[]
}

type WaterbodyQuery = {
    coords: latlng,
    /**
     * Distance in miles
     */
    within?: number,
    page?: number,
    limit?: number,
    shouldQuery: boolean
}

const getWaterbodies = async ({ coords, within, page, limit }: WaterbodyQuery): Promise<WaterbodyResult> => {
    const { latitude, longitude } = coords;
    const result = await axios.get(
        `/waterbodies?lnglat=${longitude},${latitude}&within=${within}&page=${page}&limit=${limit}`
    )
    return result.data;
}

export const useGetWaterbodies = (params: WaterbodyQuery) => {

    const result = useQuery<WaterbodyResult, Error>({
        queryKey: 'waterbodies-query',
        queryFn: () => getWaterbodies(params),
        enabled: params.shouldQuery
    })
    return result;
}