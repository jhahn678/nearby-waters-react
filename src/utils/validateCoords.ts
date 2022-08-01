import { latlng } from "../types/Autocomplete";


/**
 * 
 * @param coords
 * @returns True if both coords are valid
 */
export const coordsAreValid = (coords: latlng): boolean => {
    if(!coords.latitude || !coords.longitude){
        return false;
    }else{
        try{
            let lat = coords.latitude;
            let lng = coords.longitude;

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
            return false
        }

    }
}




export const coordsNotNull = (
    coords: latlng
): boolean => (coords.latitude && coords.longitude) ? true : false;

export const coordsAreNull = (
    coords: latlng
): boolean => (!coords.latitude && !coords.latitude) ? true : false;
