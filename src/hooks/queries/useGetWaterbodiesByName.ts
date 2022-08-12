import { useQuery } from 'react-query'
import axios from '../../utils/axios'
import { PopulatedWaterbody } from '../../types/Waterbody'


interface GetWaterbodiesQuery {
    name: string | null,
    state: string | null,
    weight: number | null,
    shouldQuery: boolean,
    onSuccess: (data: PopulatedWaterbody[]) => void
}


const getWaterbodiesByName = async ({
    name, weight, state
}: GetWaterbodiesQuery): Promise<PopulatedWaterbody[]> => {
    let url = `/waterbodies/name?name=${name}`
    if(weight) url += `&weight=${weight}`
    if(state) url += `&state=${state}`
    const res = await axios.get(url)
    return res.data;
}


export const useGetWaterbodiesByName = (args: GetWaterbodiesQuery) => {

    const result = useQuery({
        queryKey: `${args.name}-waterbodies`,
        queryFn: () => getWaterbodiesByName(args),
        enabled: args.shouldQuery,
        onSuccess: args.onSuccess
    })
    return result;
}