export const initialState = {
    latitude: { value: '', valid: false },
    longitude: { value: '', valid: false },
    distance: { value: 10, valid: true },
    unit: { value: 'Miles' }
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
        const { latitude, longitude} = state;
        latitude.value = action.coords.latitude;
        latitude.valid = true;
        longitude.value = action.coords.longitude;
        longitude.valid = true;
        return { ...state, latitude, longitude }
    }else if(action.type === 'DISTANCE'){
        const { distance } = state;
        distance.value = action.value;
        distance.valid = parseInt(action.value);
        return { ...state, distance }
    }else if(action.type === 'UNIT'){
        const { unit } = state;
        unit.value = action.value;
        return { ...state, unit }
    }else{
        return {...initialState}
    }
} 