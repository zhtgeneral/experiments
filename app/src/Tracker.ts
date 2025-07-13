import axios from "axios";
import { Record } from "@prisma/client"

import Spy from "@/app/src/Spy";
import Metadata from "@/app/src/Metadata";
import { RecordData } from "@/app/types/RecordData";

import growthbook from "@/app/lib/growthbook";
import formatDigits from "@/app/utils/formatDigits";
import formatData from "@/app/utils/formatData";

const debug = false;

export default class Tracker {
  /**
   * Enable tracking only 
   * 
   * This should be called when the user first visits the page.
   */
  public static enableTracking() {
    if (Metadata.isTracking === false) {
      Metadata.setIsTracking(true);
      Spy.addListeners();
    }
  }

  /**
   * Removes the event listeners and closes any libraries.
   * 
   * This should be called after the user exits the page.
   */
  public static handleCleanup() {
    if (Metadata.isTracking === true) {
      Metadata.setIsTracking(false);
      Spy.removeListeners();    
      growthbook.destroy();  
    }
  }

  /**
   * This function creates a record of the current tracking session.
   * 
   * This should be used in growthbook's tracking callback.
   * 
   * @param experimentKey The key of the experiment stored on `growthbook`
   * @param resultKey The key of the result from `growthbook`
   */
  public static async createRecord(experimentKey: string, resultKey: string): Promise<Record | null> {  
    Metadata.setLastVisited(Date.now());
  
    const data: RecordData = formatData(experimentKey, resultKey);
    const response = await axios.post('/api/record', { recordData: data });

    if (!response.data.success) {
      return null;
    }
    
    const { newRecord } = response.data;
    debug? console.log("newRecord: " + JSON.stringify(newRecord, null, 2)): '';

    Metadata.setRecordId(newRecord.id);
    debug? console.log("Metadata set recordId: " + Metadata.recordId): '';

    return newRecord as Record;
  }

  /**
   * This function uploads the total session length into database.
   * 
   * @requires TrackingRecord of the user has to be in the database
   */
  public static async trackSessionLength() {   
    if (Metadata.isOnPage === true) {
      Tracker.updateSessionLength();
    }

    if (!Metadata.recordId || Metadata.recordId === 'undefined') {
      console.warn("recordId is missing from Metadata, skipping sendBeacon");
      return;
    }

    /** Sending Beacons do not work if trackers are blocked (for example uBlock origin on desktops) */
    if (navigator.sendBeacon) {      
      /** blob | string is the only accepted type by sendBeacon */
      const data = JSON.stringify({ 
        sessionLength: Metadata.sessionLength,
        keylog: Metadata.keylog
      });
      const blob = new Blob([data], { type: 'application/json' });
      /** WARNING: sendBeacon is a POST request, not a PUT request */
      navigator.sendBeacon(`/api/record/${Metadata.recordId}`, blob);
    } 
  }

  /**
   * Save the existing session length to database when the user leaves the window
   */
  public static async handlePageLeave() {
    Tracker.updateSessionLength();
    await Tracker.trackSessionLength();
    Metadata.setIsOnPage(false);
  }

  /**
   * Reset the last visited time when the user returns to the window.
   */
  public static handlePageReturn() {
    Metadata.setIsOnPage(true);
    Metadata.setLastVisited(Date.now());
  }

  /**
   * This function gets the new session time using the last visited time
   * plus the new session length.
   */
  private static updateSessionLength() {
    if (Metadata.isOnPage === true) {
      let newSessionLength = Tracker.getSessionLength(Metadata.lastVisited);
      newSessionLength = formatDigits(Metadata.sessionLength +  newSessionLength);
      Metadata.setSessionLength(newSessionLength);
    }
  }

  /**
   * This helper function gets the sesion length using the last visited time
   */
  public static getSessionLength(lastVisited: number): number {
    const sessionLength = (Date.now() - lastVisited) / 1000;
    return sessionLength;
  }

  /**
   * This function gets the bandwith of the user   
   * 
   * Note: only works for Chrome, Edge, and Opera
   * @link https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/effectiveType
   */
  public static getDeviceBandwidth() {
    return navigator.connection?.effectiveType || "disabled"
  }
}  