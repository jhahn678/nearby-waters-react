import { useMutation } from "react-query";
import axios from '../../utils/axios'


interface MergeWaterbodyArgs {
    /** Parent waterbody object id */
    parentWaterbody: string,
    /** Array of children waterbody ids */
    childrenWaterbodies: string[]
}

const mergeWaterbodies = (args: MergeWaterbodyArgs) => {
    console.log('Sending delete request')
    return axios.patch('/waterbodies', {
        parent: args.parentWaterbody,
        children: args.childrenWaterbodies
    })
}

export const useMergeWaterbodyMutation = () => {
    const mutation = useMutation((args: MergeWaterbodyArgs) => mergeWaterbodies(args))
    return mutation;
}

