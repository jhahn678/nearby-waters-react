import React, { MouseEventHandler } from 'react'
import classes from './AutocompleteResult.module.css'
import { BsWater, BsArrowRight, BsX  } from 'react-icons/bs'
import { capitalize } from '../../../utils/conversions'
import { Title, Text } from '@mantine/core'
import Waterbody from '../../../types/Waterbody'
import { useMediaQuery } from '@mantine/hooks'
import useModalContext from '../../../hooks/contexts/modal/useModalContext'

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

    const maxWidth600 = useMediaQuery('(max-width: 600px)')
    const maxWidth1050 = useMediaQuery('(max-width: 1050px)')
    const { dispatch } = useModalContext()

    const handleClose: MouseEventHandler<HTMLDivElement> = e => {
        e.stopPropagation()
        onClose()
    }

    const handleClick = () => {
        if(maxWidth1050){
            dispatch({ 
                type: 'SHOW_ERROR_MODAL', 
                title: 'Viewable on desktop only',
                body: 'This action can only be performed from a desktop browser.'
            })
        }else{
            onSelect()
        }
    }

    return (
        <div className={`${classes.waterbody} ${classes.container}
            ${isSelected && classes.containerSelected}`} onClick={handleClick}
        >
            <div className={classes.headingContainer}>
                <div className={classes.icon}><BsWater size={maxWidth600 ? 24 : 32}/></div>
                <div>
                    <Title order={maxWidth600 ? 4 : 3} style={{ fontWeight: '500' }} className={classes.title}>{data.name}</Title>
                    { 
                        data.admin_two && data.admin_two.length === 1 ?
                            <Text>{data.admin_two[0]}, {data.admin_one[0]}</Text> :
                        data.admin_one.length === 1 ?
                            <Text>{data.admin_one[0]}, {data.country}</Text> :
                        data.admin_one.length > 1 && data.subregion ?
                            <Text>{data.subregion} {data.country}</Text> :
                        data.admin_one.length > 1 ?
                            <Text>{`${data.admin_one[0]} + ${data.admin_one.length - 1} more`}, {data.country}</Text> :
                            <Text>{data.country}</Text>
                    }
                </div>
                { !isSelected ? 
                    <BsArrowRight size={maxWidth600 ? 24 : 32} className={classes.view}/> :
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
                    <Text size='md'>{data.subregion ||'N/A'}</Text>
                    <Label label={data.ccode === 'CA' ? 'Provinces' : 'States'}/>
                    <Text size='md'>{data.admin_one.join(', ')}</Text>
                    { data.admin_two && data.admin_two.length > 0 && <>
                        <Label label='Counties'/>
                        <Text size='md' style={{height: 100, overflowY: 'scroll' }}>{data.admin_two.join(', ')}</Text>
                    </>}
                </div>
            }
        </div>
    )
}

export default AutocompleteWaterbody