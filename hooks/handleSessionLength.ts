import growthbook from "@/lib/growthbook";
import Tracker from "@/lib/Tracker";
import { useEffect } from "react";

/**
 * This function is called to handle tracking the session length.
 * 
 * It sets callback to update the session length when the user leaves closes the window.
 * 
 * It closes the growthbook instance.
 */
function HandleTrackSessionLength() {
  return useEffect(() => {
    /** 
     * THIS GETS CALLED TOO LATE.
     * THE APP REQUEST FOR THE ID, FINDS THAT IT IS MISSING, AND CONTINUES AS IF
     * NO ID WAS SET
     * SO ID NEEDS TO BE SET EARLIER, OR THE APP NEEDS TO POLL FOR UPDATED ON ID.
     * */
    growthbook.setAttributes({
      id: 888888
    })
    growthbook.init({
      streaming: true,
    });  
    console.log("all attributes: " + JSON.stringify(growthbook.getAttributes(), null, 2));
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      growthbook.destroy();
    };
  }, []);
}
export default HandleTrackSessionLength;

/**
 * @requires growthbook instance needs to have the `pageLoadTime` and `recordId` attribute set
 */
async function handleBeforeUnload() {
  const attributes = growthbook.getAttributes();
  const prevTime = attributes.pageLoadTime;
  const sessionLength = getSessionLength(prevTime);
  await Tracker.trackSessionLength(sessionLength);
};

/**
 * This helper function gets the sesion length using the time the page was loaded
 */
function getSessionLength(prevTime: number): number {
  const sessionLength = (Date.now() - prevTime) / 1000;
  return sessionLength;
}