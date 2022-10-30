import { useQuery } from 'react-query'
import axios from '../../utils/axios'
import { PopulatedWaterbody } from '../../types/Waterbody'

interface GetWaterbodiesQuery {
    name: string | null,
    adminOne: string | null,
    classifications: string[],
    shouldQuery: boolean,
    onSuccess: (data: PopulatedWaterbody[]) => void
}

const getWaterbodiesByName = async ({
    name, classifications, adminOne
}: GetWaterbodiesQuery): Promise<PopulatedWaterbody[]> => {
    let url = `/waterbodies/name?name=${name}`
    if(classifications.length > 0) url += `&classification=${classifications.join(',')}`
    if(adminOne) url += `&admin_one=${adminOne}`
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