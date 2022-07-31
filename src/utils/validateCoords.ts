import { latlng } from "../types/Autocomplete";


/**
 * 
 * @param coords
 * @returns True if BOTH coords are null or if both coords are valid
 */
export const validateCoords = (coords: latlng): boolean => {
    if(coordsAreNull(coords)){
        return true;
    }else if(coordsNotNull(coords)){
        return coordsAreValid(coords)
    }else{
        return false;
    }
}




export const coordsNotNull = (
    coords: latlng
): boolean => (coords.latitude && coords.longitude) ? true : false;

export const coordsAreNull = (
    coords: latlng
): boolean => (!coords.latitude && !coords.latitude) ? true : false;

export const coordsAreValid = ({ latitude, longitude }: latlng): boolean => {
    try{
        let lat = latitude;
        let lng = longitude;

        if(typeof lat === 'string'){
            lat = parseFloat(lat)
        }
        if(typeof lng === 'string'){
            lng = parseFloat(lng)
        }

        if( 
            lng > -180 && lng < 180 &&
            lat > -90 && lat < 90
        ){
            return true;
        }else {
            return false;
        }
    }catch(err){
        return false;
    }
}