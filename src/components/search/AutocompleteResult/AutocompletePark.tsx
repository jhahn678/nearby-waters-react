import React from 'react'
import classes from './AutocompleteResult.module.css'
import { BsTree, BsSearch } from 'react-icons/bs'
import { Title, Text } from '@mantine/core'
import Geoplace from '../../../types/Geoplace'
import { useMediaQuery } from '@mantine/hooks'


type Props = {
    data: Geoplace,
    onSelect: () => void,
    onClose: () => void
}

const AutocompletePark = ({ data, onSelect }: Props): JSX.Element => {

    const maxWidth600 = useMediaQuery('(max-width: 600px)')

    return (
        <div className={`${classes.park} ${classes.container}`} onClick={onSelect}>
            <div className={classes.headingContainer}>
                <div className={classes.icon}><BsTree size={maxWidth600 ? 24 : 32}/></div>
                <div>
                    <Title 
                        order={maxWidth600 ? 4 : 3} 
                        style={{ fontWeight: '500' }} 
                        className={classes.title}
                    >{data.name}</Title>
                    { 
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

export default AutocompletePark
