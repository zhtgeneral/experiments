import Tracker from "@/Tracker";
import destructureDate from "@/utils/destructureDate";
import { GrowthBook } from "@growthbook/growthbook-react";
import { Record } from "@prisma/client";

const growthbook = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY,
  enableDevMode: true,
  trackingCallback: async (experiment, result) => {
    const date = new Date();
    const dateDestructure = destructureDate(date);
    const attributes = growthbook.getAttributes();

    const record: Record = {
      id: attributes.id,
      experimentId: experiment.key,
      variationId: result.key,
      weekday: dateDestructure.weekday,
      day: dateDestructure.day,
      month: dateDestructure.month,
      year: dateDestructure.year,
      time: dateDestructure.time,
      createdAt: date,
      timeRegion: dateDestructure.timeRegion,
      browser: attributes.browser,
      browserVersion: attributes.browserVersion,
      os: attributes.os,
      engine: attributes.engine,
      platformType: attributes.deviceType,
      location: attributes.location,
      sessionLength: null
    }
    await Tracker.createRecord(record);
  },
});
export default growthbook;


