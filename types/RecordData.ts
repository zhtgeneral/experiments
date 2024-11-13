export type RecordData = {
  experimentId: string,
  variationId: string,
  weekday: string,
  day: string,
  month: string,
  year: string,
  time: string,
  createdAt: Date,
  timeRegion: string,
  browser: string,
  browserVersion: string,
  os: string,
  engine: string,
  platformType: string,
  bandwidth: string
  location: string,
  sessionLength?: number,
  keylog?: string
}