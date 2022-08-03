import { useGeolocated } from "react-geolocated";
import { latlng } from "../../../types/Autocomplete";
import { Button, Text, Loader, MantineSize } from '@mantine/core'
import { BiCurrentLocation } from 'react-icons/bi'
import useModalContext from "../../../hooks/contexts/modal/useModalContext";
import React, { useState } from 'react'
import { GEOLOCATION_DISABLED_BODY, GEOLOCATION_UNAVAILABLE_BODY} from '../../../hooks/contexts/modal/constants'



type Props = {
    className?: string,
    onSuccess: (coords: latlng) => void,
    onError?: () => void,
    size?: MantineSize
}


const CurrentLocationButton = ( 
    { className, onSuccess, onError, size='md' }: Props 
): JSX.Element => {
    const { isGeolocationAvailable, isGeolocationEnabled, getPosition } = useGeolocated({
        suppressLocationOnMount: true,
        onSuccess: ({ coords }) => {
            setIsLoading(false)
            onSuccess(coords)
        },
        onError: () => {
            setIsLoading(false)
            onError && onError()
        }
    })
    
    const [isLoading, setIsLoading] = useState(false)

    const { dispatch: modalDispatch } = useModalContext()
    
      
    const handleCurrentLocation = () => {
        if(!isGeolocationEnabled){
            modalDispatch({ type: 'SHOW_ERROR_MODAL', body: GEOLOCATION_DISABLED_BODY })
        }else if(!isGeolocationAvailable){
            modalDispatch({ type: 'SHOW_ERROR_MODAL', body: GEOLOCATION_UNAVAILABLE_BODY })
        }else{
            setIsLoading(true)
            getPosition()
        }
    }
    
    return (
        <Button variant='outline' className={className} 
            onClick={handleCurrentLocation} size={size}
        > 
            <Text weight='500'>Use my current location</Text>
            { isLoading ? 
            <Loader variant="dots" size='sm' color='blue' style={{ marginLeft: 8 }}/> : 
            <BiCurrentLocation size={24}/> 
            }
        </Button>
    )
}

export default CurrentLocationButton;