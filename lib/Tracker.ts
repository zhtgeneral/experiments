import axios from "axios";
import Bowser from "bowser";
import { Record } from "@prisma/client"
import growthbook from "@/lib/growthbook";
import Metadata from "@/lib/Metadata";
import { RecordData } from "@/types/RecordData";
import getLocation from "@/utils/getLocation";
import getWindowInfo from "@/utils/getWindowInfo";
import destructureDate from "@/utils/destructureDate";
import formatDigits from "@/utils/formatDigits";

export default class Tracker {
  /**
   * This function enables tracking only when the user is on the page.
   */
  public static enableTracking() {
    if (Metadata.getIsTracking()) return;
    Metadata.setIsTracking(true);

    window.addEventListener('beforeunload', Tracker.handleBeforeUnload);
    document.addEventListener('visibilitychange', Tracker.handleVisibilityChange);
    window.addEventListener('keydown', Tracker.handleKeyDown);
  }
  /**
   * This function makes a call to update the session length 
   * then removes associated event handlers.
   */
  private static async handleBeforeUnload() {
    await Tracker.trackSessionLength();
    Tracker.handleCleanup();
  };
  /**
   * This function keeps track of the windows open state
   */
  private static async handleVisibilityChange() {
    if (document.hidden) {
      Tracker.handlePageLeave();
    } else {
      Tracker.handlePageReturn();
    }
  };
  /**
   * This function keeps a log of the keys pressed
   */
  private static async handleKeyDown(ev: KeyboardEvent) {
    console.log(ev.key);
    Metadata.incrementKeylog(ev.key);
  };
  /**
   * This cleanup function removes the event listeners.
   * 
   * This should be called after the user exits the page.
   */
  public static handleCleanup() {
    if (!Metadata.getIsTracking()) return;
    Metadata.setIsTracking(false);

    window.removeEventListener('beforeunload', Tracker.handleBeforeUnload);
    document.removeEventListener('visibilitychange', Tracker.handleVisibilityChange);
    window.removeEventListener('keydown', Tracker.handleKeyDown);
    growthbook.destroy();
  }
  /**
   * This function creates a record of the current tracking session.
   * 
   * This should be used in growthbook's tracking callback.
   * @param experimentKey The key of the experiment stored on `growthbook`
   * @param resultKey The key of the result from `growthbook`
   */
  public static async createRecord(experimentKey: string, resultKey: string): Promise<Record | null> {  
    Metadata.setLastVisited(Date.now());
    const data: RecordData = Tracker.formatData(experimentKey, resultKey);
    const response = await axios.post('/api/record', data);
    const record = response.data;
    Metadata.setRecordId(record.id);
    return record as Record;
  }
  /**
   * This function uploads the total session length into database.
   * @requires TrackingRecord of the user has to be in the database
   */
  private static async trackSessionLength() {   
    if (Metadata.getOnPage()) {
      Metadata.setSessionLength(Tracker.updateSessionLength());
    }
    /** Sending Beacons do not work if trackers are blocked (for example uBlock origin on desktops) */
    if (navigator.sendBeacon) {      
      /** blob | string is the only accepted type by sendBeacon */
      const data = JSON.stringify({ 
        sessionLength: Metadata.getSessionLength(),
        keylog: Metadata.getKeylog()
      });
      const blob = new Blob([data], { type: 'application/json' });
      navigator.sendBeacon(`/api/record/${Metadata.getRecordId()}`, blob);
    } 
  }
  /**
   * This function updates the session length
   */
  private static handlePageLeave() {
    Metadata.setOnPage(false);
    Metadata.setSessionLength(Tracker.updateSessionLength());
  }
  /**
   * This function updates the time last visited
   */
  private static handlePageReturn() {
    Metadata.setOnPage(true);
    Metadata.setLastVisited(Date.now());
  }
  /**
   * This function gets the new session time using the last visited time
   * plus the new session length.
   */
  private static updateSessionLength(): number {
    const newSessionLength = Tracker.getSessionLength(Metadata.getLastVisited());
    return formatDigits(Metadata.getSessionLength() +  newSessionLength);
  }
  /**
   * This helper function gets the sesion length using the last visited time
   */
  public static getSessionLength(lastVisited: number): number {
    const sessionLength = (Date.now() - lastVisited) / 1000;
    return sessionLength;
  }
  /**
   * This function formats the data needed for a tracking record.
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
    }
    return data;
  }
  /**
   * This function gets the bandwith of the user   
   * 
   * Note: only works for Chrome, Edge, and Opera
   * @link https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/effectiveType
   */
  private static getDeviceBandwidth() {
    return navigator.connection?.effectiveType || "disabled"
  }
}  