import { latlng } from "../../types/Autocomplete"
import Geoplace from '../../types/Geoplace'
import { coordsAreNull, coordsAreValid } from '../../utils/validateCoords'

type State = {
    autocompleteType: 'ALL' | 'GEOPLACES' | 'WATERBODIES',
    input: string,
    coords: latlng,
    coordsAreValid: boolean,
    coordsAreNull: boolean,
    locationError: boolean,
    fieldsTouched: boolean,
    showMap: boolean,
    waterbody_id: string | null,
    selectedGeoplace: Geoplace | null
    queryingNearMe: boolean
    shouldQueryLocation: boolean
    shouldQueryAutocomplete: boolean
}

type Action = 
| { type: 'INPUT_VALUE', value: string }
| { type: 'INPUT_LATITUDE', value: string }
| { type: 'INPUT_LONGITUDE', value: string }
| { type: 'SELECT_QUERYTYPE', value: 'ALL' | 'GEOPLACES' | 'WATERBODIES' }
| { type: 'SET_CURRENT_LOCATION', value: latlng }
| { type: 'LOCATION_ERROR' }
| { type: 'SELECT_WATERBODY', _id: string }
| { type: 'CLEAR_WATERBODY' }
| { type: 'SELECT_LOCATION', geoplace: Geoplace }
| { type: 'CLEAR_LOCATION' }
| { type: 'SELECT_NEAR_ME', coords: latlng }



export const initialState: State = {
    input: '',
    coords: { latitude: '', longitude: '' },
    coordsAreValid: false,
    coordsAreNull: true,
    shouldQueryLocation: false,
    shouldQueryAutocomplete: false,
    autocompleteType: 'ALL',
    locationError: false,
    fieldsTouched: false,
    showMap: false,
    waterbody_id: null,
    selectedGeoplace: null,
    queryingNearMe: false
}


export const reducer = (state: State, action: Action): State => {
    if(action.type === 'INPUT_VALUE'){
        const { coordsAreNull, coordsAreValid, shouldQueryLocation } = state;
        const shouldQueryAutocomplete = !shouldQueryLocation && (
            coordsAreValid || (coordsAreNull && action.value.length > 0)
        )
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
            waterbody_id: action._id
        }
    }
    else if(action.type === 'CLEAR_WATERBODY'){
        return {
            ...state,
            showMap: false,
            waterbody_id: null
        }
    }
    else if(action.type === 'SELECT_LOCATION'){
        const { coordinates } = action.geoplace.geometry;
        return {
            ...state,
            coordsAreNull: false,
            coordsAreValid: true,
            shouldQueryLocation: true,
            shouldQueryAutocomplete: false,
            selectedGeoplace: action.geoplace,
            coords: { 
                longitude: coordinates[0], 
                latitude: coordinates[1]
            }
        }
    }
    else if(action.type === 'CLEAR_LOCATION'){
        return {
            ...state,
            shouldQueryAutocomplete: false,
            shouldQueryLocation: false,
            selectedGeoplace: null,
            coordsAreNull: true,
            coordsAreValid: false,
            queryingNearMe: false,
            coords: {
                latitude: '',
                longitude: ''
            }
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
    else{
        return state;
    }    
}
