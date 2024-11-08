import parsePosition from "@/utils/parseLocation";

export default function getLocation(): string {
  var location: string = "";
  const geo = navigator.geolocation;
  geo.getCurrentPosition(
    (position: GeolocationPosition) => {
      location = parsePosition(position);
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
    }
  );
  return location;
}