import React, { useState, useEffect, useRef } from 'react'
import classes from './Map.module.css'
import mapboxgl, { MapMouseEvent } from 'mapbox-gl';
import MapGL, { Source, Layer } from 'react-map-gl'
import { v4 as uuid } from 'uuid'
import Geometry from '../../types/Geometry'
import GeometryQuery from '../../types/GeometryQuery'


mapboxgl.accessToken = process.env.REACT_APP_MAPBOX;
type Props = { 
    data: Geometry[], 
    query: GeometryQuery, 
    setCoords: ({ lngLat }: MapMouseEvent) => void
}

const Map = ({ data, query, setCoords }: Props) => {

    return (
        <MapGL
            
            id='primary-map'
            style={{ height: '100%', width: '100%', position: 'relative', borderRadius: '5px' }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        />
    )
}

export default Map