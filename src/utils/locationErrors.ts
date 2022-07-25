import LocationError from "../types/LocationError";

export const LocationErrors: LocationError = {
    LocationServicesDisabled: 'It looks like you have location services disabled on your browser. In order to use your current location, you will have to enable that!',
    LocationServicesUnavailable: "Unfortunately, your browser doesn't support location. You will have to manually enter a pair of coordinates instead.",
    LocationInvalid: "The location you provided was invalid. Please double check and make sure you've entered a valid set of coordinates.",
    LocationError: "There was a problem getting your location.."
}
