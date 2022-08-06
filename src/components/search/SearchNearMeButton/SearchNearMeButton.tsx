import React, { MouseEventHandler, useState, useEffect } from 'react'
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
    /** When a location is selected and card should hide */
    hide: boolean,
    numberOfResults: number | undefined,
    coords: latlng
}

const SearchNearMeButton = ({ onSelect, onClose, isActive, hide, coords, numberOfResults }: Props): JSX.Element => {

    const { getCurrentLocation, isLoading } = useCurrentLocation({ onSuccess: onSelect })

    const handleClick = () => !isActive ? getCurrentLocation() : null

    const handleClose: MouseEventHandler<SVGElement> = e => {
        e.stopPropagation()
        onClose()
    }

    const [containerPosition, setContainerPosition] = useState<number | string>(0)
    const [containerHeight, setContainerHeight] = useState(72)
    const [showDetails, setShowDetails] = useState(false)

    useEffect(() => {
        if(isActive) {
            const delayPosition = setTimeout(() => setContainerPosition('-65vh'), 100)
            const delayHeight = setTimeout(() => setContainerHeight(200), 400)
            const delayDetails = setTimeout(() => setShowDetails(true), 500)
            return () => { clearTimeout(delayPosition); clearTimeout(delayHeight); clearTimeout(delayDetails) }
        }
        else if(hide) {
            setContainerPosition(500)
            setContainerHeight(72)
        }
        else{
            const delayHeight = setTimeout(() => {
                setContainerHeight(72)
                setShowDetails(false)
            }, 100)
            const delayPosition = setTimeout(() => setContainerPosition(0), 300)
            return () => { clearTimeout(delayHeight); clearTimeout(delayPosition)}
        }
    },[isActive, hide])

    return (
        <motion.div 
            className={classes.container}
            animate={{ height: containerHeight, y: containerPosition }}
            transition={{ duration: .7, type: 'spring'}}
            whileHover={{ scale: 1.02 }}
            onClick={handleClick}
        >
            <div className={classes.heading}>
                <div className={classes.icon}><BsCursor size={16}/></div>
                <div>
                    <Title order={4} style={{ fontWeight: '500' }}>
                        Show Waterbodies Near Me
                    </Title>
                </div>
                { 
                    isLoading ? 
                        <Loader className={classes.view} color='cyan'/> : 
                    isActive ?
                        <BsX size={32} className={classes.view} onClick={handleClose}/> :
                        <BsSearch size={24} className={classes.view}/> 
                }
            </div>
            { showDetails && <motion.div className={classes.details}>
                <Title order={5} style={{ display: 'flex', alignItems: 'center'}}>
                    Showing {numberOfResults || <Loader size='xs' style={{ paddingLeft: 3, paddingRight: 3 }}/>} results near:
                </Title>
                <Text size='md'>Latitude: {coords.latitude}</Text>
                <Text size='md'>Longitude: {coords.longitude}</Text>
            </motion.div>}
        </motion.div>
    )
}

export default SearchNearMeButton