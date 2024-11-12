import axios from "axios";
import Bowser from "bowser";
import { Record } from "@prisma/client"
import growthbook from "@/lib/growthbook";
import { RecordData } from "@/types/RecordData";
import getLocation from "@/utils/getLocation";
import getWindowInfo from "@/utils/getWindowInfo";
import destructureDate from "@/utils/destructureDate";
import addAttribute from "@/utils/addAttribute";
import formatDigits from "@/utils/formatDigits";

export default class Tracker {
  /**
   * This function enables tracking.
   * 
   * When the user leaves the page, it updates the total session length.
   * 
   * When the user returns to the page, it updates the time last visited.
   * 
   * When the user closes the pages, it stores the total session length into database.
   */
  public static enableTracking() {
    window.addEventListener('beforeunload', async () => {
      await Tracker.trackSessionLength();
      Tracker.handleCleanup();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        Tracker.handlePageLeave();
      } else {
        Tracker.handlePageReturn();
      }
    });
  }
  /**
   * This function creates a record of the current tracking session.
   * 
   * It keeps track of the `recordId`, `lastVisited`, and `sessionLength` 
   * in `growthbook` so sessionLength can be set later.
   * 
   * @param recordId The id of the record stored on `growthbook` attributes
   * @param sessionLength The session length from `growthbook` attributes
   */
  public static async createRecord(experimentKey: string, resultKey: string): Promise<Record | null> {  
    const timeCreated = Date.now();  
    const data: RecordData = Tracker.formatData(experimentKey, resultKey);
    const response = await axios.post('/api/record', data);
    const record = response.data;
    addAttribute({
      recordId: record.id,
      lastVisited: timeCreated,
      sessionLength: 0
    })
    return record as Record;
  }
  /**
   * This function uploads the total session length into database.
   * @requires TrackingRecord of the user has to be in the database
   * @requires growthbook needs `sessionLength` and `lastVisited` attribute
   */
  private static async trackSessionLength() {   
    /** Sending Beacons do not work if trackers are blocked (for example uBlock origin on desktops) */
    if (navigator.sendBeacon) {
      const attributes = growthbook.getAttributes();
      /** blob | string is the only accepted type by sendBeacon */
      const data = JSON.stringify({ sessionLength: attributes.sessionLength });
      const blob = new Blob([data], { type: 'application/json' });
      navigator.sendBeacon(`/api/record/${attributes.recordId}`, blob);
    } 
  }
  /**
   * This function updates the total session length in growthbook
   */
  private static handlePageLeave() {
    addAttribute({
      sessionLength: Tracker.getNewSessionTime()
    })
  }
  /**
   * This function updates the time last visited in growthbook
   */
  private static handlePageReturn() {
    addAttribute({ 
      lastVisited: Date.now() 
    })
  }

  /**
   * This function gets the new session time using the saved session time from growthbook
   * plus the new session length.
   * @requires lastVisited needs to exist on growthbook attributes
   * @requires sessionLength needs to exist on growthbook attributes
   */
  private static getNewSessionTime(): number {
    const attributes = growthbook.getAttributes();
    const newSessionLength = Tracker.getSessionLength(attributes.lastVisited);
    return formatDigits(attributes.sessionLength +  newSessionLength);
  }
  /**
   * This helper function gets the sesion length using the time the page was loaded
   */
  public static getSessionLength(startingTime: number): number {
    const sessionLength = (Date.now() - startingTime) / 1000;
    return sessionLength;
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
  private static formatData(experimentKey: string, resultKey: string): RecordData {
    const date = new Date();
    const destructuredDate = destructureDate(date);

    const location = getLocation();

    const parser = Bowser.getParser(window.navigator.userAgent);
    const windowInfo = getWindowInfo(parser);

    const bandwidth = Tracker.getDeviceBandwidth();
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
      bandwidth: bandwidth,
      location: location,
      sessionLength: 0
    }
    return data;
  }

  private static getDeviceBandwidth() {
    return navigator.connection?.effectiveType || "disabled by browser"
  }
  /**
   * This function handles cleanup by removing the 'beforeunload' event listener 
   * and destroys the growthbook instance
   */
  private static handleCleanup() {
    window.removeEventListener('beforeunload', Tracker.trackSessionLength);
    window.removeEventListener('visibilitychange', Tracker.handlePageLeave);
    growthbook.destroy();
  }
}  