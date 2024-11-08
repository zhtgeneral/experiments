import growthbook from "@/lib/growthbook";
import Tracker from "@/lib/Tracker";
import { useEffect } from "react";

/**
 * This function is called to handle tracking the session length.
 * It sets callback to update the session length when the user leaves closes the window.
 * It closes the growthbook instance.
 */
function HandleTrackSessionLength() {
  return useEffect(() => {
    growthbook.init({
      streaming: true,
    });  
    growthbook.setAttributes({
      id: 123456,
    })
  
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
  const sessionLength = (Date.now() - attributes.pageLoadTime) / 1000;
  console.log("Time start: " + attributes.pageLoadTime);
  const recordId = attributes.recordId;
  await Tracker.trackSessionLength(recordId, sessionLength);
};