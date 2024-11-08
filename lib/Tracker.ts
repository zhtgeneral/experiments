import axios from "axios";
import { RecordData } from "@/types/RecordData";
import { Record } from "@prisma/client"
import getLocation from "../utils/getLocation";
import Bowser from "bowser";
import getWindowInfo from "../utils/getWindowInfo";
import destructureDate from "../utils/destructureDate";
import growthbook from "./growthbook";

export default class Tracker {
  /**
   * This function creates a record of the current tracking session.
   * It keeps track of the `recordId` and `pageLoadTime` in `growthbook` so sessionLength can be set later.
   */
  public static async createRecord(experimentKey: string, resultKey: string): Promise<Record | null> {
    const data: RecordData = Tracker.formatData(experimentKey, resultKey);
    const record = await axios.post('/api/record', data);
    growthbook.setAttributes({
      recordId: record?.data.id,
      pageLoadTime: Date.now()
    });      
    console.log("output record: " + JSON.stringify(record.data, null , 2));
    return record.data as unknown as Record;
  }

  /**
   * Fills in the session length for a tracking record
   * @requires TrackingRecord of the user has to be in the database
   * @param recordId The id of the record stored on `growthbook` attributes
   * @param sessionLength The session length from `growthbook` attributes
   */
  public static async trackSessionLength(recordId: string, sessionLength: number) {    
    const data = {
      sessionLength: sessionLength.toString()
    } 
    await axios.put(`/api/record/${recordId}`, data);
  }
  private static formatData(experimentKey: string, resultKey: string): RecordData {
    const date = new Date();
    const destructuredDate = destructureDate(date);

    const location = getLocation();

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