import React, { useState, useEffect } from 'react'
import { useAutoCompleteQuery } from './useAutoCompleteQuery'
import { AutocompleteQueryType, AutocompleteResult, latlng } from '../../types/Autocomplete'

type Params = {
    input: string,
    coords: latlng,
    queryType: AutocompleteQueryType,
    shouldQuery: boolean
}

type ReturnObj = {
    results: AutocompleteResult[],
    isLoading: boolean,
    isError: boolean
}

export const useAutoComplete = (
    { input, coords, queryType, shouldQuery }: Params
): ReturnObj => {

    const [results, setResults] = useState<AutocompleteResult[]>([])
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [{
        data: geoplacesData, 
        isLoading: geoplacesLoading,
        isError: geoplaceIsError,
        refetch: geoplacesFetch, 
        remove: geoplacesClear
    },{ 
        data: waterbodiesData, 
        isLoading: waterbodiesLoading,
        isError: waterbodiesIsError,
        refetch: waterbodiesFetch, 
        remove: waterbodiesClear
    }] = useAutoCompleteQuery({
        value: input,
        lng: coords.longitude,
        lat: coords.latitude
    })

    useEffect(() => {
        if(shouldQuery && queryType === 'ALL') {
            geoplacesFetch()
            waterbodiesFetch()
        }
        else if(shouldQuery && queryType === 'GEOPLACES'){
            waterbodiesClear()
            geoplacesFetch()
        } 
        else if(shouldQuery && queryType === 'WATERBODIES'){
            geoplacesClear()
            waterbodiesFetch()
        }
    },[ input, coords, queryType, shouldQuery,
        geoplacesClear, waterbodiesClear, 
        geoplacesFetch, waterbodiesFetch
    ])

    useEffect(() => {
        if(waterbodiesData && geoplacesData){
            setResults(
                [...waterbodiesData, ...geoplacesData].sort((x, y) => y.rank - x.rank)  
            )
        }
    },[waterbodiesData, geoplacesData])

    useEffect(() => {
        if(geoplaceIsError && waterbodiesIsError){
            setIsError(true)
        }else{
            setIsError(false)
        }
    }, [geoplaceIsError, waterbodiesIsError])

    useEffect(() => {
        if(geoplacesLoading && waterbodiesLoading && results.length === 0){
            setIsLoading(true)
        }else{
            setIsLoading(false)
        }
    }, [geoplacesLoading, waterbodiesLoading])

    return { results, isLoading, isError }
}