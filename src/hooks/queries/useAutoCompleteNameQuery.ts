import { useQuery } from 'react-query'
import axios from '../../utils/axios'

const getDistinctNames = async (value: string): Promise<string[]> => {
    const res = await axios.get(`/autocomplete/waterbodies/distinct-name?value=${value}`)
    return res.data
}

interface DistinctNameQuery {
    value: string,
    shouldQuery: boolean
}

export const useAutoCompleteNameQuery = ({ 
    value, shouldQuery
}: DistinctNameQuery) => {
    const result = useQuery<string[], Error>({
        queryKey: 'autocomplete-distinct-names',
        queryFn: () => getDistinctNames(value),
        enabled: shouldQuery
    })
}