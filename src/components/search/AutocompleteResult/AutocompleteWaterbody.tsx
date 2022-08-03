import React, { MouseEventHandler, useRef } from 'react'
import { AutocompleteWaterbody as AutocompleteWaterbodyData } from '../../../types/Autocomplete'
import classes from './AutocompleteResult.module.css'
import { stateAbbrToName } from '../../../utils/stateAbbrToName'
import { BsWater, BsArrowRight, BsArrowLeft, BsX, BsXCircle } from 'react-icons/bs'
import { Title, Text, Center } from '@mantine/core'

type Props = {
    data: AutocompleteWaterbodyData,
    isSelected: boolean,
    onClick: () => void,
    onClose: () => void
}

const AutocompleteWaterbody = ({ data, onClick, onClose, isSelected }: Props): JSX.Element => {

    const handleClose: MouseEventHandler<HTMLDivElement> = e => {
        e.stopPropagation()
        onClose()
    }


    return (
        <div className={`${classes.waterbody} ${classes.container}
            ${isSelected && classes.containerSelected}`} onClick={onClick}
        >
            <div style={{ display: 'flex', alignItems: 'center', height: 50}}>
            <div className={classes.icon}><BsWater size={32}/></div>
            <div>
                <Title order={3} style={{ fontWeight: '500' }} className={classes.title}>{data.name}</Title>
                {
                    data.counties.length > 0 && data.counties.length <= 2 && data.states.length === 1 ?
                        <Text>{data.counties[0]}, {stateAbbrToName(data.states[0])}</Text> : 
                    data.states.length === 1 ?  
                        <Text>{stateAbbrToName(data.states[0])}, {data.country}</Text> :
                        <Text>{data.subregion} {data.country}</Text>
                }
            </div>
            { !isSelected ? 
                <BsArrowRight size={32} className={classes.view}/> :
                <div className={classes.close} onClick={handleClose}><BsX size={36}/></div>
            }
            </div>
        </div>
    )
}

export default AutocompleteWaterbody