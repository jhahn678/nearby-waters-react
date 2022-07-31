import axios from '../../utils/axios'
import { useQueries } from 'react-query'
import { 
    AutocompleteGeoplace,
    AutocompleteQuery, 
    AutocompleteWaterbody
} from '../../types/Autocomplete'


const autocompleteWaterbodies = async (
    { value, lng, lat }: AutocompleteQuery
): Promise<AutocompleteWaterbody[]> => {
    let endpoint = `/autocomplete/waterbodies?value=${value}`
    if(lng && lat) endpoint = `/autocomplete/waterbodies?value=${value}&lnglat=${lng},${lat}`
    const res = await axios.get(endpoint)
    return res.data;
}

const autocompleteGeoplaces = async (
    { value, lng, lat }: AutocompleteQuery 
): Promise<AutocompleteGeoplace[]> => {
    let endpoint = `/autocomplete/geoplaces?value=${value}`
    if(lng && lat) endpoint = `/autocomplete/geoplaces?value=${value}&lnglat=${lng},${lat}`
    const res = await axios.get(endpoint)
    return res.data;
}


export const useAutoCompleteQuery = (
    { value, lng, lat }: AutocompleteQuery
) => {
    const results = useQueries([
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