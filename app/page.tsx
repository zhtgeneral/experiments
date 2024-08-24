'use client'

import TestComponent from "@/components/TestComponent";
import growthbook from "@/lib/growthbook";
import { GrowthBookProvider } from "@growthbook/growthbook-react";
import { useEffect } from "react";
import * as Bowser from "bowser"

export default function Home() {
  useEffect(() => {
    async function init() {
      // below makes a new exp id each refresh
      const userId = Math.random().toString(36).substring(2, 15);

      // below gets info
      const browser        = Bowser.getParser(window.navigator.userAgent).getBrowserName().toLowerCase();
      const browserVersion = Bowser.getParser(window.navigator.userAgent).getBrowserVersion();
      const os             = Bowser.getParser(window.navigator.userAgent).getOSName().toLowerCase();
      const engine         = Bowser.getParser(window.navigator.userAgent).getEngineName().toLowerCase();
      const platformType   = Bowser.getParser(window.navigator.userAgent).getPlatformType().toLowerCase();

      // below gets location
      var location: string;
      async function setAttributesInit(location: string) {
        growthbook.setAttributes({
          id: userId,
          browser: browser,
          browserVersion: browserVersion,
          os: os,
          engine: engine,
          deviceType: platformType,
          location: location
        });
        console.log('attributes: ', growthbook.getAttributes());
        await growthbook.init({
          streaming: true,
        }); 
      }
      function parseLocation(position: GeolocationPosition) {
        location = position.coords.latitude + "," + position.coords.longitude;
        console.log('location: ', location);
        setAttributesInit(location)
      }
      function parseError(error: GeolocationPositionError) {
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
        setAttributesInit(location)
      }
      navigator.geolocation.getCurrentPosition(parseLocation, parseError);
    }
    init();
  }, []);
  
  return (
    <GrowthBookProvider growthbook={growthbook}>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <TestComponent />
      </main>
    </GrowthBookProvider>
  );

}


