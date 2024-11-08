import parsePosition from "@/utils/parseLocation";

export default function getLocation(): Promise<string> {
  return new Promise((resolve, _reject) => {
    var location = "";
    const geo = navigator.geolocation;
    geo.getCurrentPosition(
      (position: GeolocationPosition) => {
        location = parsePosition(position);
        console.log("updated location: " + location);
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
        console.log("error location: " + location);
        resolve(location);
        }
    );
  })
}