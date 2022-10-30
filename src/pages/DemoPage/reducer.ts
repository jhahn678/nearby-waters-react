import { latlng } from "../../types/Autocomplete"
import Geoplace from '../../types/Geoplace'
import { WaterbodyClassifications } from "../../types/Waterbody"
import { coordsAreNull, coordsAreValid } from '../../utils/validateCoords'

type State = {
    autocompleteType: 'ALL' | 'GEOPLACES' | 'WATERBODIES',
    input: string,
    coords: latlng,
    coordsAreValid: boolean,
    coordsAreNull: boolean,
    within: number,
    locationError: boolean,
    fieldsTouched: boolean,
    showMap: boolean,
    waterbody_id: number | null,
    selectedGeoplace: Geoplace | null
    queryingNearMe: boolean
    shouldQueryLocation: boolean
    shouldQueryAutocomplete: boolean,
    previousCoords: latlng,
    classifications: string[],
    sort: 'rank' | 'distance'
}

export type Action = 
| { type: 'INPUT_VALUE', value: string }
| { type: 'INPUT_LATITUDE', value: string }
| { type: 'INPUT_LONGITUDE', value: string }
| { type: 'SELECT_QUERYTYPE', value: 'ALL' | 'GEOPLACES' | 'WATERBODIES' }
| { type: 'SET_CURRENT_LOCATION', value: latlng }
| { type: 'LOCATION_ERROR' }
| { type: 'SELECT_WATERBODY',id: number }
| { type: 'CLEAR_WATERBODY' }
| { type: 'SELECT_LOCATION', geoplace: Geoplace }
| { type: 'CLEAR_LOCATION' }
| { type: 'SELECT_NEAR_ME', coords: latlng }
| { type: 'SET_CLASSIFICATIONS', values: string[]}
| { type: 'SET_WITHIN', value: number | string | null }
| { type: 'SET_SORT', value: string | null }


export const initialState: State = {
    input: '',
    coords: { latitude: '', longitude: '' },
    previousCoords:{ latitude: '', longitude: '' },
    coordsAreValid: false,
    coordsAreNull: true,
    within: 50,
    shouldQueryLocation: false,
    shouldQueryAutocomplete: false,
    autocompleteType: 'ALL',
    locationError: false,
    fieldsTouched: false,
    showMap: false,
    waterbody_id: null,
    selectedGeoplace: null,
    queryingNearMe: false,
    classifications: [],
    sort: 'rank'
}


export const reducer = (state: State, action: Action): State => {
    if(action.type === 'INPUT_VALUE'){
        const { shouldQueryLocation } = state;
        const shouldQueryAutocomplete = !shouldQueryLocation && action.value.length > 0
        return { 
            ...state, 
            fieldsTouched: true,
            shouldQueryAutocomplete,
            input: action.value 
        }
    }
    else if(action.type === 'INPUT_LATITUDE'){
        const { input, shouldQueryLocation } = state;
        const newCoords = { 
            latitude: action.value, 
            longitude: state.coords.longitude
        }
        const coordsValid = coordsAreValid(newCoords)
        const coordsNull = coordsAreNull(newCoords)
        const shouldQueryAutocomplete = !shouldQueryLocation && (
            coordsValid || (coordsNull && input.length > 0)
        )
        return { 
            ...state, 
            fieldsTouched: true,
            shouldQueryAutocomplete,
            coordsAreValid: coordsValid,
            coordsAreNull: coordsNull,
            coords: newCoords
        }
    }
    else if(action.type === 'INPUT_LONGITUDE'){
        const { shouldQueryLocation, input } = state;
        const newCoords = { 
            latitude: state.coords.latitude, 
            longitude: action.value
        }
        const coordsValid = coordsAreValid(newCoords)
        const coordsNull = coordsAreNull(newCoords)
        const shouldQueryAutocomplete = !shouldQueryLocation && (
            coordsValid || (coordsNull && input.length > 0)
        )
        return { 
            ...state, 
            fieldsTouched: true, 
            shouldQueryAutocomplete,
            coordsAreValid: coordsValid,
            coordsAreNull: coordsNull,
            coords: newCoords,
        }
    }
    else if(action.type === 'SELECT_QUERYTYPE'){
        return { 
            ...state, 
            fieldsTouched: true, 
            autocompleteType: action.value 
        }
    }
    else if(action.type === 'SET_CURRENT_LOCATION'){
        return { 
            ...state, 
            fieldsTouched: true, 
            coordsAreValid: true,
            coordsAreNull: false,
            shouldQueryAutocomplete: true,
            coords: action.value 
        }
    }
    else if(action.type === 'LOCATION_ERROR'){
        return {
            ...state,
            locationError: true
        }
    }
    else if(action.type === 'SELECT_WATERBODY'){
        return {
            ...state,
            showMap: true,
            waterbody_id: action.id
        }
    }
    else if(action.type === 'CLEAR_WATERBODY'){
        return {
            ...state,
            showMap: false,
            waterbody_id: null,
        }
    }
    else if(action.type === 'SELECT_LOCATION'){
        const { coordinates } = action.geoplace.geom;
        return {
            ...state,
            coordsAreNull: false,
            coordsAreValid: true,
            shouldQueryLocation: true,
            shouldQueryAutocomplete: false,
            selectedGeoplace: action.geoplace,
            previousCoords: state.coords,
            coords: { 
                longitude: coordinates[0], 
                latitude: coordinates[1]
            }
        }
    }
    else if(action.type === 'CLEAR_LOCATION'){
        return {
            ...state,
            shouldQueryAutocomplete: true,
            shouldQueryLocation: false,
            selectedGeoplace: null,
            coordsAreNull: true,
            coordsAreValid: false,
            queryingNearMe: false,
            coords: state.previousCoords,
            sort: 'rank',
            classifications: [],
            within: 50
        }
    }
    else if(action.type === 'SELECT_NEAR_ME'){
        return{
            ...state,
            input: '',
            coords: action.coords,
            coordsAreNull: false,
            coordsAreValid: coordsAreValid(action.coords),
            shouldQueryAutocomplete: false,
            shouldQueryLocation: true,
            queryingNearMe: true
        }
    }
    else if(action.type === 'SET_WITHIN'){
        const within = action.value;
        switch(typeof within){
            case 'number':
                return {
                    ...state,
                    within
                }
            case 'string': 
                return {
                    ...state,
                    within: parseInt(within)
                }
            default:
                return state;
        }
    }
    else if(action.type === 'SET_CLASSIFICATIONS'){
        return {
            ...state,
            classifications: action.values
        }
    }
    else if(action.type === 'SET_SORT'){
        switch(action.value){
            case 'distance':
                return { ...state, sort: 'distance' }
            case 'rank':
                return { ...state, sort: 'rank' }
            default:
                return state;
        }
    }
    else{
        return state;
    }    
}
