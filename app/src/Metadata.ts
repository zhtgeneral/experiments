export default class Metadata {
  private static _isTracking = false;
  private static _isOnPage = true;
  private static _sessionLength = 0;
  private static _recordId = "";
  private static _lastVisited = Date.now();
  private static _keylog = "";

  public static get isTracking() {
    return Metadata._isTracking;
  }
  public static setIsTracking(isTracking: boolean) {
    Metadata._isTracking = isTracking;
  }

  public static get isOnPage() {
    return Metadata._isOnPage;
  }
  public static setIsOnPage(onPage: boolean) {
    Metadata._isOnPage = onPage;
  }

  public static get sessionLength() {
    return Metadata._sessionLength;
  }
  public static setSessionLength(sessionLength: number) {
    Metadata._sessionLength = sessionLength;
  }

  public static get recordId() {
    return Metadata._recordId;
  }
  /**
   * Use this function after the tracking record is created so updates to sessionLength can be made by the client.
   */
  public static setRecordId(recordId: string) {
    Metadata._recordId = recordId;
  }

  public static get lastVisited() {
    return Metadata._lastVisited;
  }
  public static setLastVisited(lastVisited: number) {
    Metadata._lastVisited = lastVisited;
  }

  public static get keylog() {
    return Metadata._keylog;
  }
  public static incrementKeylog(keylog: string) {
    Metadata._keylog += keylog;
  }
}