import React, { useReducer, useEffect, useRef, ChangeEvent, MouseEventHandler, KeyboardEventHandler} from 'react'
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
import { useGetDistinctName } from '../../hooks/queries/useGetDistinctName'


const EditPage = (): JSX.Element => {

  const [state, dispatch] = useReducer(reducer, initialState)
  
  const { mutate: mergeWaterbody } = useMergeWaterbodyMutation()

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
    shouldQuery: Boolean(state.selectedName),
    onSuccess: data => {
      dispatch({ type: 'SET_TOTAL_RESULTS', total: data.length })
    }
  })


  const handleInput = (e: ChangeEvent<HTMLInputElement>) => dispatch({ type: 'INPUT_NAME', value: e.target.value })
  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = e => {
    if(e.key === 'Enter') dispatch({ type: 'SELECT_NAME_AS_INPUT' })
  }
  const handleClearInput: MouseEventHandler<SVGElement> = e => {
      e.stopPropagation()
      dispatch({ type: 'CLEAR_NAME' })
  }

  const handleDeleteSuccess = () => {
    waterbodiesRefetch()
    dispatch({ type: 'CLEAR_WATERBODY' })
  }

  const handleMerge = () => {
    const { parentWaterbody, childrenWaterbodies } = state;
    if(parentWaterbody && childrenWaterbodies.length > 0){
      mergeWaterbody({ parentWaterbody, childrenWaterbodies }, {
        onSuccess: () => {
          dispatch({ type: 'MERGE_SUCCESS' })
          waterbodiesRefetch()
        }
      })
    }
  }


  useEffect(() => {
    if(state.selectedName){
      waterbodiesRefetch()
    }
  },[state.state, state.weight])

  useEffect(() => {
    if(state.resultsIndex !== null && waterbodyResults && waterbodyResults.length > 0){
      dispatch({ 
        type: 'SELECT_WATERBODY', 
        value: waterbodyResults[state.resultsIndex]
      })
    }
  },[state.resultsIndex])

  useGetDistinctName({
    index: state.nameIndex,
    state: state.state,
    weight: state.weight,
    onSuccess: res => {
      dispatch({ type: 'SET_DISTINCT_NAME', res })
    }
  })
  
  useEffect(() => {
    
    const handleKey = (e: KeyboardEvent) => {
      if(e.key === 'ArrowRight'){
        dispatch({ type: 'NEXT_NAME' })
      }
      if(e.key === 'ArrowLeft'){
        dispatch({ type: 'LAST_NAME'})
      }
      if(e.key === 'ArrowUp'){
        dispatch({ type: 'LAST_RESULT' })
      }
      if(e.key === 'ArrowDown'){
        dispatch({ type: 'NEXT_RESULT' })
      }
      if(e.key === 'Escape'){
        dispatch({ type: 'CLEAR_NAME' })
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)

  }, [])
  


  return (
    <Page className={classes.container}>
      <ConfirmModal onSuccess={handleDeleteSuccess} />
      <div className={classes.controlSection}>
        <TextInput
          rightSection={<BsX fontSize={24} onClick={handleClearInput}/>}
          label={(state.namePosition && state.nameTotal) 
            ? `Waterbody Name ${state.namePosition}/${state.nameTotal}` 
            : 'Waterbody Name'
          } 
          labelProps={{ style: { color: 'white' }}}
          placeholder="Select Waterbody Name"
          onChange={handleInput} onKeyDown={handleKeyDown}
          value={state.input} size='lg'
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
          <Select data={['Any', ...states]} style={{ width: '45%'}}
            labelProps={{ style: { color: '#fff' }}} size='md'
            placeholder='Filter by state' label='State' searchable
            onChange={value => dispatch({ type: 'SELECT_STATE', value })}
          />
          <Select style={{ width: '45%'}} size='md'
            labelProps={{ style: { color: '#fff' }}}
            placeholder='Filter by weight' label='Weight'
            data={['Any', '1', '1.1', '1.2', '1.3', '1.4']}
            onChange={value => dispatch({ type: 'SELECT_WEIGHT', value })}
          />
        </div>
        <ul className={classes.resultsList}>
          { waterbodiesLoading && <Loader size='lg'/> }
          { !waterbodiesLoading && waterbodyResults && waterbodyResults.map((wb, index) => (
            <EditSearchResult key={wb._id} onMerge={handleMerge} index={index}
              data={wb} color={genColor(index)} dispatch={dispatch}
              isSelectedWaterbody={wb._id === state.selectedWaterbody}
              isSelectedParent={wb._id === state.parentWaterbody} 
              parentSelected={Boolean(state.parentWaterbody)}
              childrenSelected={state.childrenWaterbodies.length > 0}
              isSelectedChild={state.childrenWaterbodies.includes(wb._id)}
            />
          ))}
        </ul>
      </div >
      <div className={classes.mapSection}>
        <Map mapId='edit-map' waterbodies={waterbodyResults} bounds={state.bounds} />
      </div>
    </Page>
  )
}

export default EditPage