import { FeatureCollection } from 'geojson'
import React, { useEffect, useRef } from 'react'
import { Button } from '@mantine/core'
import { BsArrowLeft } from 'react-icons/bs'
import MapGL, { Source, Layer, MapRef } from 'react-map-gl'
import bbox from '@turf/bbox'


type Props = { 
    data: FeatureCollection | undefined,
    showDismiss?: boolean,
    dismissMap?: () => void
}

const Map = ({ data, showDismiss=false, dismissMap }: Props) => {

    const handleDismiss = () => dismissMap && dismissMap()

    const mapRef = useRef<MapRef>(null)

    useEffect(() => {
        if(mapRef.current && data){
            const [minLng, minLat, maxLng, maxLat] = bbox(data);
            mapRef.current.fitBounds(
                [ [minLng, minLat], [maxLng, maxLat] ],
                {padding: 40, duration: 1000}
            )
        }
    },[data])

    return (
        <MapGL
            id='primary-map' reuseMaps={true} ref={mapRef}
            style={{ flex: 1, position: 'relative', borderRadius: '5px' }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken={process.env.REACT_APP_MAPBOX}
            initialViewState={{ longitude: -98.4, latitude: 37.8, zoom: 2}}
        >
            { data &&
                <Source id="waterbody" type="geojson" data={data}>
                    <Layer type='fill' id='waterbody-polygon' paint={{ "fill-color": '#fc03cf' }} filter={['==', '$type', 'Polygon']}/>
                    <Layer type='line' id='waterbody-line' paint={{ 'line-color': '#fc03cf', "line-width": 1.5 }}/>
                </Source>
            }
            { showDismiss &&
                <Button size='lg' color='lightblue' styles={{ 
                    root: { position: 'absolute', zIndex: 100, borderRadius: 0,
                    left: 0, top: 0, borderBottomRightRadius: 8, height: 64 }}}
                    onClick={handleDismiss}><BsArrowLeft size={32} color='black'/>
                </Button>
            }
        </MapGL>
    )
}

export default Map