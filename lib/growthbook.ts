import { GrowthBook } from "@growthbook/growthbook-react";
import axios from "axios";

const growthbook = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY,
  enableDevMode: true,
  trackingCallback: (experiment, result) => {
    const date = (new Date()).toUTCString();
    const parts = date.split(" ");
    const weekday    = parts[0].slice(0, -1);  // Remove the comma
    const day        = parts[1];
    const month      = parts[2];
    const year       = parts[3];
    const time       = parts[4];
    const timeRegion = parts[5];
    const attributes = growthbook.getAttributes();
      
    console.log("Viewed Experiment", {
      experimentId: experiment.key,
      variationId: result.key,
      weekday: weekday,
      day: day,
      month: month,
      year: year,
      time: time,
      timeRegion: timeRegion,
      browser: attributes.browser,
      browserVersion: attributes.browserVersion,
      os: attributes.os,
      engine: attributes.engine,
      platformType: attributes.deviceType,
      location: attributes.location,
    });
    
    async function createRecord() {
      const newRecord = {
        id: attributes.id,
        experimentId: experiment.key,
        variationId: result.key,
        weekday: weekday,
        day: day,
        month: month,
        year: year,
        time: time,
        timeRegion: timeRegion,
        browser: attributes.browser,
        browserVersion: attributes.browserVersion,
        os: attributes.os,
        engine: attributes.engine,
        platformType: attributes.deviceType,
        location: attributes.location,
        timeSpentOnPage: null
      }
      await axios.post('/api/record', newRecord)
    }
    createRecord();
  },
});
export default growthbook;


