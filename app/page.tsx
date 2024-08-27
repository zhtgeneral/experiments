'use client'

import TestComponent from "@/components/TestComponent";
import growthbook from "@/lib/growthbook";
import { GrowthBookProvider } from "@growthbook/growthbook-react";
import { useEffect } from "react";
import * as Bowser from "bowser"
import axios from "axios";
import getUserId from "@/hooks/getUserId";

export default function Home() {
  useEffect(() => {
    // below makes a new exp id each refresh
    // const userId = Math.random().toString(36).substring(2, 15);

    // below makes a new exp id every 5 min
    const userId = getUserId();
    
    async function init() {
      // below gets info
      const parser = Bowser.getParser(window.navigator.userAgent)
      const browser        = parser.getBrowserName().toLowerCase();
      const browserVersion = parser.getBrowserVersion();
      const os             = parser.getOSName().toLowerCase();
      const engine         = parser.getEngineName().toLowerCase();
      const platformType   = parser.getPlatformType().toLowerCase();

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
          location: location,
          pageLoadTime: Date.now()
        });
        await growthbook.init({
          streaming: true,
        }); 
      }
      function parseLocation(position: GeolocationPosition) {
        location = position.coords.latitude + "," + position.coords.longitude;
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

    // below tracks experiment viewed when leaving the page
    const handleBeforeUnload = () => {
      const timeSpentOnPage = (Date.now() - growthbook.getAttributes().pageLoadTime) / 1000; console.log("Time spent on page:", timeSpentOnPage);

      growthbook.setAttributes({ 
        timeSpentOnPage: timeSpentOnPage.toString()
      });

      async function update() {
        const attributes = growthbook.getAttributes();
        const data = {
          timeSpentOnPage: attributes.timeSpentOnPage
        } 
        await axios.put(`/api/record/${userId}`, data)      
      }
      update()
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  return (
    <GrowthBookProvider growthbook={growthbook}>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <TestComponent />
      </main>
    </GrowthBookProvider>
  );

}


