import React, { useState, useEffect, useRef } from 'react'
import classes from './Map.module.css'
import MapGL, { Source, Layer, MapLayerMouseEvent } from 'react-map-gl'
import Waterbody from '../../types/Waterbody'




type Props = { 
    data: Waterbody
}

const Map = ({ data }: Props) => {

    

    return (
        <MapGL
            id='primary-map' reuseMaps={true}
            style={{ height: '100%', width: '100%', position: 'relative', borderRadius: '5px' }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        >
            <Source id="my-data" type="geojson" data={geojson}>
                <Layer {...layerStyle} />
            </Source>
        </MapGL>
    )
}

export default Map