import React, { MouseEventHandler, useState, useEffect, useRef } from 'react'
import classes from './SearchNearMeButton.module.css'
import { Title, Loader, Text, Select } from '@mantine/core'
import { BsCursor, BsSearch, BsX } from 'react-icons/bs'
import { latlng } from '../../../types/Autocomplete'
import useCurrentLocation from '../../../hooks/utils/useCurrentLocation'
import { motion } from 'framer-motion'
import WaterbodyClassificationSelect from '../../search/WaterbodyClassificationSelect/WaterbodyClassificationSelect'


const radiusValues = [
    { value: '10', label: '10 miles' },
    { value: '25', label: '25 miles' },
    { value: '50', label: '50 miles' },
    { value: '100', label: '100 miles' }
]

const sortValues = [
    { value: 'rank', label: 'Best Match' },
    { value: 'distance', label: 'Distance' }
]

type Props = {
    /** callback to set coordinates in state */
    onSelect: (coords: latlng) => void,
    /** callback to be called on dismiss */
    onClose: () => void
    /** callback to set search radius on change */
    onChangeRadius: (radius: string | null) => void,
    /** callback to set classifications on change */
    onChangeClassifications: (values: string[]) => void
    /** callback to set sort method on change */
    onChangeSort: (value: string |  null) => void,
    /** Currently showing results near me  */
    isActive: boolean,
    /** When a location is selected and card should hide */
    hide: boolean,
    /**  Total number of waterbodies matching queries */
    numberOfResults: number | undefined,
    /** Coord */
    coords: latlng
}

const SearchNearMeButton = ({ 
    onSelect, 
    onClose,
    onChangeRadius,
    onChangeClassifications, 
    onChangeSort,
    isActive, 
    hide, 
    coords, 
    numberOfResults,
}: Props): JSX.Element => {

    const containerRef = useRef<HTMLDivElement>(null)

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
        const container = containerRef.current
        if(container && isActive) {
            const offset = (container.offsetTop - 48) * -1
            const delayPosition = setTimeout(() => setContainerPosition(offset), 100)
            const delayHeight = setTimeout(() => setContainerHeight(320), 400)
            const delayDetails = setTimeout(() => setShowDetails(true), 600)
            return () => { clearTimeout(delayPosition); clearTimeout(delayHeight); clearTimeout(delayDetails) }
        }
        else if(hide) {
            setContainerPosition(500)
            setContainerHeight(72)
        }
        else{
            const delayHeight = setTimeout(() => {
                setShowDetails(false)
                setContainerHeight(72)
            }, 100)
            const delayPosition = setTimeout(() => setContainerPosition(0), 300)
            return () => { clearTimeout(delayHeight); clearTimeout(delayPosition)}
        }
    },[isActive, hide])

    return (
        <motion.div ref={containerRef}
            className={classes.container}
            animate={{ 
                height: containerHeight, 
                y: containerPosition,
                transition: {
                    duration: .8,
                    type: 'spring'
                } 
            }}
            whileHover={{ scale: isActive ? 1 : 1.02 }}
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
            { showDetails && 
                    <>
                        <motion.div 
                            className={classes.details} 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1, transition: { duration: .1 }}}>
                            <Title order={5}>Showing {numberOfResults} results</Title>
                        </motion.div> 
                        <div className={classes.grid}> 
                            <Text size='md'>Latitude: </Text>
                            <Text style={{ justifySelf: 'flex-end'}}>{coords.latitude}</Text>
                            <Text size='md'>Longitude: </Text>
                            <Text style={{ justifySelf: 'flex-end'}}>{coords.longitude}</Text>
                            <Text size='md'>Radius: </Text>
                            <Select
                                size='xs' data={radiusValues} 
                                style={{ width: 165, justifySelf: 'flex-end' }}
                                styles={{ defaultVariant: { backgroundColor: 'rgba(255,255,255,.7)'}}}
                                placeholder='Radius in miles' defaultValue='50'
                                onChange={x => onChangeRadius(x)}
                            />
                            <Text size='md'>Sort By: </Text>
                            <Select
                                data={sortValues} size='xs' defaultValue='rank'
                                style={{ width: 165, justifySelf: 'flex-end' }}
                                styles={{ defaultVariant: { backgroundColor: 'rgba(255,255,255,.7)'}}}
                                onChange={x => onChangeSort(x)}
                            />
                            <Text size='md'>Filter: </Text>
                            <WaterbodyClassificationSelect 
                                MultiSelectProps={{ style: { justifySelf: 'flex-end' }}}
                                setClassifications={values => onChangeClassifications(values)}
                            />
                        </div> 
                    </>
                } 
        </motion.div>
    )
}

export default SearchNearMeButton