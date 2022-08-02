import { latlng } from "../../types/Autocomplete"
import { coordsAreNull, coordsAreValid } from '../../utils/validateCoords'

type State = {
    queryType: 'ALL' | 'GEOPLACES' | 'WATERBODIES',
    input: string,
    coords: latlng,
    coordsAreValid: boolean,
    coordsAreNull: boolean,
    locationError: boolean,
    fieldsTouched: boolean
}

type Action = 
| { type: 'INPUT', value: string }
| { type: 'LATITUDE', value: string }
| { type: 'LONGITUDE', value: string }
| { type: 'QUERYTYPE', value: 'ALL' | 'GEOPLACES' | 'WATERBODIES' }
| { type: 'SET_COORDS', value: latlng }
| { type: 'LOCATION_ERROR', value: boolean }


export const initialState: State = {
    queryType: 'ALL',
    input: '',
    coords: { latitude: '', longitude: '' },
    coordsAreValid: false,
    coordsAreNull: true,
    locationError: false,
    fieldsTouched: false
}


export const reducer = (state: State, action: Action): State => {
    if(action.type === 'INPUT'){
        return { 
            ...state, 
            fieldsTouched: true, 
            input: action.value 
        }
    }
    else if(action.type === 'LATITUDE'){
        const newCoords = { 
            latitude: action.value, 
            longitude: state.coords.longitude
        }
        const coordsValid = coordsAreValid(newCoords)
        const coordsNull = coordsAreNull(newCoords)
        return { 
            ...state, 
            fieldsTouched: true,
            coordsAreValid: coordsValid,
            coordsAreNull: coordsNull,
            coords: newCoords
        }
    }
    else if(action.type === 'LONGITUDE'){
        const newCoords = { 
            latitude: state.coords.latitude, 
            longitude: action.value
        }
        const coordsValid = coordsAreValid(newCoords)
        const coordsNull = coordsAreNull(newCoords)
        return { 
            ...state, 
            fieldsTouched: true, 
            coordsAreValid: coordsValid,
            coordsAreNull: coordsNull,
            coords: newCoords,
        }
    }
    else if(action.type === 'QUERYTYPE'){
        return { 
            ...state, 
            fieldsTouched: true, 
            queryType: action.value 
        }
    }
    else if(action.type === 'SET_COORDS'){
        return { 
            ...state, 
            fieldsTouched: true, 
            coordsAreValid: true,
            coordsAreNull: false,
            coords: action.value 
        }
    }
    else if(action.type === 'LOCATION_ERROR'){
        return {
            ...state,
            locationError: true
        }
    }
    else{
        return state;
    }
            
}