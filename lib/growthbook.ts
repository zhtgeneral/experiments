import { GrowthBook } from "@growthbook/growthbook-react";
import Tracker from "@/lib/Tracker";

const growthbook = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY,
  enableDevMode: true,
  trackingCallback: async (experiment, result) => {
    const record = await Tracker.createRecord(experiment.key, result.key);    
  },
});
export default growthbook;


