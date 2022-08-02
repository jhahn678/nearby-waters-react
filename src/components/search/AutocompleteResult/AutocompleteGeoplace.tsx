import React, { useState } from 'react'
import { AutocompleteGeoplace as AutocompleteGeoplaceData } from '../../../types/Autocomplete'
import classes from './AutocompleteResult.module.css'
import { BsFlag, BsSearch } from 'react-icons/bs'
import { Title, Text } from '@mantine/core'

type Props = {
    data: AutocompleteGeoplaceData
}

const AutocompleteGeoplace = ({ data }: Props): JSX.Element => {



    return (
        <div className={`${classes.geoplace} ${classes.container}`}>
            <div className={classes.icon}><BsFlag size={32}/></div>
            <div>
                <Title order={3} style={{ fontWeight: '500' }}>{data.name}</Title>
                <Text>{data.county}, {data.state}</Text>
            </div>
            <BsSearch size={28} className={classes.view}/>
        </div>
    )
}

export default AutocompleteGeoplace