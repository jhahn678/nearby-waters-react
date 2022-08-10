import { useMutation } from 'react-query'
import axios from '../../utils/axios'

interface Args {
    _id: string
}

const deleteWaterbody = ({ _id }: Args) => {
    return axios.delete('/waterbody', {
        data: { _id }
    })
}

export const useDeleteWaterbody = () => {
    const mutation = useMutation({
        mutationFn: (args: Args) => deleteWaterbody(args)
    })
    return mutation;
}