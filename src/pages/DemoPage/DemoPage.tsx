import React, { useReducer, useEffect, useRef, useState } from 'react'
import { GEOLOCATION_DEFAULT_ERROR } from '../../hooks/contexts/modal/constants'
import { reducer, initialState } from './reducer'
import { AutocompleteQueryType } from '../../types/Autocomplete'
import classes from './index.module.css'
import Page from '../../components/shared/Page'
import CurrentLocationButton from '../../components/search/CurrentLocationButton/CurrentLocationButton'
import { useAutoComplete } from '../../hooks/queries/useAutoComplete'
import { SegmentedControl, TextInput, Text, Loader, Title } from '@mantine/core'
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
import SearchNearLocationCard from '../../components/search/SearchNearLocationCard/SearchNearLocationCard'

const TestPage = (): JSX.Element => {

    const [state, dispatch] = useReducer(reducer, initialState)
    const { dispatch: modalDispatch } = useModalContext()
    
    const resultsContainer = useRef<HTMLDivElement>(null)

    const { data: waterbody, refetch: fetchWaterbody } = useGetWaterbody(state.waterbody_id)
    
    const { 
        data: waterbodyResults, 
        fetchNextPage, 
        isFetchingNextPage,
        totalResults 
    } = useGetWaterbodies({
        coords: state.coords, 
        within: state.within,
        sort: state.sort,
        classifications: state.classifications,
        shouldQuery: state.shouldQueryLocation
    })

    const { 
        results, 
        isError, 
        isLoading,
    } = useAutoComplete({ 
        input: state.input, 
        coords: state.coords, 
        queryType: state.autocompleteType,
        shouldQuery: state.shouldQueryAutocomplete
    })

    const handleScroll = () => {
        const container = resultsContainer.current
        if( container && 
            !isFetchingNextPage && 
            (container.scrollTop / container.scrollHeight) > .75
        ) fetchNextPage() 
    }

    const [inputBoxPosition, setInputBoxPosition] = useState<number | string>(0)

    useEffect(() => {
        if(state.selectedGeoplace || state.queryingNearMe){
            setInputBoxPosition('-100vw')
        }else{
            const delay = setTimeout(() => setInputBoxPosition(0), 200)
            return () => clearTimeout(delay)
        }
    },[state.selectedGeoplace, state.queryingNearMe])


    useEffect(() => { if(state.waterbody_id) fetchWaterbody() }, [state.waterbody_id])

    return (
        <Page className={classes.container}>
            <motion.div 
                className={classes.searchBox} 
                animate={{
                    x: state.showMap ? '-40vw' : 0,
                    transition: { duration: 1, type: 'spring' }
                }}
            >

                <SearchNearLocationCard selectedGeoplace={state.selectedGeoplace} 
                    numberOfResults={totalResults || 0}
                    onClose={() => dispatch({ type: 'CLEAR_LOCATION' })}
                    onChangeRadius={value => dispatch({ type: 'SET_WITHIN', value})}
                    onChangeClassification={values => dispatch({ type: 'SET_CLASSIFICATIONS', values })}
                    onChangeSort={value => dispatch({ type: 'SET_SORT', value})}
                />
                
                <motion.div
                    className={classes.searchBoxInputFields} 
                    animate={{ 
                        x: inputBoxPosition,
                        transition: {
                            duration: .8,
                            type: 'spring'
                        }
                    }}
                >
                    <Text color='#fefefe' size='lg'>Search By Place or Waterbody</Text>
                    <TextInput className={classes.searchBar} value={state.input}
                        size='lg' placeholder='Place or Waterbody'
                        onChange={e => dispatch({ type: 'INPUT_VALUE', value: e.target.value })}
                        icon={<BiSearch/>}
                    />
                    <Text color='rgb(210,210,210)' 
                    className={classes.tip} size='sm'
                    >Queries should be formatted: Place, State/Province</Text>
                    
                    <Text color='#fefefe' size='md'>Toggle Output</Text>
                    <SegmentedControl 
                        className={classes.toggleOutput} 
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
                        within North America
                    </Text>
                </motion.div>
                
                <SearchNearMeButton coords={state.coords} hide={Boolean(state.selectedGeoplace)}
                    isActive={state.queryingNearMe} numberOfResults={totalResults || 0}
                    onSelect={coords => dispatch({ type: 'SELECT_NEAR_ME', coords })} 
                    onClose={() => dispatch({ type: 'CLEAR_LOCATION' })}
                    onChangeRadius={value => dispatch({ type: 'SET_WITHIN', value })} 
                    onChangeClassifications={values => dispatch({ type: 'SET_CLASSIFICATIONS', values })}
                    onChangeSort={value => dispatch({ type: 'SET_SORT', value })}
                />

            </motion.div>



            <motion.div 
                className={classes.resultsContainer} 
                ref={resultsContainer} onScroll={handleScroll}
                animate={{ 
                    x: state.showMap ? '-40vw' : 0,
                    width: state.showMap ? '48vw' : '60vw',
                    transition: { duration: 1, type: 'spring' }
                }}
            >
                { isLoading && <Loader size='md'/>}
                { state.shouldQueryAutocomplete && 
                    results.map(res => (
                        res.type === 'WATERBODY' ? (
                            <AutocompleteWaterbody key={res.id} data={res} 
                                isSelected={state.waterbody_id === res.id}
                                onSelect={() => dispatch({ type: 'SELECT_WATERBODY', id: res.id })}
                                onClose={() => dispatch({ type: 'CLEAR_WATERBODY' })}
                            /> ):
                        (res.type === 'GEOPLACE' && ['PRK', 'RES'].includes(res.fcode)) ? 
                            <AutocompletePark  key={res.id} data={res}
                                onSelect={() => dispatch({ type: 'SELECT_LOCATION', geoplace: res})}
                                onClose={() => dispatch({ type: 'CLEAR_LOCATION'})}
                            /> : 
                        (res.type === 'GEOPLACE' &&
                            <AutocompleteGeoplace  key={res.id} data={res}
                                onSelect={() => dispatch({ type: 'SELECT_LOCATION', geoplace: res})}
                                onClose={() => dispatch({ type: 'CLEAR_LOCATION'})}
                            />
                        )
                    )) 
                }
                { state.shouldQueryLocation && 
                    waterbodyResults?.pages.map(page => 
                        page.data.map(wb => (
                            <AutocompleteWaterbody key={wb.id} data={wb} 
                                isSelected={state.waterbody_id === wb.id}
                                onSelect={() => dispatch({ type: 'SELECT_WATERBODY', id: wb.id })}
                                onClose={() => dispatch({ type: 'CLEAR_WATERBODY' })}
                            />
                        ))
                    )
                }
                {
                    !state.shouldQueryAutocomplete && !state.shouldQueryLocation && 
                    <div className={classes.instructions}>
                        <Title order={2} style={{ color: 'whitesmoke' }}>To demo the in-app search:</Title>
                        <ul className={classes.instructionsList}>
                            <li>
                                Click the <i>Use My Current Location</i> button or manually enter in a pair 
                                of coordinates to simulate device location
                            </li>
                            <li className={classes.subListItem}>
                                If coordinates are omitted, the autocomplete search will not take into account 
                                proximity when providing the user with results
                            </li>
                            <li>Use the search bar to search for:</li>
                            <li className={classes.subListItem}> A waterbody by name</li>
                            <li className={classes.subsubListItem}> Case insensitive, diacritic sensitive</li>
                            <li className={classes.subListItem}>A city, town, place, park, etc.</li>
                            <li className={classes.subsubListItem}>
                                The selected location will be used to query for waterbodies near its coordinates
                            </li>
                            <li>Tips:</li>
                            <li className={classes.subListItem}>
                                Any input can be followed with ", state/province/abbreviation" 
                                to narrow your search within said geographic entity
                            </li>
                            <li className={classes.subListItem}>
                                Typos, mispellings and word order are not accounted for. 
                            </li>
                        </ul>
                    </div>
                }
            </motion.div>

            <motion.div 
                className={classes.mapContainer} 
                animate={{ 
                    x: state.showMap ? '-40vw' : 0,
                    transition: { duration: 1, type: 'spring' }
                }}
            >
                <Map mapId='demo-map'
                    data={waterbodyToFeatureCollection(waterbody)} 
                    dismissMap={() => dispatch({ type: 'CLEAR_WATERBODY' })}
                />
            </motion.div>

        </Page>
    )
}

export default TestPage;