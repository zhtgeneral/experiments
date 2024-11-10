import parsePosition from "@/utils/parseLocation";

/**
 * This function prompts the user to yield their precise geolocation.
 * 
 * The geolocation is formatted as "lat,long".
 * 
 * It handles rejected cases correctly.
 */
export default function getLocation(): Promise<string> {
  return new Promise((resolve, _reject) => {
    var location = "";
    const geo = navigator.geolocation;
    geo.getCurrentPosition(
      (position: GeolocationPosition) => {
        location = parsePosition(position);
        resolve(location);
      }, 
      (error: GeolocationPositionError) => {     
        switch(error.code) {
          case error.PERMISSION_DENIED:
            location = "denied"
            break;
          case error.POSITION_UNAVAILABLE:
            location = "unavailable"
            break;
          case error.TIMEOUT:
            location = "timed out"
            break;
          default:
            location = "error";
            break;
          }
        resolve(location);
        }
    );
  })
}