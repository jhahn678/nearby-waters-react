import { Feature, FeatureCollection } from "geojson";
import { PopulatedWaterbody} from "../types/Waterbody";

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