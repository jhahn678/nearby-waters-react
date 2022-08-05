import useModalContext from "../../hooks/contexts/modal/useModalContext";
import { useState, useEffect } from 'react'
import { 
    GEOLOCATION_DISABLED_BODY, 
    GEOLOCATION_DEFAULT_ERROR,
    GEOLOCATION_UNAVAILABLE_BODY
} from '../../hooks/contexts/modal/constants'
import { useGeolocated } from "react-geolocated";
import { latlng } from '../../types/Autocomplete'


interface Params {
    onSuccess: (coords: latlng) => void,
    onError?: () => void
}


const useCurrentLocation = ({ onSuccess, onError }: Params) => {

    const { dispatch } = useModalContext()

    const [isLoading, setIsLoading] = useState(false)


    const { 
        isGeolocationAvailable, 
        isGeolocationEnabled, 
        getPosition 
    } = useGeolocated({
        suppressLocationOnMount: true,
        onSuccess: ({ coords }) => {
            setIsLoading(false)
            onSuccess(coords)
        },
        onError: () => {
            setIsLoading(false)
            dispatch({ 
                type: 'SHOW_ERROR_MODAL',
                body: GEOLOCATION_DEFAULT_ERROR 
            })
            onError && onError()
        }
    })


    const getCurrentLocation = () => {
        if(!isGeolocationEnabled){
            dispatch({ type: 'SHOW_ERROR_MODAL', body: GEOLOCATION_DISABLED_BODY })
        }else if(!isGeolocationAvailable){
            dispatch({ type: 'SHOW_ERROR_MODAL', body: GEOLOCATION_UNAVAILABLE_BODY })
        }else{
            setIsLoading(true)
            getPosition()
        }
    }

    useEffect(() => {
        if(!isGeolocationEnabled){
            dispatch({ type: 'SHOW_ERROR_MODAL', body: GEOLOCATION_DISABLED_BODY })
        }else if(!isGeolocationAvailable){
            dispatch({ type: 'SHOW_ERROR_MODAL', body: GEOLOCATION_UNAVAILABLE_BODY })
        }
    },[isGeolocationAvailable, isGeolocationEnabled])
    

    return {
        isLoading,
        getCurrentLocation,
    }

}


export default useCurrentLocation;