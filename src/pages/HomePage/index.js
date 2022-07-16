import { useState, useReducer, useEffect } from 'react'
import { reducer, initialState } from './reducer'
import classes from './HomePage.module.css'
import Page from '../../components/shared/Page'
import { BiCurrentLocation } from 'react-icons/bi'
import { Button, TextInput, Select, Text, Modal, Loader } from '@mantine/core'
import { milesToKM } from '../../utils/milesToKM.ts'
import { useGeolocated } from 'react-geolocated'
import { useGetGeometriesQuery } from '../../hooks/queries/useGetGeometriesQuery.ts'
import Map from '../../components/map/Map'

const HomePage = () => {

  const [state, dispatch] = useReducer(reducer, initialState)
  const [showErrors, setShowErrors] = useState(false)
  const [positionLoading, setPositionLoading] = useState(false)
  const [locationErrorModalOpen , setLocationErrorModalOpen] = useState(false)

  const { data, isLoading, isError, refetch: fetchGeometries } = useGetGeometriesQuery({
    lat: state?.latitude.value,
    lon: state?.longitude.value,
    maxdis: state?.distance.value,
  })

  //data is working

  const { isGeolocationAvailable, isGeolocationEnabled, getPosition } = useGeolocated({
    suppressLocationOnMount: true,
    onSuccess: ({ coords }) => {
      dispatch({ type: 'COORDS', coords })
      setPositionLoading(false)
    },
    onError: () => setLocationErrorModalOpen(true),
  })

  
  const handleCurrentLocation = () => {
    if(!isGeolocationEnabled || !isGeolocationAvailable){
      setLocationErrorModalOpen(true)
    }else{
      setPositionLoading(true)
      getPosition()
    }
  }

  const handleSubmit = () => {
    const { latitude, longitude, distance, unit } = state;
    if(latitude.valid && longitude.valid && distance.valid){
      setShowErrors(false)
      fetchGeometries()
    }else{
      setShowErrors(true)
    }
  }


  return (
    <Page className={classes.container}>
      <div className={classes.sidebox}>
        <div className={classes.form}>
            <TextInput label='Latitude' style={{ marginBottom: '2%'}}
              onInput={e => dispatch({ type: 'LAT', value: e.target.value})} 
              value={state?.latitude.value} labelProps={{ style: { color: 'whitesmoke' }}}
              error={showErrors && !state?.latitude.valid && 'Invalid latitude'}
            />
            <TextInput label='Longitude'
              value={state?.longitude.value} labelProps={{ style: { color: 'whitesmoke' }}}
              onInput={e => dispatch({ type: 'LON', value: e.target.value})} 
              error={showErrors && !state?.longitude.valid && 'Invalid longitude'}
            />
            <Button variant='outline' className={classes.currentLocation} onClick={handleCurrentLocation}>
              <Text weight='500'>Use my current location</Text>
              { positionLoading ? <Loader variant="dots" size='sm' color='blue' style={{ marginLeft: 8 }}/> : <BiCurrentLocation size={24}/> }
            </Button>
          <div className={classes.inputgroup}>
            <TextInput value={state?.unit.value === 'Kilometers' ? milesToKM(state?.distance.value) : state?.distance.value}
              onInput={e => dispatch({ type: 'DISTANCE', value: e.target.value })} 
              label='Search Radius' labelProps={{ style: { color: 'whitesmoke' }}}
              error={(showErrors && !state?.distance.valid) && 'Invalid distance'}
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
              { isLoading && <Loader variant="dots" size='sm' color='black' style={{ marginLeft: 8 }}/> }
            </Button>
        </div>
      </div>
      <div className={classes.main}>
        <Map/>
      </div>
    </Page>
  )
}

export default HomePage