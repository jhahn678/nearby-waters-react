import React from 'react'
import Geoplace from '../../../types/Geoplace'
import classes from './AutocompleteResult.module.css'
import { BsFlag, BsSearch } from 'react-icons/bs'
import { Title, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

type Props = {
    data: Geoplace,
    onSelect: () => void,
    onClose: () => void
}

const AutocompleteGeoplace = ({ data, onSelect }: Props): JSX.Element => {

    const maxWidth600 = useMediaQuery('(max-width: 600px)')

    return (
        <div className={`${classes.geoplace} ${classes.container}`} onClick={onSelect}>
            <div className={classes.headingContainer}>
                <div className={classes.icon}><BsFlag size={maxWidth600 ? 24 : 32}/></div>
                <div>
                    <Title order={maxWidth600 ? 4 : 3} style={{ fontWeight: '500' }}>{data.name}</Title>
                    { 
                        data.fcode === 'ADM1' ?
                            <Text>{data.country}</Text> :
                        data.admin_two ?
                            <Text>{data.admin_two}, {data.admin_one}</Text> :
                        data.admin_one ? 
                            <Text>{data.admin_one}, {data.country}</Text> :
                            <Text>{data.country}</Text>
                    }
                </div>
                <BsSearch size={maxWidth600 ? 24 : 28} className={classes.view}/>
            </div>
        </div>
    )
}

export default AutocompleteGeoplace







