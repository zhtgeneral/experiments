/**
 * This function returns weekday, day, month, year, time, and timeRegion, of a date
 */
export default function destructureDate(date: Date) {
  const utc = date.toUTCString();
  const parts = utc.split(" ");
  const weekday    = parts[0].slice(0, -1);  // Remove the comma
  const day        = parts[1];
  const month      = parts[2];
  const year       = parts[3];
  const time       = parts[4];
  const timeRegion = parts[5];
  return {
    weekday,
    day,
    month,
    year,
    time,
    timeRegion
  }
}