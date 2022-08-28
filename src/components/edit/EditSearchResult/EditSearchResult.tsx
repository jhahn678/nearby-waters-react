import React, { ChangeEventHandler, Dispatch, MouseEventHandler } from 'react'
import { Action } from '../../../pages/EditPage/reducer'
import classes from './EditSearchResult.module.css'
import { PopulatedWaterbody } from '../../../types/Waterbody'
import { Text, Checkbox, Button } from '@mantine/core'
import { motion } from 'framer-motion'
import { BsTrash } from 'react-icons/bs'
import useModalContext from '../../../hooks/contexts/modal/useModalContext'
import { useAuth } from '../../../hooks/zustand/useAuth'

interface Props {
    data: PopulatedWaterbody
    index: number
    color: string
    isSelectedWaterbody: boolean
    isSelectedParent: boolean
    isSelectedChild: boolean
    parentSelected: boolean
    childrenSelected: boolean
    dispatch: Dispatch<Action>
    onMerge: () => void
}

const EditSearchResult = ({
    data, index, color, isSelectedWaterbody, isSelectedParent, 
    isSelectedChild, parentSelected, childrenSelected, 
    dispatch, onMerge
}: Props): JSX.Element => {

    const { dispatch: modalDispatch } = useModalContext()
    const {isAuthenticated } = useAuth()

    const handleDelete: MouseEventHandler = e => {
        e.stopPropagation()
        modalDispatch({ type: 'SHOW_CONFIRM_DELETE', selectedWaterbody: data.id })
    }

    const handleClick = () => {
        if(!isSelectedWaterbody){
            dispatch({ type: 'SELECT_WATERBODY', value: data, index })
        }
        else if(!isSelectedParent && !isSelectedChild){
            dispatch({ type: 'CLEAR_WATERBODY'}) 
        }
    }

    const handleSelectParent: ChangeEventHandler<HTMLInputElement> = e => {
        e.stopPropagation()
        isSelectedParent ? 
        dispatch({ type: 'REMOVE_PARENT' }) :
        dispatch({ type: 'SELECT_PARENT', value: data.id})
    }

    const handleSelectChild: ChangeEventHandler<HTMLInputElement> = e => {
        e.stopPropagation()
        isSelectedChild ? 
        dispatch({ type: 'REMOVE_CHILD', value: data.id }) :
        dispatch({ type: 'SELECT_CHILD', value: data.id })
    }

    console.log(data)
    return (
        <motion.li 
            className={classes.container} 
            onClick={handleClick} 
            animate={{ scale: isSelectedWaterbody ? 1.05 : 1 }} 
        >
            <div className={classes.color} style={{ backgroundColor: color }}/>
            <div className={classes.details}>
                <Text>{data.name} &bull; {
                    data.total_geometries === 1 ? 
                    '1 geometry' : 
                    `${data.total_geometries} geometries`
                }</Text>
                <Text>
                    { data.admin_one.length === 1 ? 
                        `${data.admin_one}` : 
                        ( 
                            data.ccode === 'CA' ? 
                            `${data.admin_one.length} provinces` : 
                            `${data.admin_one.length} states` 
                        )
                    } &bull; {data.country}
                </Text>
            </div>
            { isAuthenticated &&
                <div className={classes.actions}>
                    { isSelectedWaterbody && !parentSelected &&
                        <BsTrash size={24} onClick={handleDelete}
                            style={{ marginRight: 16, cursor: 'pointer' }} 
                        /> 
                    }
                    { 
                        (isSelectedParent && childrenSelected) ? 
                            <Button size='sm' 
                                style={{ backgroundColor: color }}
                                onClick={onMerge}
                            >
                                Merge Waterbodies
                            </Button> :
                        (isSelectedParent || (isSelectedWaterbody && !parentSelected)) ?
                            <Checkbox label={isSelectedParent ? 'Selected as parent' : 'Select as parent'}
                                styles={{ input: { '&:checked': { backgroundColor: color }} }}
                                checked={isSelectedParent} 
                                onChange={handleSelectParent} 
                            /> :
                        (parentSelected && !isSelectedParent) &&
                            <Checkbox 
                                checked={isSelectedChild} 
                                onChange={handleSelectChild} 
                                label={isSelectedChild ? 'Selected as child' : 'Select as child'}
                            />
                    }
                </div>
            }
        </motion.li>
    )
}

export default EditSearchResult