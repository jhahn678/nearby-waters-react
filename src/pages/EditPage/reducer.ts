import { LngLatBoundsLike } from "mapbox-gl"
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
}

export type Action = 
| { type: 'INPUT_NAME', value: string }
| { type: 'SELECT_NAME', value: string }
| { type: 'CLEAR_NAME' }
| { type: 'SELECT_WEIGHT', value: string | null }
| { type: 'CLEAR_WEIGHT' }
| { type: 'SELECT_STATE', value: string | null }
| { type: 'CLEAR_STATE' }
| { type: 'SELECT_WATERBODY', value: PopulatedWaterbody }
| { type: 'CLEAR_WATERBODY' }
| { type: 'SELECT_PARENT', value: string }
| { type: 'REMOVE_PARENT' }
| { type: 'SELECT_CHILD', value: string }
| { type: 'REMOVE_CHILD', value: string }
| { type: 'SET_BOUNDS', value: LngLatBoundsLike }


export const initialState: State = {
    shouldAutocomplete: false,
    input: '',
    weight: null,
    state: null,
    selectedName: null,
    selectedWaterbody: null,
    parentWaterbody: null,
    childrenWaterbodies: [],
    bounds: null
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
    else if(action.type === 'CLEAR_NAME'){
        return {
            ...state,
            input: '',
            shouldAutocomplete: false,
            selectedName: null,
            bounds: null
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
        return {
            ...state,
            state: action.value
        }
    }
    else if(action.type === 'CLEAR_STATE'){
        return {
            ...state,
            state: null
        }
    }
    else if(action.type === 'SELECT_WATERBODY'){
        const bounds =  waterbodyToBBox(action.value)
        return {
            ...state,
            selectedWaterbody: action.value._id,
            bounds
        }
    }
    else if(action.type === 'CLEAR_WATERBODY'){
        return {
            ...state,
            selectedWaterbody: null,
            bounds: null
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
    else{
        return state;
    }
}