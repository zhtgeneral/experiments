import { Record } from "@prisma/client";
import axios from "axios";

export default class Tracker {
  /**
   * This function creates a record of the current tracking session
   */
  public static async createRecord(record: Record) {
    console.log("record: " + JSON.stringify(record, null , 2));
    await axios.post('/api/record', record);
  }

  /**
   * Fills in the session length for a tracking record
   * @requires The tracking record of the user has to be in the database
   * @param userId The userId of the user from `getUserId()`
   * @param sessionLength The session length from Growthbook attributes
   */
  public static async trackSessionLength(userId: string, sessionLength: number) {    
    const data = {
      sessionLength: sessionLength.toString()
    } 
    const response = await axios.put(`/api/record/${userId}`, data, );
    console.log("updated record: " + JSON.stringify(response.data, null, 2))
  }
}