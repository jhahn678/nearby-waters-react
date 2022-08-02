import React, { useState } from 'react'
import { AutocompleteWaterbody as AutocompleteWaterbodyData } from '../../../types/Autocomplete'
import classes from './AutocompleteResult.module.css'
import { stateAbbrToName } from '../../../utils/stateAbbrToName'
import { BsWater, BsArrowRight } from 'react-icons/bs'
import { Title, Text } from '@mantine/core'

type Props = {
    data: AutocompleteWaterbodyData
}

const AutocompleteWaterbody = ({ data }: Props): JSX.Element => {

    return (
        <div className={`${classes.waterbody} ${classes.container}`}>
            <div className={classes.icon}><BsWater size={32}/></div>
            <div>
                <Title order={3} style={{ fontWeight: '500' }} className={classes.title}>{data.name}</Title>
                {
                    data.counties.length <= 2 &&  data.states.length === 1 ? <Text>{data.counties[0]}, {stateAbbrToName(data.states[0])}</Text> : 
                    data.states.length === 1 ?  <Text>{stateAbbrToName(data.states[0])}, {data.country}</Text> :
                    <Text>{data.subregion} {data.country}</Text>
                }
            </div>
            <BsArrowRight size={32} className={classes.view}/>
        </div>
    )
}

export default AutocompleteWaterbody