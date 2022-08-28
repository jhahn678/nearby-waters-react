import { useMutation } from "react-query";
import axios from '../../utils/axios'


interface MergeWaterbodyArgs {
    /** Parent waterbody id */
    parentWaterbody: number,
    /** Array of children waterbody ids */
    childrenWaterbodies: number[]
}

const mergeWaterbodies = (args: MergeWaterbodyArgs) => {
    return axios.patch('/waterbodies', {
        parent: args.parentWaterbody,
        children: args.childrenWaterbodies
    })
}

export const useMergeWaterbodyMutation = () => {
    const mutation = useMutation((args: MergeWaterbodyArgs) => mergeWaterbodies(args))
    return mutation;
}

