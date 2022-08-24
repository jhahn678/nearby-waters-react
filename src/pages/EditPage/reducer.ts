import { LngLatBoundsLike } from "mapbox-gl"
import { PopulatedWaterbody } from "../../types/Waterbody"
import { waterbodyToBBox } from '../../utils/geojsonConversions'

interface State {
    input: string
    classifications: string[]
    adminOne: string | null
    selectedName: string | null
    shouldAutocomplete: boolean
    selectedWaterbody: string | null
    parentWaterbody: string | null
    childrenWaterbodies: string[]
    bounds: LngLatBoundsLike | null
    resultsIndex: number | null
    resultsTotal: number | null,
}

export type Action = 
| { type: 'INPUT_NAME', value: string }
| { type: 'SELECT_NAME', value: string }
| { type: 'SELECT_NAME_AS_INPUT' }
| { type: 'CLEAR_NAME' }
| { type: 'SET_CLASSIFICATIONS', values: string[]}
| { type: 'CLEAR_CLASSIFICATION' }
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
| { type: 'NEXT_RESULT' }
| { type: 'LAST_RESULT' }
| { type: 'SET_TOTAL_RESULTS', total: number }


export const initialState: State = {
    shouldAutocomplete: false,
    input: '',
    classifications: [],
    adminOne: null,
    selectedName: null,
    selectedWaterbody: null,
    parentWaterbody: null,
    childrenWaterbodies: [],
    bounds: null,
    resultsIndex: null,
    resultsTotal: null,
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
            resultsTotal: null
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
    else if(action.type === 'SET_CLASSIFICATIONS'){
        return {
            ...state,
            classifications: action.values
        }
    }
    else if(action.type === 'SELECT_STATE'){
        if(!action.value) return state;
        if(action.value === 'Any') return { 
            ...state, 
            adminOne: null 
        }
        return { ...state, adminOne: action.value }
    }
    else if(action.type === 'CLEAR_STATE'){
        return {
            ...state,
            adminOne: null
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
            resultsIndex: null,
            bounds: null
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
            bounds: null,
            resultsIndex: null,
            resultsTotal: action.total
        }
    }
    else{
        return state;
    }
}
