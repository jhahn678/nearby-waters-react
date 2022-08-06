import classes from './SearchNearLocationCard.module.css'
import React, { useEffect, useState } from 'react'
import Geoplace from '../../../types/Geoplace'
import { motion } from 'framer-motion'
import { BsTree, BsFlag, BsX } from 'react-icons/bs'
import { Title, Text } from '@mantine/core'

interface Props {
    selectedGeoplace: Geoplace | null
    numberOfResults: number
    onClose: () => void
}



const SearchNearLocationCard = (
    { selectedGeoplace, numberOfResults, onClose }: Props
): JSX.Element => {

    const handleBackgroundColor = () => (
        selectedGeoplace && selectedGeoplace.fcode === 'PRK' ?
        classes.park : classes.place
    )

    const [containerHeight, setContainerHeight] = useState(90)
    const [showDetails, setShowDetails] = useState(false)
    const [containerPosition, setContainerPosition] = useState<number | string>('50vw')

    useEffect(() => {
        if(selectedGeoplace && containerHeight === 90){
            setContainerPosition(0)
            const delay = setTimeout(() => setContainerHeight(250), 250)
            return () => clearTimeout(delay)
        }
        if(!selectedGeoplace && containerHeight === 250){
            setContainerHeight(90)
            const delay = setTimeout(() => setContainerPosition('50vw'), 200)
            return () => clearTimeout(delay)
        } 
    },[selectedGeoplace])


    return (
        <motion.div 
            animate={{ 
                x: containerPosition,
                height: containerHeight,
                transition: {
                    delay: selectedGeoplace ? .2 : 0,
                    duration: .5,
                    type: 'spring'
                }
            }}
            className={`${classes.container} ${handleBackgroundColor()}`}
        >
        { selectedGeoplace && <>
            <div className={classes.heading}>
                <div className={classes.icon}>
                    { selectedGeoplace.fcode === 'PRK' ? 
                        <BsTree size={24}/> : <BsFlag size={24}/> 
                    }
                </div>
                <div>                    
                    <Title order={4} style={{ fontWeight: '500' }}>
                        {selectedGeoplace.name}
                    </Title>
                    <Text>{selectedGeoplace.county}, {selectedGeoplace.state}</Text>
                </div>
                <BsX size={32} className={classes.view} onClick={onClose}/> 
            </div>
            { showDetails &&
                <motion.div className={classes.details} initial={{ opacity: 0}} animate={{ opacity: 1}}>
                    <Title order={5}>Showing {numberOfResults} results</Title>
                </motion.div>  
            }   
        </>}   
        </motion.div>
    )
}

export default SearchNearLocationCard;