import { Feature, FeatureCollection, GeometryCollection, Geometry } from "geojson";
import { LngLatBoundsLike } from "mapbox-gl";
import { PopulatedWaterbody} from "../types/Waterbody";
import bbox from '@turf/bbox'

interface IPopulatedWaterbody extends PopulatedWaterbody{
    simplified_geometries: GeometryCollection
}

export const waterbodyToFeatureCollection = (waterbody: PopulatedWaterbody | undefined): FeatureCollection | undefined => {

    if(typeof waterbody === 'undefined'){
        return waterbody
    }

    const { geometries } = waterbody;

    const features: Feature[] = [{
        type: 'Feature',
        properties: {},
        geometry: geometries
    }]

    return { type: 'FeatureCollection', features }
}


export const waterbodiesToBBox = (waterbodies: PopulatedWaterbody[]): LngLatBoundsLike => {

    let features: Feature[] = [];

    for(let waterbody of waterbodies){
        features.push({
            type: 'Feature',
            properties: {},
            geometry: waterbody.geometries
        })
    }

    const [minLng, minLat, maxLng, maxLat] =  bbox({ type: 'FeatureCollection', features })
    
    return [ [minLng, minLat], [maxLng, maxLat] ]
}

export const waterbodyToBBox = (waterbody: PopulatedWaterbody): LngLatBoundsLike => {

    let features: Feature[] = []

    features.push ({
        type: 'Feature',
        properties: {},
        geometry: waterbody.geometries
    })

    const [minLng, minLat, maxLng, maxLat] =  bbox({ type: 'FeatureCollection', features })
    
    return [ [minLng, minLat], [maxLng, maxLat] ]
}




export const waterbodiesToFeatureCollection= (waterbodies: PopulatedWaterbody[]): FeatureCollection | undefined => {

    if(typeof waterbodies === 'undefined'){
        return waterbodies;
    }
    if(waterbodies.length === 0){
        return { type: 'FeatureCollection', features: [] }
    }

    let features: Feature[] = [];

    for(let waterbody of waterbodies){
        features.push({
            type: 'Feature',
            properties: {},
            geometry: waterbody.geometries
        })
    }

    return { type: 'FeatureCollection', features }


}