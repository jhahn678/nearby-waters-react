import { useQuery } from 'react-query'
import axios from '../../utils/axios'
import { PopulatedWaterbody } from '../../types/Waterbody'


interface GetWaterbodiesQuery {
    name: string,
    state?: string,
    weight?: number,
    shouldQuery: boolean
}


const getWaterbodiesByName = async ({
    name, weight, state
}: Omit<GetWaterbodiesQuery, 'shouldQuery'>): Promise<PopulatedWaterbody[]> => {
    let url = `/waterbodies/duplicate-name?name=${name}`
    if(weight) url += `&weight=${weight}`
    if(state) url += `&state=${state}`
    const res = await axios.get(url)
    return res.data;
}


export const useGetWaterbodiesByName = ({ 
    shouldQuery, ...args
}: GetWaterbodiesQuery) => {
    const result = useQuery({
        queryKey: `${args.name}-waterbodies`,
        queryFn: () => getWaterbodiesByName(args),
        enabled: shouldQuery
    })
    return result;
}