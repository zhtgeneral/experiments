import growthbook from "@/lib/growthbook";
import Tracker from "@/lib/Tracker";

/**
 * This function is called to handle tracking the session length.
 * 
 * It sets callback to update the session length when the user closes the window.
 */
async function handleTrackSessionLength() {
  await growthbook.init({
    streaming: true,
  });  
  growthbook.setAttributes({
    id: 888888
  })
  window.addEventListener('beforeunload', handleBeforeUnload);
}
export default handleTrackSessionLength;

/**
 * This function sets the sessionLength, updates the tracker, 
 * and handles cleanup when the user leaves the page.
 * 
 * @requires growthbook instance needs to have the `pageLoadTime` and `recordId` attribute set
 */
async function handleBeforeUnload() {
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
  window.removeEventListener('beforeunload', handleBeforeUnload);
  growthbook.destroy();
}