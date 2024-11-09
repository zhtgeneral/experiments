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
    // console.log("all attributes: " + JSON.stringify(growthbook.getAttributes(), null, 2));
    console.log("output record: " + JSON.stringify(record, null, 2));
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
    const attributes = growthbook.getAttributes();
    const recordId = attributes.recordId;
    const response = await axios.put(`/api/record/${recordId}`, data);
    console.log("updated record: " + JSON.stringify(response.data, null, 2));
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