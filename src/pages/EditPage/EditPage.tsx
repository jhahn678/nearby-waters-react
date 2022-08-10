import React, { useReducer, useEffect, ChangeEvent, MouseEventHandler} from 'react'
import classes from './EditPage.module.css'
import Page from '../../components/shared/Page'
import Map from '../../components/map/Map'
import { useAuth } from '../../hooks/zustand/useAuth'
import { useAutoCompleteNameQuery } from '../../hooks/queries/useAutoCompleteNameQuery'
import { useMergeWaterbodyMutation } from '../../hooks/mutations/useMergeWaterbodiesMutation'
import { TextInput, Select, Loader } from '@mantine/core'
import { initialState, reducer } from './reducer'
import { useGetWaterbodiesByName } from '../../hooks/queries/useGetWaterbodiesByName'
import { motion } from 'framer-motion'
import { states } from '../../types/States'
import { BsX } from 'react-icons/bs'
import { genColor } from '../../components/map/colors'
import { v4 as uuid} from 'uuid'
import EditSearchResult from '../../components/edit/EditSearchResult/EditSearchResult'
import { useNavigate } from 'react-router-dom'
import ConfirmModal from '../../components/modals/ConfirmModal/ConfirmModal'


const EditPage = (): JSX.Element => {

  const [state, dispatch] = useReducer(reducer, initialState)
  
  const { isAuthenticated } = useAuth()
  const mergeWaterbody = useMergeWaterbodyMutation()
  const navigate = useNavigate()

  const { 
    data: nameResults
  } = useAutoCompleteNameQuery({
    value: state.input, 
    shouldQuery: state.shouldAutocomplete
  })

  const { 
    data: waterbodyResults,
    isLoading: waterbodiesLoading,
    isError: waterbodiesError,
    refetch: waterbodiesRefetch
  } = useGetWaterbodiesByName({ 
    name: state.selectedName,
    state: state.state,
    weight: state.weight,
    shouldQuery: Boolean(state.selectedName)
  })

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => dispatch({ type: 'INPUT_NAME', value: e.target.value })
  const handleClearInput: MouseEventHandler<SVGElement> = e => {
      e.stopPropagation()
      dispatch({ type: 'CLEAR_NAME' })
  }

  const handleDeleteSuccess = () => {
    waterbodiesRefetch()
    dispatch({ type: 'CLEAR_WATERBODY' })
  }
  
  useEffect(() => {
    if(!isAuthenticated){
      navigate('/login', { replace: true })
    }
  }, [])
  


  return (
    <Page className={classes.container}>
      <ConfirmModal onSuccess={handleDeleteSuccess} />
      <div className={classes.controlSection}>
        <TextInput
          rightSection={<BsX fontSize={24} onClick={handleClearInput}/>}
          label='Waterbody Name' size='lg'
          labelProps={{ style: { color: 'white' }}}
          placeholder="Select Waterbody Name"
          onChange={handleInput}
          value={state.input}
        />
        { nameResults &&
          <motion.div className={classes.autocompleteContainer}
           animate={{ height: state.selectedName ? 0 : '150px' }}
          >
            <ul className={classes.autocompleteList}>
              { nameResults.map(x => 
                <li key={uuid()} 
                  className={classes.autocompleteItem}
                  onClick={() => dispatch({ type: 'SELECT_NAME', value: x })}
                >{x}</li>
              )}
            </ul>
          </motion.div>
        }
        <div className={classes.flexrow}>
          <Select data={states} style={{ width: '45%'}}
            labelProps={{ style: { color: '#fff' }}} size='md'
            placeholder='Filter by state' label='State'
            onChange={value => dispatch({ type: 'SELECT_STATE', value })}
          />
          <Select style={{ width: '45%'}} size='md'
            labelProps={{ style: { color: '#fff' }}}
            placeholder='Filter by weight' label='Weight'
            data={['1', '1.1', '1.2', '1.3', '1.4']}
            onChange={value => dispatch({ type: 'SELECT_WEIGHT', value })}
          />
        </div>
        <ul className={classes.resultsList}>
          { waterbodiesLoading && <Loader size='lg'/> }
          { !waterbodiesLoading && waterbodyResults && waterbodyResults.map((wb, index) => (
            <EditSearchResult key={wb._id} data={wb} color={genColor(index)} 
              isSelectedWaterbody={wb._id === state.selectedWaterbody}
              isSelectedParent={wb._id === state.parentWaterbody} 
              parentSelected={Boolean(state.parentWaterbody)}
              childrenSelected={state.childrenWaterbodies.length > 0}
              isSelectedChild={state.childrenWaterbodies.includes(wb._id)}
              onMutation={() => waterbodiesRefetch()} dispatch={dispatch}
            />
          ))}
        </ul>
      </div >
      <div className={classes.mapSection}>
        <Map waterbodies={waterbodyResults} bounds={state.bounds} />
      </div>
    </Page>
  )
}

export default EditPage