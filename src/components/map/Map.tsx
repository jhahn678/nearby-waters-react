import React, { useState, useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl';
import { v4 as uuid } from 'uuid'
import Geometry from '../../types/Geometry'
import GeometryQuery from '../../types/GeometryQuery'


mapboxgl.accessToken = process.env.REACT_APP_MAPBOX;
type lngLat = { lng: number, lat: number }
type params = { lngLat: lngLat }
type Props = { data: Geometry[], query: GeometryQuery, setCoords: ({ lngLat: lngLat }) => void; }

const Map = ({ data, query, setCoords }: Props) => {

    const [markers, setMarkers] = useState([])
    const [source, setSource] = useState(null)
    const [coordMarker, setCoordMarker] = useState(null)


    const mapRef = useRef(null)
    const mapContainer = useRef(null)

    useEffect(() => {
        if(mapRef.current) return;

        mapRef.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-95.6, 39.8],
            zoom: 3.5
        });

        mapRef.current.on('dblclick', ({ lngLat }) => setCoords(lngLat));

    },[])


    useEffect(() => {
        if(coordMarker) {
            coordMarker.remove()
            setCoordMarker(null)
        }
        if(query.lat && query.lng){
            const marker = new mapboxgl.Marker({
                color: '#2b4162',
                draggable: true
            })
            .setLngLat([query.lng, query.lat])
            .setPopup(new mapboxgl.Popup({ offset: 25}).setText(`${query.lat}, ${query.lng}`))
            .addTo(mapRef.current)
            .togglePopup()
            setCoordMarker(marker)

            marker.on('dragend', () => {
                const lngLat = marker.getLngLat();
                setCoords(lngLat)
            });

            mapRef.current.easeTo({
                center: [query.lng, query.lat],
                zoom: 10,
                speed: 3000
            })
        }
    }, [query.lat, query.lng])



    useEffect(() => {
        if(markers) markers.forEach(m => m.remove())

        if(source) {
            mapRef.current.removeLayer(`${source}-polygon`)
            mapRef.current.removeLayer(`${source}-linestring`)
            mapRef.current.removeSource(source)
            setSource(null)
        }

        if(data){

            mapRef.current.easeTo({
                center: [query.lng, query.lat],
                zoom: 10,
                speed: 3000
            })

            data.map(geom => {
                const marker = new mapboxgl.Marker()
                    .setLngLat(geom.geometry.coordinates)
                    .setPopup(new mapboxgl.Popup({ offset: 25}).setHTML(
                        `<h4>${geom.name}</h4><p><i>classification</i>: ${geom.classification}</p>`
                        ))
                    .addTo(mapRef.current)
                setMarkers(m => [...m, marker])
                return marker;
            })

            const sourceId = uuid()

            mapRef.current.addSource(sourceId, {
                'type': 'geojson',
                data: `http://localhost:3500/geojson?search=${query.search}&lat=${query.lat}&lng=${query.lng}&maxdis=${query.maxdis}`
            }).addLayer({
                'id': `${sourceId}-polygon`, 
                'type': 'fill', 
                'source': sourceId,
                'paint': {
                    'fill-color': '#C724B1',
                    'fill-opacity': 0.8
                },
                'filter': ['==', '$type', 'Polygon']
            }).addLayer({
                'id': `${sourceId}-linestring`, 
                'type': 'line', 
                'source': sourceId,
                'paint': {
                    'line-color': '#C724B1',
                    'line-opacity': 1
                },
                'filter': ['==', '$type', 'LineString']
            })

            setSource(sourceId)
        }
    },[data])

    return (
        <div className='map-container'>
            {data &&
                <div className='map-header'>
                    <h3>{data.length} results</h3>
                </div>              
            }
            <div className='map-helper'>
                <h5>Double click on map to set coordinates</h5>
            </div> 
            <div ref={mapContainer} className='map-container'/>
        </div>
    )
}

export default Map