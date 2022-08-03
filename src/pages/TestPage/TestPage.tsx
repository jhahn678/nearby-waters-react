import React, { useReducer, useRef, useEffect, useState } from 'react'
import { GEOLOCATION_DEFAULT_ERROR } from '../../hooks/contexts/modal/constants'
import { reducer, initialState } from './reducer'
import { AutocompleteQueryType } from '../../types/Autocomplete'
import classes from './index.module.css'
import Page from '../../components/shared/Page'
import CurrentLocationButton from '../../components/search/CurrentLocationButton/CurrentLocationButton'
import { useAutoComplete } from '../../hooks/queries/useAutoComplete'
import { SegmentedControl, TextInput, Text, Button } from '@mantine/core'
import { BiSearch } from 'react-icons/bi'
import AutocompleteWaterbody from '../../components/search/AutocompleteResult/AutocompleteWaterbody'
import AutocompletePark from '../../components/search/AutocompleteResult/AutocompletePark'
import AutocompleteGeoplace from '../../components/search/AutocompleteResult/AutocompleteGeoplace'
import useModalContext from '../../hooks/contexts/modal/useModalContext'
import Map from '../../components/map/Map'


const TestPage = (): JSX.Element => {

    const [state, dispatch] = useReducer(reducer, initialState)
    const { dispatch: modalDispatch } = useModalContext()

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
            <div className={`${classes.searchBox} ${state.showMap && classes.hideSearchBox}`}>
                <Text color='#fefefe' size='lg'>Search By Place or Waterbody</Text>
                <TextInput className={classes.searchBar} value={state.input}
                    size='lg' placeholder='Place or Waterbody'
                    wrapperProps={{ style: { width: '34vw' }}} 
                    onChange={e => dispatch({ type: 'INPUT', value: e.target.value })}
                    icon={<BiSearch/>}
                />
                <Text color='rgb(210,210,210)' 
                className={classes.tip} size='sm'
                >Queries should be formatted: Place, State</Text>
                
                <Text color='#fefefe' size='md'>Toggle Output</Text>
                <SegmentedControl  
                    style={{ width: '34vw', marginTop: '.5em' }} 
                    color="cyan" value={state.queryType} data={[
                    { label: 'All', value: 'ALL' },
                    { label: 'Locations', value: 'GEOPLACES' },
                    { label: 'Waterbodies', value: 'WATERBODIES' }]}  
                    onChange={(value: AutocompleteQueryType) => dispatch({ type: 'QUERYTYPE', value })}
                />

                <Text color='#fefefe' size='md' style={{ marginTop: '1.5em'}}>
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
                    onError={() => modalDispatch({ type: 'SHOW_ERROR_MODAL', body: GEOLOCATION_DEFAULT_ERROR })}
                    className={classes.currentLocationButton}
                />

                <Text color='#fefefe' size='md' style={{ marginTop: '2em'}}>
                    The above is a demonstration of the in-app autocomplete search bar.
                    Set a location to simulate location based results within the United States
                </Text>
            </div>

            <div className={`${classes.resultsContainer} ${state.showMap && classes.shiftResultsContainer}`}>
                { (state.coordsAreValid || (state.coordsAreNull && state.input.length > 0)) && 
                    results.map(res => (
                        res.type === 'WATERBODY' ? 
                            <AutocompleteWaterbody key={res._id} data={res} 
                                isSelected={state.waterbody_id === res._id}
                                onClick={() => dispatch({ type: 'SHOW_WATERBODY', _id: res._id })}
                                onClose={() => dispatch({ type: 'HIDE_MAP' })}
                            /> :
                        (res.type === 'GEOPLACE' && res.fcode === 'PRK') ? 
                            <AutocompletePark  key={res._id} data={res}/> : 
                            <AutocompleteGeoplace  key={res._id} data={res}/>
                    )) 
                }
            </div>

            <div className={`${classes.mapContainer} ${state.showMap && classes.showMapContainer}`}>
                <Map/>
            </div>
        </Page>
    )
}

export default TestPage;