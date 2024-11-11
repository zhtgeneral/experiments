import axios from "axios";
import { RecordData } from "@/types/RecordData";
import { Record } from "@prisma/client"
import getLocation from "../utils/getLocation";
import Bowser from "bowser";
import getWindowInfo from "@/utils/getWindowInfo";
import destructureDate from "@/utils/destructureDate";
import growthbook from "@/lib/growthbook";

export default class Tracker {
  /**
   * This function creates a record of the current tracking session.
   * It keeps track of the `recordId` and `pageLoadTime` in `growthbook` so sessionLength can be set later.
   * @param recordId The id of the record stored on `growthbook` attributes
   * @param sessionLength The session length from `growthbook` attributes
   */
  public static async createRecord(experimentKey: string, resultKey: string): Promise<Record | null> {
    const data: RecordData = await Tracker.formatData(experimentKey, resultKey);
    const response = await axios.post('/api/record', data);
    const record = response.data;
    const existingAttributes = growthbook.getAttributes();
    growthbook.setAttributes({
      ...existingAttributes,
      recordId: record.id,
      pageLoadTime: Date.now()
    });      
    return record.data as unknown as Record;
  }
  /**
   * Fills in the session length for a tracking record
   * @requires TrackingRecord of the user has to be in the database
   * @param recordId The id of the record stored on `growthbook` attributes
   * @param sessionLength The session length from `growthbook` attributes
   */
  public static async trackSessionLength(sessionLength: number) {   
    const data = {
      sessionLength: sessionLength.toString()
    } 
    /** Sending Beacons do not work if trackers are blocked (for example uBlock origin on desktops) */
    if (navigator.sendBeacon) {
      const attributes = growthbook.getAttributes();
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const sent = navigator.sendBeacon(`/api/record/${attributes.recordId}`, blob);
      console.log("navigator send beacon was sent: " + sent);
    } 
  }
  /**
   * This function formats the data needed for a log.
   * 
   * It gets the date in a formatted way.
   * 
   * It gets the geolocation from the user.
   * 
   * It gets the os and system metadata.
   * @param experimentKey The experiment key from growthbook
   * @param resultKey The result key from growthbook   
   */
  private static async formatData(experimentKey: string, resultKey: string): Promise<RecordData> {
    const date = new Date();
    const destructuredDate = destructureDate(date);

    const location = await getLocation();

    const parser = Bowser.getParser(window.navigator.userAgent);
    const windowInfo = getWindowInfo(parser);

    const data: RecordData = {
      experimentId: experimentKey,
      variationId: resultKey,
      weekday: destructuredDate.weekday,
      day: destructuredDate.day,
      month: destructuredDate.month,
      year: destructuredDate.year,
      time: destructuredDate.time,
      createdAt: date,
      timeRegion: destructuredDate.timeRegion,
      browser: windowInfo.browser,
      browserVersion: windowInfo.browserVersion,
      os: windowInfo.os,
      engine: windowInfo.engine,
      platformType: windowInfo.platformType,
      location: location,
      sessionLength: null
    }
    return data;
  }
}