import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import axios from '../../utils/axios'

const getDistinctNames = async (value: string): Promise<string[]> => {
    const res = await axios.get(`/autocomplete/waterbodies/distinct-duplicated-name?value=${value}`)
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
        enabled: shouldQuery && value.length > 3
    })

    useEffect(() => {
        if(value.length < 4 && result.data){
            result.remove()
        }
        if(value.length >= 4 && !result.isLoading && shouldQuery){
            result.refetch()
        }
    },[value])

    return result;
}