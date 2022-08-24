import { useEffect } from 'react'
import { useQuery } from 'react-query'
import axios from '../../utils/axios'

const getDistinctNames = async (
    value: string, adminOne: string | null, classifications: string[]
): Promise<string[]> => {
    let url = `/autocomplete/waterbodies/distinct-name?value=${value}`
    if(adminOne) url += `&admin_one=${adminOne}`;
    if(classifications.length > 0) url += `&classifications=${classifications.join(',')}`
    const res = await axios.get(url)
    return res.data
}

interface DistinctNameQuery {
    value: string,
    adminOne: string | null,
    classifications: string[],
    shouldQuery: boolean
}

export const useAutoCompleteNameQuery = ({ 
    value, adminOne, classifications, shouldQuery
}: DistinctNameQuery) => {

    const result = useQuery<string[], Error>({
        queryKey: 'autocomplete-distinct-names',
        queryFn: () => getDistinctNames(value, adminOne, classifications),
        enabled: shouldQuery && value.length > 3
    })

    useEffect(() => {
        if(value.length < 3 && result.data){
            result.remove()
        }
        if(value.length >= 3 && !result.isLoading && shouldQuery){
            result.refetch()
        }
    },[value])

    return result;
}