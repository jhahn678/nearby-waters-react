import classes from './SearchNearLocationCard.module.css'
import React, { useEffect, useState } from 'react'
import Geoplace from '../../../types/Geoplace'
import { motion } from 'framer-motion'
import { BsTree, BsFlag, BsX } from 'react-icons/bs'
import { Title, Text, Select } from '@mantine/core'
import WaterbodyClassificationSelect from '../WaterbodyClassificationSelect/WaterbodyClassificationSelect'

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

interface Props {
    selectedGeoplace: Geoplace | null
    numberOfResults: number
    onClose: () => void,
    onChangeRadius: (value: string | null) => void,
    onChangeClassification: (values: string[]) => void,
    onChangeSort: (value: string |  null) => void,
}


const SearchNearLocationCard = ({ 
    onClose,
    onChangeRadius,
    onChangeClassification,
    onChangeSort,
    selectedGeoplace, 
    numberOfResults, 
}: Props): JSX.Element => {

    const handleBackgroundColor = () => (
        selectedGeoplace && selectedGeoplace.fcode === 'PRK' ?
        classes.park : classes.place
    )

    const [containerHeight, setContainerHeight] = useState(90)
    const [showDetails, setShowDetails] = useState(false)
    const [containerPosition, setContainerPosition] = useState<number | string>('100vw')

    useEffect(() => {
        if(selectedGeoplace){
            setContainerPosition(0)
            const delayHeight = setTimeout(() => setContainerHeight(336), 400)
            const delayDetails = setTimeout(() => setShowDetails(true), 600)
            return () => { clearTimeout(delayHeight); clearTimeout(delayDetails) }
        }
        if(!selectedGeoplace){
            setShowDetails(false)
            setContainerHeight(90)
            const delayPosition = setTimeout(() => setContainerPosition('100vw'), 200)
            return () => clearTimeout(delayPosition)
        } 
    },[selectedGeoplace])


    return (
        <motion.div 
            animate={{ 
                x: containerPosition,
                height: containerHeight,
                transition: {
                    duration: .7,
                    type: 'spring'
                }
            }}
            className={`${classes.container} ${handleBackgroundColor()}`}
        >
        { selectedGeoplace &&
            <>
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
                        <Text>{selectedGeoplace.county}, {selectedGeoplace.admin_one}</Text>
                    </div>
                    <BsX size={32} className={classes.view} onClick={onClose}/> 
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
                            <Text style={{ justifySelf: 'flex-end'}}>{selectedGeoplace.geometry.coordinates[1]}</Text>
                            <Text size='md'>Longitude: </Text>
                            <Text style={{ justifySelf: 'flex-end'}}>{selectedGeoplace.geometry.coordinates[0]}</Text>
                            <Text size='md'>Radius: </Text>
                            <Select
                                data={radiusValues} size='xs'
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
                                setClassifications={values => onChangeClassification(values)}
                            />
                        </div> 
                    </>
                } 
            </>
        }   
        </motion.div>
    )
}

export default SearchNearLocationCard;