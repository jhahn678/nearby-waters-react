import { useGeolocated, GeolocatedResult } from "react-geolocated";
import { latlng } from "../../../types/Autocomplete";
import { Button, Text, Loader, MantineSize } from '@mantine/core'
import { BiCurrentLocation } from 'react-icons/bi'
import React, { useState } from 'react'



type Props = {
    className?: string,
    onSuccess: (coords: latlng) => void,
    onError?: () => void,
    onGeolocationDisabled?: () => void,
    onGeolocationUnavailable?: () => void,
    size?: MantineSize
}


const CurrentLocationButton = ( 
    { className, onSuccess, onError, onGeolocationDisabled, onGeolocationUnavailable, size='md' }: Props 
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
    
      
    const handleCurrentLocation = () => {
        if(!isGeolocationEnabled && onGeolocationDisabled){
            onGeolocationDisabled()
        }else if(!isGeolocationAvailable && onGeolocationUnavailable){
            onGeolocationUnavailable()
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