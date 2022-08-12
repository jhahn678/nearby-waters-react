import { LngLatBoundsLike } from "mapbox-gl"
import { GetDistinctNameRes } from "../../hooks/queries/useGetDistinctName"
import { PopulatedWaterbody } from "../../types/Waterbody"
import { waterbodyToBBox } from '../../utils/geojsonConversions'

interface State {
    input: string
    weight: number | null
    state: string | null
    selectedName: string | null
    shouldAutocomplete: boolean
    selectedWaterbody: string | null
    parentWaterbody: string | null
    childrenWaterbodies: string[]
    bounds: LngLatBoundsLike | null
    resultsIndex: number | null
    resultsTotal: number | null 
    nameIndex: number | null
    nameTotal: number | null
    namePosition: number | null

}

export type Action = 
| { type: 'INPUT_NAME', value: string }
| { type: 'SELECT_NAME', value: string }
| { type: 'SELECT_NAME_AS_INPUT' }
| { type: 'CLEAR_NAME' }
| { type: 'SELECT_WEIGHT', value: string | null }
| { type: 'CLEAR_WEIGHT' }
| { type: 'SELECT_STATE', value: string | null }
| { type: 'CLEAR_STATE' }
| { type: 'SELECT_WATERBODY', value: PopulatedWaterbody, index?: number }
| { type: 'CLEAR_WATERBODY' }
| { type: 'SELECT_PARENT', value: string }
| { type: 'REMOVE_PARENT' }
| { type: 'SELECT_CHILD', value: string }
| { type: 'REMOVE_CHILD', value: string }
| { type: 'SET_BOUNDS', value: LngLatBoundsLike }
| { type: 'MERGE_SUCCESS'}
| { type: 'NEXT_NAME' }
| { type: 'LAST_NAME' }
| { type: 'SET_DISTINCT_NAME', res: GetDistinctNameRes }
| { type: 'NEXT_RESULT' }
| { type: 'LAST_RESULT' }
| { type: 'SET_TOTAL_RESULTS', total: number }


export const initialState: State = {
    shouldAutocomplete: false,
    input: '',
    weight: null,
    state: null,
    selectedName: null,
    selectedWaterbody: null,
    parentWaterbody: null,
    childrenWaterbodies: [],
    bounds: null,
    resultsIndex: null,
    resultsTotal: null,
    nameIndex: null,
    nameTotal: null,
    namePosition: null
}

export const reducer = (state: State, action: Action): State => {
    if(action.type === 'SELECT_NAME'){
        return {
            ...state,
            shouldAutocomplete: false,
            selectedName: action.value,
            input: action.value
        }
    }
    else if(action.type === 'SELECT_NAME_AS_INPUT'){
        return {
            ...state,
            shouldAutocomplete: false,
            selectedName: state.input
        }
    }
    else if(action.type === 'CLEAR_NAME'){
        return {
            ...state,
            input: '',
            shouldAutocomplete: false,
            selectedWaterbody: null,
            selectedName: null,
            bounds: null,
            resultsIndex: null,
            resultsTotal: null,
            nameIndex: null,
            namePosition: null, 
            nameTotal: null
        }
    }
    else if(action.type === 'INPUT_NAME'){
        return {
            ...state,
            selectedName: null,
            shouldAutocomplete: true,
            input: action.value
        }
    }
    else if(action.type === 'SELECT_WEIGHT'){
        if(!action.value) return state;
        if(action.value === 'Any') return { 
            ...state, 
            weight: null 
        }
        return {
            ...state,
            weight: parseFloat(action.value)
        }
    }
    else if(action.type === 'CLEAR_WEIGHT'){
        return {
            ...state,
            weight: null
        }
    }
    else if(action.type === 'SELECT_STATE'){
        if(!action.value) return state;
        if(action.value === 'Any') return { 
            ...state, 
            state: null 
        }
        return { ...state, state: action.value }
    }
    else if(action.type === 'CLEAR_STATE'){
        return {
            ...state,
            state: null
        }
    }
    else if(action.type === 'SELECT_WATERBODY'){
        const bounds =  waterbodyToBBox(action.value)
        const obj =  {
            ...state,
            selectedWaterbody: action.value._id,
            bounds
        }
        if(action.index) obj.resultsIndex = action.index;
        return obj;
    }
    else if(action.type === 'CLEAR_WATERBODY'){
        return {
            ...state,
            selectedWaterbody: null,
            bounds: null,
            resultsIndex: null
        }
    }
    else if(action.type === 'SELECT_PARENT'){
        return {
            ...state,
            parentWaterbody: action.value
        }
    }
    else if(action.type === 'REMOVE_PARENT'){
        return {
            ...state,
            parentWaterbody: null,
            childrenWaterbodies: []
        }
    }
    else if(action.type === 'SELECT_CHILD'){
        return {
            ...state,
            childrenWaterbodies: [
                ...state.childrenWaterbodies,
                action.value
            ]
        }
    }
    else if(action.type === 'REMOVE_CHILD'){
        const { childrenWaterbodies } = state;
        const filtered = childrenWaterbodies.filter(x => x !== action.value)
        return {
            ...state,
            childrenWaterbodies: filtered
        }
    }
    else if(action.type === 'SET_BOUNDS'){
        return {
            ...state,
            bounds: action.value
        }
    }  
    else if(action.type === 'MERGE_SUCCESS'){
        return {
            ...state,
            parentWaterbody: null,
            childrenWaterbodies: [],
            selectedWaterbody: null,
            bounds: null,

        }
    }
    else if(action.type === 'NEXT_NAME'){
        let index = 0;
        if(state.nameIndex !== null){
            index = state.nameIndex + 1
        }
        console.log(index)
        return {
            ...state,
            shouldAutocomplete: false,
            nameIndex: index
        }
    }
    else if(action.type === 'LAST_NAME'){
        let index = null;
        if(state.nameIndex && state.nameIndex > 0){
            index = state.nameIndex - 1
        }
        return {
            ...state,
            shouldAutocomplete: false,
            nameIndex: index
        }
    }
    else if(action.type === 'SET_DISTINCT_NAME'){
        const { position, total, value } = action.res;
        return {
            ...state,
            shouldAutocomplete: false,
            namePosition: position,
            nameTotal: total,
            input: value,
            selectedName: value
        }
    }
    else if(action.type === 'NEXT_RESULT'){
        const { resultsIndex, resultsTotal } = state; 
        let index: number | null = 0;
        if(!resultsTotal){
            index = null;
        }else if(resultsIndex !== null && resultsIndex < resultsTotal - 1){
            index = resultsIndex + 1
        }
        return {
            ...state,
            resultsIndex: index
        }
    }
    else if(action.type === 'LAST_RESULT'){
        const { resultsIndex, resultsTotal } = state;
        let index: number | null = 0;
        if(!resultsTotal){
            index = null
        }else if(resultsIndex){
            index = resultsIndex - 1;
        }else if(resultsIndex === 0){
            index = resultsTotal - 1
        }
        return {
            ...state,
            resultsIndex: index
        }
    }
    else if(action.type === 'SET_TOTAL_RESULTS'){
        return {
            ...state,
            resultsIndex: null,
            resultsTotal: action.total
        }
    }
    else{
        return state;
    }
}
