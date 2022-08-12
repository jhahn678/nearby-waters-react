import { useQuery } from 'react-query'
import axios from '../../utils/axios';
import { useState } from 'react';

const getDistinctNames = async (): Promise<string[]> => {
    const res = await axios.get('/waterbodies/names')
    return res.data;
}

interface Args {
    onSuccess: (data: string[]) => void
}

export const useGetDistinctNames = ({
    onSuccess
}: Args) => {

    const [totalNames, setTotalNames] = useState(0)

    const result = useQuery<string[], Error>({
        queryFn: () => getDistinctNames(),
        queryKey: 'distinct-names',
        onSuccess: data => {
            console.log(data.length)
            setTotalNames(data.length)
            onSuccess(data)
        }
    })
    return {
        result,
        totalNames
    }
}