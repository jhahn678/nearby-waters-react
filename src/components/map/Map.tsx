import { FeatureCollection } from 'geojson'
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@mantine/core'
import { BsArrowLeft } from 'react-icons/bs'
import MapGL, { Source, Layer, MapRef } from 'react-map-gl'
import bbox from '@turf/bbox'
import { PopulatedWaterbody } from '../../types/Waterbody'
import { waterbodiesToBBox, waterbodyToFeatureCollection } from '../../utils/geojsonConversions'
import { genColor } from './colors'
import { LngLatBoundsLike } from 'react-map-gl'


type Props = { 
    mapId?: string
    data?: FeatureCollection | undefined,
    waterbodies?: PopulatedWaterbody[] | undefined
    showDismiss?: boolean,
    dismissMap?: () => void,
    bounds?: LngLatBoundsLike | null
}

const Map = ({ mapId, data, waterbodies, showDismiss=false, dismissMap, bounds }: Props) => {

    const [boundingBox, setBoundingBox] = useState<LngLatBoundsLike | []>([])

    const handleDismiss = () => dismissMap && dismissMap()

    const mapRef = useRef<MapRef>(null)

    useEffect(() => {
        if(mapRef.current && data){
            const [minLng, minLat, maxLng, maxLat] = bbox(data);
            setBoundingBox([ [minLng, minLat], [maxLng, maxLat] ])
            mapRef.current.fitBounds(
                [ [minLng, minLat], [maxLng, maxLat] ],
                { padding: 40, duration: 1000 }
            )
        }
        if(mapRef.current && waterbodies && waterbodies.length > 0){
            const bounds = waterbodiesToBBox(waterbodies)
            setBoundingBox(bounds)
            mapRef.current.fitBounds(bounds, { padding: 40, duration: 2000 })
        }
        if(mapRef.current && bounds){
            mapRef.current.fitBounds(bounds, { padding: 40, duration: 2000 })
        }
    },[data, waterbodies, bounds])

    return (
        <MapGL ref={mapRef} reuseMaps={true} id={mapId || 'primary-map'}
            style={{ flex: 1, position: 'relative', borderRadius: '5px' }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken={process.env.REACT_APP_MAPBOX}
            initialViewState={{ longitude: -98.4, latitude: 37.8, zoom: 2}}
        >
            { data &&
                <Source id="waterbody" type="geojson" data={data}>
                    <Layer type='fill' id='waterbody-polygon' 
                        paint={{ "fill-color": '#fc03cf' }} 
                        filter={['==', '$type', 'Polygon']}
                    />
                    <Layer type='line' id='waterbody-line' 
                        paint={{ 'line-color': '#fc03cf', "line-width": 2 }}
                    />
                </Source>
            }
            { showDismiss &&
                <Button size='lg' color='lightblue' styles={{ 
                    root: { position: 'absolute', zIndex: 100, borderRadius: 0,
                    left: 0, top: 0, borderBottomRightRadius: 8, height: 64 }}}
                    onClick={handleDismiss}><BsArrowLeft size={32} color='black'/>
                </Button>
            }
            { waterbodies && waterbodies.map((x, index) => (
                <Source key={x.id} id={x.id.toString()} type="geojson" data={waterbodyToFeatureCollection(x)}>
                    <Layer type='fill' id={`${x.id}-polygon`} 
                        paint={{ "fill-color": genColor(index) }} 
                        filter={['==', '$type', 'Polygon']}
                    />
                    <Layer type='line' id={`${x.id}-line`} 
                        paint={{ 'line-color': genColor(index), "line-width": 3 }}
                    />
                </Source>
            ))}
        </MapGL>
    )
}

export default Map