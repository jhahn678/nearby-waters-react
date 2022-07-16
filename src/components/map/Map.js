import { useState, useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX;

const Map = () => {

    const mapContainer = useRef(null)
    const mapRef = useRef(null)
    const [lat, setLat] = useState(39.8)
    const [lng, setLng] = useState(-95.6)
    const [zoom, setZoom] = useState(4)

    useEffect(() => {
        if(mapRef.current) return;
        mapRef.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });
    },[])


    return (
        <div ref={mapContainer} className='map-container'/>
    )
}

export default Map