import React, { useReducer, useEffect, useState, useRef, DragEventHandler } from 'react'
import { GEOLOCATION_DEFAULT_ERROR } from '../../hooks/contexts/modal/constants'
import { reducer, initialState } from './reducer'
import { AutocompleteQueryType } from '../../types/Autocomplete'
import classes from './index.module.css'
import Page from '../../components/shared/Page'
import CurrentLocationButton from '../../components/search/CurrentLocationButton/CurrentLocationButton'
import { useAutoComplete } from '../../hooks/queries/useAutoComplete'
import { SegmentedControl, TextInput, Text } from '@mantine/core'
import { BiSearch } from 'react-icons/bi'
import AutocompleteWaterbody from '../../components/search/AutocompleteResult/AutocompleteWaterbody'
import AutocompletePark from '../../components/search/AutocompleteResult/AutocompletePark'
import AutocompleteGeoplace from '../../components/search/AutocompleteResult/AutocompleteGeoplace'
import useModalContext from '../../hooks/contexts/modal/useModalContext'
import Map from '../../components/map/Map'
import { useGetWaterbody } from '../../hooks/queries/useGetWaterbody'
import { waterbodyToFeatureCollection } from '../../utils/geojsonConversions'
import { useGetWaterbodies } from '../../hooks/queries/useGetWaterbodies'
import SearchNearMeButton from '../../components/search/SearchNearMeButton/SearchNearMeButton'
import { motion } from 'framer-motion'


const TestPage = (): JSX.Element => {

    const [state, dispatch] = useReducer(reducer, initialState)
    const { dispatch: modalDispatch } = useModalContext()

    const [within, setWithin] = useState(50)
    const resultsContainer = useRef<HTMLDivElement>(null)

    const { data: waterbody, refetch: fetchWaterbody } = useGetWaterbody(state.waterbody_id)
    const { 
        data: waterbodyResults, 
        fetchNextPage, 
        isFetchingNextPage,
        totalResults 
    } = useGetWaterbodies({
        coords: state.coords, within,
        shouldQuery: state.shouldQueryLocation
    })
    const { results, isError, isLoading } = useAutoComplete({ 
        input: state.input, coords: state.coords, 
        queryType: state.autocompleteType,
        shouldQuery: state.shouldQueryAutocomplete
    })

    const handleScroll = (event: React.UIEvent<HTMLElement>) => {
        const container = resultsContainer.current
        if(
            container && 
            !isFetchingNextPage && 
            (container.scrollTop / container.scrollHeight) > .75
        ){
            fetchNextPage()
        }
    }

    useEffect(() => {
        console.log(waterbodyResults)
    },[waterbodyResults])


    useEffect(() => { if(state.waterbody_id) fetchWaterbody() }, [state.waterbody_id])

    return (
        <Page className={classes.container}>
            <div className={`${classes.searchBox} ${state.showMap && classes.hideSearchBox}`}>
                <motion.div transition={{ duration: .8, type: 'spring'}}
                    className={classes.searchBoxInputFields} 
                    animate={{ x: state.shouldQueryLocation ? '-100vw' : '0vw' }}
                >
                    <Text color='#fefefe' size='lg'>Search By Place or Waterbody</Text>
                    <TextInput className={classes.searchBar} value={state.input}
                        size='lg' placeholder='Place or Waterbody'
                        wrapperProps={{ style: { width: '34vw' }}} 
                        onChange={e => dispatch({ type: 'INPUT_VALUE', value: e.target.value })}
                        icon={<BiSearch/>}
                    />
                    <Text color='rgb(210,210,210)' 
                    className={classes.tip} size='sm'
                    >Queries should be formatted: Place, State</Text>
                    
                    <Text color='#fefefe' size='md'>Toggle Output</Text>
                    <SegmentedControl  
                        style={{ width: '34vw', marginTop: '.5em' }}
                        color="grayblue" value={state.autocompleteType} data={[
                        { label: 'All', value: 'ALL' },
                        { label: 'Locations', value: 'GEOPLACES' },
                        { label: 'Waterbodies', value: 'WATERBODIES' }]}  
                        classNames={{ labelActive: classes.label }}
                        onChange={(value: AutocompleteQueryType) => dispatch({ type: 'SELECT_QUERYTYPE', value })}
                    />

                    <Text color='#fefefe' size='md' style={{ marginTop: '1.5em'}}>
                        Add Query Location
                    </Text>
                    <div className={classes.lnglatInputs}>
                        <TextInput className={classes.coordInput}
                            size='md' placeholder='Latitude'
                            value={state.coords.latitude} 
                            onChange={e => dispatch({ type: 'INPUT_LATITUDE', value: e.target.value })}
                        />
                        <TextInput className={classes.coordInput}
                            size='md' placeholder='Longitude'
                            value={state.coords.longitude} 
                            onChange={e => dispatch({ type: 'INPUT_LONGITUDE', value: e.target.value})}
                        />
                    </div>
                    <CurrentLocationButton 
                        onSuccess={coords => dispatch({ type: 'SET_CURRENT_LOCATION', value: coords})}
                        onError={() => modalDispatch({ type: 'SHOW_ERROR_MODAL', body: GEOLOCATION_DEFAULT_ERROR })}
                        className={classes.currentLocationButton}
                    />

                    <Text color='#fefefe' size='sm' style={{ marginTop: '1em', marginBottom: '2em'}}>
                        The above is a demonstration of the in-app autocomplete search bar.
                        Set your coordinates to simulate location-based autocomplete results 
                        within the United States
                    </Text>
                </motion.div>
                
                <SearchNearMeButton coords={state.coords}
                    isActive={state.queryingNearMe} numberOfResults={totalResults || 0}
                    onSelect={coords => dispatch({ type: 'SELECT_NEAR_ME', coords })} 
                    onClose={() => dispatch({ type: 'CLEAR_LOCATION' })}
                />
            </div>

            <div className={`${classes.resultsContainer} ${state.showMap && classes.shiftResultsContainer}`} ref={resultsContainer} onScroll={handleScroll}>
                { state.shouldQueryAutocomplete && 
                    results.map(res => (
                        res.type === 'WATERBODY' ? (
                            <AutocompleteWaterbody key={res._id} data={res} 
                                isSelected={state.waterbody_id === res._id}
                                onSelect={() => dispatch({ type: 'SELECT_WATERBODY', _id: res._id })}
                                onClose={() => dispatch({ type: 'CLEAR_WATERBODY' })}
                            /> ):
                        (res.type === 'GEOPLACE' && res.fcode === 'PRK') ? 
                            <AutocompletePark  key={res._id} data={res}
                                onSelect={() => dispatch({ type: 'SELECT_LOCATION', geoplace: res})}
                                onClose={() => dispatch({ type: 'CLEAR_LOCATION'})}
                            /> : 
                        (res.type === 'GEOPLACE' &&
                            <AutocompleteGeoplace  key={res._id} data={res}
                                onSelect={() => dispatch({ type: 'SELECT_LOCATION', geoplace: res})}
                                onClose={() => dispatch({ type: 'CLEAR_LOCATION'})}
                            />
                        )
                    )) 
                }
                { state.shouldQueryLocation && 
                    waterbodyResults?.pages.map(page => 
                        page.data.map(wb => (
                            <AutocompleteWaterbody key={wb._id} data={wb} 
                                isSelected={state.waterbody_id === wb._id}
                                onSelect={() => dispatch({ type: 'SELECT_WATERBODY', _id: wb._id })}
                                onClose={() => dispatch({ type: 'CLEAR_WATERBODY' })}
                            />
                        ))
                    )
                }
            </div>

            <div className={`${classes.mapContainer} ${state.showMap && classes.showMapContainer}`}>
                <Map 
                    data={waterbodyToFeatureCollection(waterbody)} 
                    dismissMap={() => dispatch({ type: 'CLEAR_WATERBODY' })}
                />
            </div>

        </Page>
    )
}

export default TestPage;