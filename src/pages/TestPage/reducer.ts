import { latlng } from "../../types/Autocomplete"
import { validateCoords } from '../../utils/validateCoords'

type State = {
    queryType: 'ALL' | 'GEOPLACES' | 'WATERBODIES',
    input: string,
    coords: latlng,
    coordsValid: boolean,
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
    coordsValid: false,
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
        const { coords } = state;
        const valid = validateCoords({ 
            latitude: action.value, 
            longitude: coords.longitude
        })
        return { 
            ...state, 
            fieldsTouched: true,
            coordsValid: valid,
            coords: { 
                ...state.coords, 
                latitude: action.value
            }
        }
    }
    else if(action.type === 'LONGITUDE'){
        const { coords } = state;
        const valid = validateCoords({ 
            latitude: coords.latitude, 
            longitude: action.value
        })
        return { 
            ...state, 
            fieldsTouched: true, 
            coordsValid: valid,
            coords: { 
                ...state.coords, 
                longitude: action.value
            },
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
            coordsValid: true,
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