import React, { useReducer, useEffect, ChangeEvent, MouseEventHandler, KeyboardEventHandler} from 'react'
import classes from './EditPage.module.css'
import Page from '../../components/shared/Page'
import Map from '../../components/map/Map'
import { useAutoCompleteNameQuery } from '../../hooks/queries/useAutoCompleteNameQuery'
import { useMergeWaterbodyMutation } from '../../hooks/mutations/useMergeWaterbodiesMutation'
import { TextInput, Select, Loader } from '@mantine/core'
import { initialState, reducer } from './reducer'
import { useGetWaterbodiesByName } from '../../hooks/queries/useGetWaterbodiesByName'
import { motion } from 'framer-motion'
import { adminOneAsciiMap, adminOneNames } from '../../types/States'
import { BsX } from 'react-icons/bs'
import { genColor } from '../../components/map/colors'
import { v4 as uuid} from 'uuid'
import EditSearchResult from '../../components/edit/EditSearchResult/EditSearchResult'
import ConfirmModal from '../../components/modals/ConfirmModal/ConfirmModal'
import WaterbodyClassificationSelect from '../../components/search/WaterbodyClassificationSelect/WaterbodyClassificationSelect'


const EditPage = (): JSX.Element => {

  const [state, dispatch] = useReducer(reducer, initialState)
  
  const {
     mutate: mergeWaterbody 
  } = useMergeWaterbodyMutation()

  const { 
    data: nameResults
  } = useAutoCompleteNameQuery({
    value: state.input, 
    adminOne: state.adminOne,
    classifications: state.classifications,
    shouldQuery: state.shouldAutocomplete
  })

  const { 
    data: waterbodyResults,
    isLoading: waterbodiesLoading,
    isError: waterbodiesError,
    refetch: waterbodiesRefetch
  } = useGetWaterbodiesByName({ 
    name: state.selectedName,
    adminOne: state.adminOne,
    classifications: state.classifications,
    shouldQuery: Boolean(state.selectedName),
    onSuccess: data => {
      dispatch({ type: 'SET_TOTAL_RESULTS', total: data.length })
    }
  })

  



  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'INPUT_NAME', value: e.target.value })
  }

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
  },[state.adminOne, state.classifications])

  useEffect(() => {
    if(state.resultsIndex !== null && waterbodyResults && waterbodyResults.length > 0){
      dispatch({ 
        type: 'SELECT_WATERBODY', 
        value: waterbodyResults[state.resultsIndex]
      })
    }
  },[state.resultsIndex])
  
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if(e.key === 'ArrowDown'){
        dispatch({ type: 'NEXT_RESULT' })
      }
      if(e.key === 'ArrowUp'){
        dispatch({ type: 'LAST_RESULT' })
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
          label='Waterbody Name'
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
          <Select data={['Any', ...adminOneAsciiMap]} style={{ width: '45%'}}
            labelProps={{ style: { color: '#fff' }}} size='md'
            placeholder='Filter by state' label='State/Province' searchable
            onChange={value => dispatch({ type: 'SELECT_STATE', value })}
          />
          <WaterbodyClassificationSelect MultiSelectProps={{
              size: 'md', style: { width: '45%' },
              label: 'Classifications', labelProps: { style: { color: '#fff' }},
              styles: { defaultVariant: { backgroundColor: 'whitesmoke'}}
            }}
            setClassifications={values => dispatch({ type: 'SET_CLASSIFICATIONS', values })}
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