import React, { useReducer } from 'react'
import { reducer, initialState } from './reducer'
import { AutocompleteQueryType } from '../../types/Autocomplete'
import classes from './index.module.css'
import Page from '../../components/shared/Page'
import CurrentLocationButton from '../../components/search/CurrentLocationButton/CurrentLocationButton'
import AutocompleteResult from '../../components/search/AutocompleteResult/AutocompleteResult'
import { useAutoComplete } from '../../hooks/queries/useAutoComplete'
import { SegmentedControl, TextInput, Text } from '@mantine/core'


const TestPage = (): JSX.Element => {

    const [state, dispatch] = useReducer(reducer, initialState)

    const { results, isError, isLoading } = useAutoComplete({ 
        input: state.input, 
        coords: state.coords, 
        queryType: state.queryType,
        shouldQuery: state.coordsAreValid || (
            state.coordsAreNull && 
            state.input.length > 0
        )
    })
    
    return (
        <Page className={classes.container}>
            <div className={classes.searchBox}>

                <Text color='#fefefe' size='lg'>Search By Place or Waterbody</Text>
                <TextInput className={classes.searchBar} value={state.input}
                    size='lg' placeholder='Place or Waterbody'
                    wrapperProps={{ style: { width: '34vw' }}} 
                    onChange={e => dispatch({ type: 'INPUT', value: e.target.value })}
                />
                <Text color='rgb(210,210,210)' 
                className={classes.tip} size='sm'
                >Queries should be formatted: Place, State</Text>
                
                <Text color='#fefefe' size='lg'>Toggle Output</Text>
                <SegmentedControl  
                    style={{ width: '34vw', marginTop: '.5em' }} 
                    color="cyan" value={state.queryType} data={[
                    { label: 'Show All', value: 'ALL' },
                    { label: 'Show Geoplaces', value: 'GEOPLACES' },
                    { label: 'Show Waterbodies', value: 'WATERBODIES' }]}  
                    onChange={(value: AutocompleteQueryType) => dispatch({ type: 'QUERYTYPE', value })}
                />

                <Text color='#fefefe' size='lg' style={{ marginTop: '2em'}}>
                    Add Query Location
                </Text>
                <div className={classes.lnglatInputs}>
                    <TextInput className={classes.coordInput}
                        size='md' placeholder='Latitude'
                        value={state.coords.latitude} 
                        onChange={e => dispatch({ type: 'LATITUDE', value: e.target.value })}
                    />
                    <TextInput className={classes.coordInput}
                        size='md' placeholder='Longitude'
                        value={state.coords.longitude} 
                        onChange={e => dispatch({ type: 'LONGITUDE', value: e.target.value})}
                    />
                </div>
                <CurrentLocationButton 
                    onSuccess={coords => dispatch({ type: 'SET_COORDS', value: coords})}
                    onError={() => dispatch({ type: 'LOCATION_ERROR', value: true })}
                    className={classes.currentLocationButton}
                />
            </div>

            <div className={classes.resultsContainer}>
                { state.coordsAreValid || (state.coordsAreNull && state.input.length > 0) && 
                    results.map(x => <AutocompleteResult key={x._id} data={x}/>) 
                }
            </div>
        </Page>
    )
}

export default TestPage;