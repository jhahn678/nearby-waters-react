import { useReducer} from 'react'
import { reducer, initialState } from './reducer'
import classes from './HomePage.module.css'
import Page from '../../components/shared/Page'
import { BiCurrentLocation } from 'react-icons/bi'
import { Button, TextInput, Select, Text, Loader } from '@mantine/core'
import { useGeolocated } from 'react-geolocated'
import { useGetGeometriesQuery } from '../../hooks/queries/useGetGeometriesQuery.ts'
import Map from '../../components/map/Map.tsx'
import ErrorModal from '../../components/modals/ErrorModal/ErrorModal'
import { LocationErrors } from '../../utils/locationErrors.ts'

const HomePage = () => {

  const [state, dispatch] = useReducer(reducer, initialState)

  const { data, isLoading, isError, refetch: fetchGeometries, remove: clearQuery } = useGetGeometriesQuery({
    lat: state?.latitude.value,
    lng: state?.longitude.value,
    maxdis: state?.distance.value,
    search: state?.search.value
  })

  //data is working

  const { isGeolocationAvailable, isGeolocationEnabled, getPosition } = useGeolocated({
    suppressLocationOnMount: true,
    onSuccess: ({ coords }) => dispatch({ type: 'POSITION_FOUND', coords }),
    onError: () => dispatch({ type: 'LOCATION_ERROR', value: LocationErrors.LocationError })
  })

  
  const handleCurrentLocation = () => {
    if(!isGeolocationEnabled){
      dispatch({ type: 'LOCATION_ERROR', value: LocationErrors.LocationServicesDisabled})
    }else if(!isGeolocationAvailable){
      dispatch({ type: 'LOCATION_ERROR', value: LocationErrors.LocationServicesUnavailable })
    }else{
      dispatch({ type: 'GET_POSITION' })
      getPosition()
    }
  }

  const handleSubmit = () => {
    const { latitude, longitude } = state;
    if(latitude.valid && longitude.valid){
      dispatch({ type: 'HIDE_ERRORS'})
      fetchGeometries()
    }else{
      dispatch({ type: 'SHOW_ERRORS' })
    }
  }

  const handleClear = () => {
    clearQuery()
    dispatch({ type: 'RESET' })
  }


  return (
    <Page className={classes.container}>
      <div className={classes.sidebox}>
        <div className={classes.form}>
            <TextInput label='Filter by name' style={{ marginBottom: '2%'}}
              onInput={e => dispatch({ type: 'SEARCHTERM', value: e.target.value})} 
              value={state?.search.value} labelProps={{ style: { color: 'whitesmoke' }}}
              placeholder='Optional'
            />
            <TextInput label='Latitude' style={{ marginBottom: '2%'}}
              onInput={e => dispatch({ type: 'LAT', value: e.target.value})} 
              value={state?.latitude.value} labelProps={{ style: { color: 'whitesmoke' }}}
              error={state?.form.showErrors && !state?.latitude.valid && 'Invalid latitude'}
            />
            <TextInput label='Longitude'
              value={state?.longitude.value} labelProps={{ style: { color: 'whitesmoke' }}}
              onInput={e => dispatch({ type: 'LON', value: e.target.value})} 
              error={state?.form.showErrors && !state?.longitude.valid && 'Invalid longitude'}
            />
            <Button variant='outline' className={classes.currentLocation} onClick={handleCurrentLocation}>
              <Text weight='500'>Use my current location</Text>
              { isLoading ? 
                <Loader variant="dots" size='sm' color='blue' style={{ marginLeft: 8 }}/> : 
                <BiCurrentLocation size={24}/> 
              }
            </Button>
          <div className={classes.inputgroup}>
            <Select label='Search Radius' data={['10','20','30','40','50']}
              onChange={val => dispatch({ type: 'DISTANCE', value: val })} 
              value={state?.distance.value} labelProps={{ style: { color: 'whitesmoke' }}}
            />
            <Select label='Unit of measure' data={['Miles', 'Kilometers']} 
              onChange={val => dispatch({ type: 'UNIT', value: val })} 
              value={state?.unit.value} style={{ marginLeft: '4%' }}
              labelProps={{ style: { color: 'whitesmoke' }}}
            />
          </div>
            <Button variant='gradient' onClick={handleSubmit}
              fullWidth className={classes.button} 
            >
              <Text>Search</Text>
              { state?.currentLocation.isLoading && (
                <Loader variant="dots" size='sm' color='black' style={{ marginLeft: 8 }}/> 
              )}
            </Button>
            <Button variant='outline'  
              style={{ marginTop: '1em' }} fullWidth
              onClick={handleClear}
            >
              <Text>Clear</Text>
            </Button>

        </div>
      </div>
      <div className={classes.main}>
        <Map data={data}
          setCoords={coords => dispatch({ type: 'COORDS', value: coords })}
          query={{ 
            lat: state?.latitude.value, 
            lng: state?.longitude.value, 
            maxdis: state?.distance.value,
            search: state?.search.value
          }}
        />
      </div>
    </Page>
  )
}

export default HomePage