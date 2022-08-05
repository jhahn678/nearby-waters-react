import React, { MouseEventHandler, useState } from 'react'
import classes from './SearchNearMeButton.module.css'
import { BsCursor, BsSearch, BsX } from 'react-icons/bs'
import { Title, Loader, Text } from '@mantine/core'
import { latlng } from '../../../types/Autocomplete'
import useCurrentLocation from '../../../hooks/utils/useCurrentLocation'
import { motion } from 'framer-motion'


type Props = {
    /** callback to set coordinates in state */
    onSelect: (coords: latlng) => void,
    /** callback to be called on dismiss */
    onClose: () => void
    /** Currently showing results near me  */
    isActive: boolean,
    numberOfResults: number | undefined,
    coords: latlng
}

const SearchNearMeButton = ({ onSelect, onClose, isActive, coords, numberOfResults }: Props): JSX.Element => {

    const { getCurrentLocation, isLoading } = useCurrentLocation({ onSuccess: onSelect })

    const handleClick = () => !isActive ? getCurrentLocation() : null

    const handleClose: MouseEventHandler<SVGElement> = e => {
        e.stopPropagation()
        onClose()
    }

    return (
        <motion.div 
            className={classes.container}
            animate={{ height: isActive ? 200 : 72, y: isActive ? '-65vh' : 0 }}
            transition={{ duration: .7, type: 'spring'}}
            whileHover={{ scale: 1.02 }}
            onClick={handleClick}
        >
            <div className={classes.heading}>
                <div className={classes.icon}><BsCursor size={16}/></div>
                <div>
                    <Title order={4} style={{ fontWeight: '500' }}>
                        { isActive ? 'Showing Results Near Me' : 'Show Waterbodies Near Me' }
                    </Title>
                </div>
                { 
                    isLoading ? 
                        <Loader className={classes.view} variant="dots" color='cyan'/> : 
                    isActive ?
                        <BsX size={32} className={classes.view} onClick={handleClose}/> :
                        <BsSearch size={24} className={classes.view}/> 
                }
            </div>
            { isActive && <div className={classes.details}>
                <Title order={5} style={{ display: 'flex', alignItems: 'center'}}>
                    Showing {numberOfResults || <Loader size='xs' style={{ paddingLeft: 3, paddingRight: 3 }}/>} results near:
                </Title>
                <Text size='md'>Latitude: {coords.latitude}</Text>
                <Text size='md'>Longitude: {coords.longitude}</Text>
            </div>}
        </motion.div>
    )
}

export default SearchNearMeButton