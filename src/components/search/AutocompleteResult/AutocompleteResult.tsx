import React, { useState } from 'react'
import { AutocompleteResult as AutocompleteResultData } from '../../../types/Autocomplete'
import classes from './AutocompleteResult.module.css'

type Props = {
    data: AutocompleteResultData
}

const AutocompleteResult = ({ data }: Props): JSX.Element => {

    
    
    return (
        <div className={(
            data.type === 'WATERBODY' ? classes.containerWaterbody : 
            data.fcode === 'PRK' ? classes.containerPark : classes.containerGeoplace
        )}
        >
            <h3>{data.name}</h3>
        </div>
    )
}

export default AutocompleteResult
