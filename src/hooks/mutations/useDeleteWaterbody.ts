import { useMutation } from 'react-query'
import axios from '../../utils/axios'

interface Args {
    id: number
}

const deleteWaterbody = ({ id }: Args) => {
    return axios.delete('/waterbody', {
        data: { id }
    })
}

export const useDeleteWaterbody = () => {
    const mutation = useMutation({
        mutationFn: (args: Args) => deleteWaterbody(args)
    })
    return mutation;
}