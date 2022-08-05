import React, { MouseEventHandler } from 'react'
import classes from './AutocompleteResult.module.css'
import { stateAbbrToName } from '../../../utils/stateAbbrToName'
import { BsWater, BsArrowRight, BsX  } from 'react-icons/bs'
import { capitalize } from '../../../utils/conversions'
import { Title, Text } from '@mantine/core'
import Waterbody from '../../../types/Waterbody'

const Label = ({ label }: { label: string}) => (
    <Text color='#607685' size='md' style={{ paddingRight: 32 }}>{label}:</Text>
)

type Props = {
    data: Waterbody,
    isSelected: boolean,
    onSelect: () => void,
    onClose: () => void
}

const AutocompleteWaterbody = ({ data, onSelect, onClose, isSelected }: Props): JSX.Element => {

    const handleClose: MouseEventHandler<HTMLDivElement> = e => {
        e.stopPropagation()
        onClose()
    }


    return (
        <div className={`${classes.waterbody} ${classes.container}
            ${isSelected && classes.containerSelected}`} onClick={onSelect}
        >
            <div className={classes.headingContainer}>
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
            { isSelected &&
                <div className={classes.waterbodyDetails}>
                    <Label label='Classification'/>
                    <Text size='md'>{capitalize(data.classification)}</Text>
                    <Label label='Country'/>
                    <Text size='md'>{data.country}</Text>
                    <Label label='Subregion'/>
                    <Text size='md'>{data.subregion}</Text>
                    <Label label='States'/>
                    <Text size='md'>{data.states.map(x => stateAbbrToName(x)).join(', ')}</Text>
                    <Label label='Counties'/>
                    <Text size='md' style={{height: 100, overflowY: 'scroll' }}>{data.counties.join(', ')}</Text>
                </div>
            }
        </div>
    )
}

export default AutocompleteWaterbody