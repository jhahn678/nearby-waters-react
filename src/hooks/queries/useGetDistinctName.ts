import { useEffect } from 'react'
import { useQuery } from 'react-query'
import axios from '../../utils/axios'


export interface GetDistinctNameRes{
    index: number
    position: number
    total: number
    value: string
}

interface Args {
    index: number | null,
    state: string | null,
    weight: number | null,
    onSuccess: (data: GetDistinctNameRes) => void
}

const getDistinctName = async ({ index, state, weight }: Args): Promise<GetDistinctNameRes> => {
    let url = `/waterbody/names?index=${index}`
    if(state) url += `&state=${state}`;
    if(weight) url += `&weight=${weight}`;
    const res = await axios.get(url)
    return res.data;
}


export const useGetDistinctName = (args: Args) => {


    const result = useQuery<GetDistinctNameRes, Error>({
        queryFn: () => getDistinctName(args),
        queryKey: `${args.index}-distinct-name`,
        enabled: false,
    })

    useEffect(() => {
        if(result.data){
            args.onSuccess(result.data)
        }
    },[result.data])

    useEffect(() => {
        if(args.index){
            result.refetch()
        }
    },[args.index, args.weight, args.state])

    return result
}
