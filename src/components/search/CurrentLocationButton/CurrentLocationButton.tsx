import { useGeolocated } from "react-geolocated";
import { latlng } from "../../../types/Autocomplete";
import { Button, Text, Loader, SharedButtonProps } from '@mantine/core'
import { BiCurrentLocation } from 'react-icons/bi'
import useModalContext from "../../../hooks/contexts/modal/useModalContext";
import React, { useState } from 'react'
import { GEOLOCATION_DISABLED_BODY, GEOLOCATION_UNAVAILABLE_BODY} from '../../../hooks/contexts/modal/constants'
import useCurrentLocation from "../../../hooks/utils/useCurrentLocation";



type Props = {
    className?: string,
    onSuccess: (coords: latlng) => void,
    onError?: () => void,
    ButtonProps?: SharedButtonProps
}


const CurrentLocationButton = ( 
    { className, onSuccess, onError, ButtonProps }: Props 
): JSX.Element => {
    
    const { getCurrentLocation, isLoading } = useCurrentLocation({ onSuccess, onError })
  
    return (
        <Button 
            className={className} onClick={getCurrentLocation} 
            styles={{ filled: { color: 'black' }}} 
            variant='filled' size='md' color='grayblue' {...ButtonProps}
        > 
            <Text weight='500'>Use my current location</Text>

            { isLoading ? 
                <Loader variant="dots" 
                    size='sm' color='blue' 
                    style={{ marginLeft: 8 }}
                /> : 
                <BiCurrentLocation size={24}/> 
            }
            
        </Button>
    )
}

export default CurrentLocationButton;