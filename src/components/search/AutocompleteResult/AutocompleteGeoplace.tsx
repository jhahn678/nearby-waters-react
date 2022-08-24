import React from 'react'
import Geoplace from '../../../types/Geoplace'
import classes from './AutocompleteResult.module.css'
import { BsFlag, BsSearch } from 'react-icons/bs'
import { Title, Text } from '@mantine/core'

type Props = {
    data: Geoplace,
    onSelect: () => void,
    onClose: () => void
}

const AutocompleteGeoplace = ({ data, onSelect, onClose }: Props): JSX.Element => {



    return (
        <div className={`${classes.geoplace} ${classes.container}`} onClick={onSelect}>
            <div className={classes.headingContainer}>
                <div className={classes.icon}><BsFlag size={32}/></div>
                <div>
                    <Title order={3} style={{ fontWeight: '500' }}>{data.name}</Title>
                    { 
                        data.county ?
                            <Text>{data.county}, {data.admin_one}</Text> :
                        data.admin_one ? 
                            <Text>{data.admin_one}, {data.country}</Text> :
                            <Text>{data.country}</Text>
                    }
                </div>
                <BsSearch size={28} className={classes.view}/>
            </div>
        </div>
    )
}

export default AutocompleteGeoplace







