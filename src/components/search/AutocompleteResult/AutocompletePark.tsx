import React, { useState } from 'react'
import { AutocompleteGeoplace } from '../../../types/Autocomplete'
import classes from './AutocompleteResult.module.css'
import { BsTree, BsSearch } from 'react-icons/bs'
import { Title, Text } from '@mantine/core'


type Props = {
    data: AutocompleteGeoplace
}

const AutocompletePark = ({ data }: Props): JSX.Element => {


    return (
        <div className={`${classes.park} ${classes.container}`}>
            <div className={classes.icon}><BsTree size={32}/></div>
            <div>
                <Title order={3} style={{ fontWeight: '500' }} className={classes.title}>{data.name}</Title>
                <Text>{data.county}, {data.state}</Text>
            </div>
            <BsSearch size={28} className={classes.view}/>
        </div>
    )
}

export default AutocompletePark