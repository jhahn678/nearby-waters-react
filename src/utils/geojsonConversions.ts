import { Feature, FeatureCollection } from "geojson";
import { LngLatBoundsLike } from "mapbox-gl";
import { PopulatedWaterbody} from "../types/Waterbody";
import bbox from '@turf/bbox'

export const waterbodyToFeatureCollection = (waterbody: PopulatedWaterbody | undefined): FeatureCollection | undefined => {

    if(typeof waterbody === 'undefined'){
        return waterbody
    }

    const features = waterbody.geometries.map<Feature>(x => {
        const { geometry, geometry_simplified, ...properties} = x;
        return {
            type: 'Feature',
            properties,
            geometry
        } 
    })

    return { type: 'FeatureCollection', features }
}


export const waterbodiesToBBox = (waterbodies: PopulatedWaterbody[]): LngLatBoundsLike => {

    let features = [];

    for(let waterbody of waterbodies){
        for(let x of waterbody.geometries){
            const { geometry_simplified } = x;
            features.push({
                type: 'Feature',
                properties: {},
                geometry: geometry_simplified
            })
        }
    }

    const [minLng, minLat, maxLng, maxLat] =  bbox({ type: 'FeatureCollection', features })
    
    return [ [minLng, minLat], [maxLng, maxLat] ]
}

export const waterbodyToBBox = (waterbody: PopulatedWaterbody): LngLatBoundsLike => {

    let features: Feature[] = [];

    for(let geometry of waterbody.geometries){
        features.push({
            type: 'Feature',
            properties: {},
            geometry: geometry.geometry_simplified
        })
    }

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
        for(let x of waterbody.geometries){
            const { geometry, geometry_simplified, ...properties } = x;
            features.push({
                type: 'Feature',
                properties,
                geometry
            })
        }
    }

    return { type: 'FeatureCollection', features }


}