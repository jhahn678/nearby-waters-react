import axios from '../../utils/axios'
import { useQueries, UseQueryResult } from 'react-query'
import { AutocompleteQuery } from '../../types/Autocomplete'
import Geoplace from '../../types/Geoplace'
import Waterbody from '../../types/Waterbody'


const autocompleteWaterbodies = async (
    { value, lng, lat }: AutocompleteQuery
): Promise<Waterbody[]> => {
    let endpoint = `/autocomplete/waterbodies?value=${value}`
    if(lng && lat) endpoint += `&lnglat=${lng},${lat}`
    const res = await axios.get(endpoint)
    return res.data;
}

const autocompleteGeoplaces = async (
    { value, lng, lat }: AutocompleteQuery 
): Promise<Geoplace[]> => {
    let endpoint = `/autocomplete/geoplaces?value=${value}`
    if(lng && lat) endpoint += `&lnglat=${lng},${lat}`
    const res = await axios.get(endpoint)
    return res.data;
}


export const useAutoCompleteQuery = (
    { value, lng, lat }: AutocompleteQuery
) => {
    const results = useQueries<[UseQueryResult<Geoplace[], Error>, UseQueryResult<Waterbody[], Error>]>([
        { 
            queryKey: 'autocomplete-geoplaces', 
            queryFn: () => autocompleteGeoplaces({ value, lng, lat }),
            initialData: [],
            enabled: false
        },
        { 
            queryKey: 'autocomplete-waterbodies', 
            queryFn: () => autocompleteWaterbodies({ value, lng, lat}),
            initialData: [],
            enabled: false
        }
    ])

    return results;
}