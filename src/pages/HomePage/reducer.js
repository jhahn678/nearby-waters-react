export const initialState = {
    search: { value: '' },
    latitude: { value: '', valid: false },
    longitude: { value: '', valid: false },
    distance: { value: '10' },
    unit: { value: 'Miles' },
    form: { showErrors: false, isLoading: false },
    currentLocation: { 
        isLoading: false, 
        showError: false,
        error: null
    } 
}

export const reducer = (state, action) => {
    if(action.type === 'LAT'){
        const { latitude } = state;
        latitude.value = action.value;
        latitude.valid = (
            parseInt(action.value) &&
            action.value >= -90 &&
            action.value <= 90
        )
        return { ...state, latitude }
    }else if(action.type === 'LON'){
        const { longitude } = state;
        longitude.value = action.value;
        longitude.valid = (
            parseInt(action.value) &&
            action.value >= -180 &&
            action.value <= 180
        )
        return { ...state, longitude }
    }else if(action.type === 'COORDS'){
        const { latitude, longitude } = state;
        const { lng, lat } = action.value;
        latitude.value = lat.toFixed(6);
        latitude.valid = true;
        longitude.value = lng.toFixed(6);
        longitude.valid = true;
        return { ...state, latitude, longitude }
    }else if(action.type === 'DISTANCE'){
        const { distance } = state;
        distance.value = action.value;
        return { ...state, distance }
    }else if(action.type === 'UNIT'){
        const { unit } = state;
        unit.value = action.value;
        return { ...state, unit }
    }else if(action.type === 'SHOW_ERRORS'){
        const { form } = state;
        form.showErrors = true;
        return { ...state, form }
    }else if(action.type === 'HIDE_ERRORS'){
        const { form } = state;
        form.showErrors = false;
        return { ...state, form }
    }else if(action.type === 'GET_POSITION'){
        const { currentLocation } = state;
        currentLocation.isLoading = true;
        return { ...state, currentLocation }
    }else if(action.type === 'POSITION_FOUND'){
        const { currentLocation, latitude, longitude } = state;
        currentLocation.isLoading = false;
        currentLocation.showError = false;
        currentLocation.error = null;
        latitude.value = action.coords.latitude.toFixed(6);
        latitude.valid = true;
        longitude.value = action.coords.longitude.toFixed(6);
        longitude.valid = true;
        return { ...state, latitude, longitude, currentLocation }
    }else if(action.type === 'LOCATION_ERROR'){
        const { currentLocation } = state;
        currentLocation.error = action.value;
        currentLocation.showError = true;
        currentLocation.isLoading = false
        return { ...state, currentLocation }
    }else if(action.type === 'HIDE_MODAL'){
        const { currentLocation } = state;
        currentLocation.showError = false;
        currentLocation.error = null;
        return { ...state, currentLocation }
    }else if(action.type === 'SEARCHTERM'){
        const { search } = state;
        search.value = action.value;
        return { ...state, search }
    }else if(action.type === 'RESET'){
        const { search, latitude, longitude } = state;
        search.value = '';
        latitude.value = '';
        latitude.valid = false;
        longitude.value = '';
        longitude.valid = false;
        return { ...state, search, latitude, longitude }
    }else{
        return { ...initialState };
    }
} 