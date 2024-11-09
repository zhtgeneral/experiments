import growthbook from "@/lib/growthbook";
import Tracker from "@/lib/Tracker";
import { useGrowthBook } from "@growthbook/growthbook-react";

/**
 * This function makes sure session length is tracked when window is unloaded
 */
function enableTracking() {
  window.addEventListener('beforeunload', handleSessionLength);
}
export default enableTracking;

/**
 * This function sets the sessionLength in the tracker and 
 * 
 * @requires growthbook instance needs to have the `pageLoadTime` and `recordId` attribute set
 */
async function handleSessionLength() {
  const attributes = growthbook.getAttributes();
  const sessionLength = getSessionLength(attributes.pageLoadTime);
  await Tracker.trackSessionLength(sessionLength);
  handleCleanup();
};

/**
 * This helper function gets the sesion length using the time the page was loaded
 */
function getSessionLength(pageLoadTime: number): number {
  const sessionLength = (Date.now() - pageLoadTime) / 1000;
  return sessionLength;
}

/**
 * This function handles cleanup by removing the 'beforeunload' event listener 
 * and destroys the growthbook instance
 */
function handleCleanup() {
  window.removeEventListener('beforeunload', handleSessionLength);
  growthbook.destroy();
}