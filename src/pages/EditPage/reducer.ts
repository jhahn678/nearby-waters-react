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
    //////////////////////////////
    currentName: number | null
    allNames: string[]
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
| { type: 'SELECT_WATERBODY', value: PopulatedWaterbody }
| { type: 'CLEAR_WATERBODY' }
| { type: 'SELECT_PARENT', value: string }
| { type: 'REMOVE_PARENT' }
| { type: 'SELECT_CHILD', value: string }
| { type: 'REMOVE_CHILD', value: string }
| { type: 'SET_BOUNDS', value: LngLatBoundsLike }
| { type: 'MERGE_SUCCESS'}
///////////////////////////////////////////////////////
| { type: 'NEXT_NAME' }
| { type: 'LAST_NAME' }
| { type: 'SET_NAMES', values: string[] }


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
    //////////////////////////////
    currentName: null,
    allNames: []
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
        let currentName = 0;
        if(state.currentName !== null) {
            currentName = state.currentName + 1;
        }
        return {
            ...state,
            currentName,
            shouldAutocomplete: false,
            selectedName: state.allNames[currentName],
            input: state.allNames[currentName]
        }
    }
    else if(action.type === 'LAST_NAME'){
        let currentName = null;
        if(state.currentName && state.currentName > 0){
            currentName = state.currentName - 1
        }
        return {
            ...state,
            currentName,
            shouldAutocomplete: false,
            selectedName: currentName ? state.allNames[currentName] : null,
            input: currentName ? state.allNames[currentName] : ''
        }
    }
    else if(action.type === 'SET_NAMES'){
        return{
            ...state,
            allNames: action.values
        }
    }
    else{
        return state;
    }
}