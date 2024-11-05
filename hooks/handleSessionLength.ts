import growthbook from "@/lib/growthbook";
import Tracker from "@/Tracker";
import getUserId from "@/utils/getUserId";
import getWindowInfo from "@/utils/getWindowInfo";
import parsePosition from "@/utils/parseLocation";
import Bowser from "bowser";
import { useEffect } from "react";

const HandleTrackSessionLength = () => {
  return useEffect(() => {
    const userId = getUserId();

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
    
    /** Async utility put inside a function because `useEffect` doesn't allow for async */
    async function initAttributes(location: string) {
      const parser = Bowser.getParser(window.navigator.userAgent);
      const windowInfo = getWindowInfo(parser);
      
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
}
export default HandleTrackSessionLength;