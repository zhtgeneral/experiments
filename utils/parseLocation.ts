/**
 * This function returns the latitude and longitude seperated by comma 
 * @param location The geolocation requested to the user
 * @example "123.456,987.654"
 */
export default function parsePosition(position: GeolocationPosition): string {
  const coordinates = position.coords;
  const parsedLocation = coordinates.latitude + "," + coordinates.longitude;
  return parsedLocation;
}