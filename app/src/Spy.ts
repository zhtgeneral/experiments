import Tracker from '@/app/src/Tracker';
import Metadata from '@/app/src/Metadata';

const keylogDebug = true;
const visibilityDebug = true;

export default class Spy {
  /**    
   * The user's session length is saved locally and uploaded to DB on page refresh/close.
   * 
   * The session length is only incremented when the user's window is open.
   * 
   * The user's key press is saved locally and uploaded to DB on page refresh/close
   */
  public static addListeners() {
    /** Updates session length to DB when exiting */
    window.addEventListener('beforeunload', Spy.handleBeforeUnload);
    /** Updates session length locally when user clicks off */
    document.addEventListener('visibilitychange', Spy.handleVisibilityChange);
    /** Key logging */
    window.addEventListener('keydown', Spy.handleKeyDown);
  }

  /**
   * This cleanup function removes the event listeners.
   * 
   * This should be called after the user exits the page.
   */
  public static removeListeners() {
    window.removeEventListener('beforeunload', Spy.handleBeforeUnload);
    document.removeEventListener('visibilitychange', Spy.handleVisibilityChange);
    window.removeEventListener('keydown', Spy.handleKeyDown);
  }

  /**
   * This function makes a call to update the session length 
   * then removes associated event handlers.
   */
  private static async handleBeforeUnload() {
    await Tracker.trackSessionLength();

    Spy.removeListeners();
  };

  /**
   * This function keeps track of the windows open state
   */
  private static async handleVisibilityChange() {
    visibilityDebug? console.log("Page hidden: " + document.hidden) : '';
    if (document.hidden === true) {
      await Tracker.handlePageLeave();
    } else {
      Tracker.handlePageReturn();
    }
  };

  /**
   * This function keeps a log of the keys pressed
   */
  private static async handleKeyDown(ev: KeyboardEvent) {
    keylogDebug? console.log("Key logged: " + ev.key) : '';    
    Metadata.incrementKeylog(ev.key);
  };
}