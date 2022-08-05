import React from 'react'
import classes from './AutocompleteResult.module.css'
import { BsTree, BsSearch } from 'react-icons/bs'
import { Title, Text } from '@mantine/core'
import Geoplace from '../../../types/Geoplace'


type Props = {
    data: Geoplace,
    onSelect: () => void,
    onClose: () => void
}

const AutocompletePark = ({ data, onSelect, onClose }: Props): JSX.Element => {


    return (
        <div className={`${classes.park} ${classes.container}`} onClick={onSelect}>
            <div className={classes.headingContainer}>
                <div className={classes.icon}><BsTree size={32}/></div>
                <div>
                    <Title order={3} style={{ fontWeight: '500' }} className={classes.title}>{data.name}</Title>
                    <Text>{data.county}, {data.state}</Text>
                </div>
                <BsSearch size={28} className={classes.view}/>
            </div>
        </div>
    )
}

export default AutocompletePark
