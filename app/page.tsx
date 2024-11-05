'use client'

import ExperimentPage from "@/components/Experiment";
import growthbook from "@/lib/growthbook";
import { GrowthBookProvider } from "@growthbook/growthbook-react";
import { useEffect } from "react";
import * as Bowser from "bowser"
import getUserId from "@/utils/getUserId";
import Tracker from "@/Tracker";
import parsePosition from "@/utils/parseLocation";
import getWindowInfo from "@/utils/getWindowInfo";

export default function Home() {
  useEffect(() => {
    const userId = getUserId();
    
    const parser = Bowser.getParser(window.navigator.userAgent);
    const windowInfo = getWindowInfo(parser);
    
    var location: string;
    const geo = navigator.geolocation;
    geo.getCurrentPosition(
      (position: GeolocationPosition) => {
        location = parsePosition(position);
        initAttributes(location);
      }, 
      (error: GeolocationPositionError) => {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            location = "denied"
            break;
          case error.POSITION_UNAVAILABLE:
            location = "unavailable"
            break;
          case error.TIMEOUT:
            location = "timed out"
            break;
          default:
            location = "error";
            break;
        }
        initAttributes(location);
      }
    );

    async function initAttributes(location: string) {
      growthbook.setAttributes({
        id: userId,
        browser: windowInfo.browser,
        browserVersion: windowInfo.browserVersion,
        os: windowInfo.os,
        engine: windowInfo.engine,
        deviceType: windowInfo.platformType,
        location: location,
        pageLoadTime: Date.now()
      });
      await growthbook.init({
        streaming: true,
      }); 
    }

    const handleBeforeUnload = async () => {
      const attributes = growthbook.getAttributes();
      const sessionLength = (Date.now() - attributes.pageLoadTime) / 1000; 

      growthbook.setAttributes({ sessionLength: sessionLength.toString() });    
      await Tracker.trackSessionLength(userId, sessionLength);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  return (
    <GrowthBookProvider growthbook={growthbook}>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <ExperimentPage />
      </main>
    </GrowthBookProvider>
  );

}


